require "test_helper"
require "net/http"

class GeminiServiceTest < ActiveSupport::TestCase
  def setup
    @original_api_key = ENV["GEMINI_API_KEY"]
    @original_model = ENV["GEMINI_MODEL"]
    ENV.delete("GEMINI_API_KEY")
    ENV.delete("GEMINI_MODEL")
  end

  def teardown
    ENV["GEMINI_API_KEY"] = @original_api_key if @original_api_key
    ENV["GEMINI_MODEL"] = @original_model if @original_model
  end

  test "summarize returns summary when API call succeeds" do
    ENV["GEMINI_API_KEY"] = "test_api_key"
    text = "Este é um texto de teste para resumir"
    expected_summary = "Resumo do texto de teste"

    mock_response = create_mock_response(200, {
      "candidates" => [{
        "content" => {
          "parts" => [{ "text" => expected_summary }]
        }
      }]
    })

    stub_http_request(mock_response) do
      result = GeminiService.summarize(text)
      assert_equal expected_summary, result
    end
  end

  test "summarize raises ArgumentError when GEMINI_API_KEY is not set" do
    assert_raises(ArgumentError) do
      GeminiService.summarize("test text")
    end
  end

  test "summarize raises StandardError when API returns non-200 status" do
    ENV["GEMINI_API_KEY"] = "test_api_key"
    mock_response = create_mock_response(500, { "error" => "Internal Server Error" })

    stub_http_request(mock_response) do
      assert_raises(StandardError) do
        GeminiService.summarize("test text")
      end
    end
  end

  test "summarize raises StandardError when JSON parsing fails" do
    ENV["GEMINI_API_KEY"] = "test_api_key"
    mock_response = create_mock_response(200, "invalid json")

    stub_http_request(mock_response) do
      assert_raises(StandardError) do
        GeminiService.summarize("test text")
      end
    end
  end

  test "summarize uses default model when GEMINI_MODEL is not set" do
    ENV["GEMINI_API_KEY"] = "test_api_key"
    text = "test text"
    expected_summary = "Resumo"

    mock_response = create_mock_response(200, {
      "candidates" => [{
        "content" => {
          "parts" => [{ "text" => expected_summary }]
        }
      }]
    })

    captured_uri = nil
    stub_http_request(mock_response) do |http|
      http.define_singleton_method(:request) do |request|
        captured_uri = request.uri
        mock_response
      end
      GeminiService.summarize(text)
    end

    assert captured_uri.to_s.include?("gemini-2.5-flash"), "Should use default model gemini-2.5-flash"
  end

  test "summarize uses custom model when GEMINI_MODEL is set" do
    ENV["GEMINI_API_KEY"] = "test_api_key"
    ENV["GEMINI_MODEL"] = "gemini-pro"
    text = "test text"
    expected_summary = "Resumo"

    mock_response = create_mock_response(200, {
      "candidates" => [{
        "content" => {
          "parts" => [{ "text" => expected_summary }]
        }
      }]
    })

    captured_uri = nil
    stub_http_request(mock_response) do |http|
      http.define_singleton_method(:request) do |request|
        captured_uri = request.uri
        mock_response
      end
      GeminiService.summarize(text)
    end

    assert captured_uri.to_s.include?("gemini-pro"), "Should use custom model gemini-pro"
  end

  test "summarize strips whitespace from summary" do
    ENV["GEMINI_API_KEY"] = "test_api_key"
    text = "test text"
    summary_with_whitespace = "  Resumo com espaços  \n"

    mock_response = create_mock_response(200, {
      "candidates" => [{
        "content" => {
          "parts" => [{ "text" => summary_with_whitespace }]
        }
      }]
    })

    stub_http_request(mock_response) do
      result = GeminiService.summarize(text)
      assert_equal "Resumo com espaços", result
    end
  end

  test "summarize handles nil summary gracefully" do
    ENV["GEMINI_API_KEY"] = "test_api_key"
    text = "test text"

    mock_response = create_mock_response(200, {
      "candidates" => [{
        "content" => {
          "parts" => [{ "text" => nil }]
        }
      }]
    })

    stub_http_request(mock_response) do
      result = GeminiService.summarize(text)
      assert_nil result
    end
  end

  test "summarize handles empty candidates array" do
    ENV["GEMINI_API_KEY"] = "test_api_key"
    text = "test text"

    mock_response = create_mock_response(200, {
      "candidates" => []
    })

    stub_http_request(mock_response) do
      result = GeminiService.summarize(text)
      assert_nil result
    end
  end

  private

  def create_mock_response(status_code, body)
    response_body = body.is_a?(String) ? body : body.to_json
    response_class = status_code == 200 ? Net::HTTPSuccess : Net::HTTPResponse
    response = response_class.new("1.1", status_code.to_s, "OK")
    response.instance_variable_set(:@read, true)
    response.instance_variable_set(:@body, response_body)
    response.define_singleton_method(:body) { @body }
    response.define_singleton_method(:code) { status_code.to_s }
    response
  end

  def stub_http_request(mock_response)
    http_client = Object.new
    http_client.define_singleton_method(:use_ssl=) { |_| true }
    http_client.define_singleton_method(:request) { |_| mock_response }

    original_new = Net::HTTP.method(:new)
    Net::HTTP.define_singleton_method(:new) { |*_| http_client }
    
    begin
      yield http_client if block_given?
    ensure
      Net::HTTP.define_singleton_method(:new, original_new)
    end
  end
end

