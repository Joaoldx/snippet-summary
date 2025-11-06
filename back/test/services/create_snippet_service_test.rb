require "test_helper"

class CreateSnippetServiceTest < ActiveSupport::TestCase
  def setup
    @original_api_key = ENV["GEMINI_API_KEY"]
    ENV["GEMINI_API_KEY"] = "test_api_key"
  end

  def teardown
    ENV["GEMINI_API_KEY"] = @original_api_key if @original_api_key
    Snippet.destroy_all
  end

  test "call creates snippet with summary successfully" do
    text = "Este é um texto de teste"
    expected_summary = "Resumo do texto de teste"

    stub_gemini_service(expected_summary) do
      result = CreateSnippetService.call(text: text)

      assert result.success?
      assert_not_nil result.snippet
      assert_equal text, result.snippet.text
      assert_equal expected_summary, result.snippet.summary
      assert_empty result.errors
      assert result.snippet.persisted?
    end
  end

  test "call returns failure when text is blank" do
    result = CreateSnippetService.call(text: "")

    assert_not result.success?
    assert_nil result.snippet
    assert_includes result.errors, "o parâmetro text é obrigatório"
  end

  test "call returns failure when text is nil" do
    result = CreateSnippetService.call(text: nil)

    assert_not result.success?
    assert_nil result.snippet
    assert_includes result.errors, "o parâmetro text é obrigatório"
  end

  test "call returns failure when snippet validation fails" do
    # Criar um snippet que falha na validação (text vazio)
    result = CreateSnippetService.call(text: "")

    assert_not result.success?
    assert_nil result.snippet
    assert_not_empty result.errors
  end

  test "call destroys snippet and returns failure when GeminiService fails" do
    text = "Texto de teste"
    error_message = "Falha ao gerar resumo da API Gemini"

    stub_gemini_service_with_error(error_message) do
      result = CreateSnippetService.call(text: text)

      assert_not result.success?
      assert_nil result.snippet
      assert_includes result.errors, "Falha ao gerar resumo: #{error_message}"
      assert_equal 0, Snippet.count, "Snippet should be destroyed on error"
    end
  end

  test "call uses transaction to ensure atomicity" do
    text = "Texto de teste"
    error_message = "Erro na API"

    stub_gemini_service_with_error(error_message) do
      initial_count = Snippet.count
      result = CreateSnippetService.call(text: text)

      assert_not result.success?
      assert_equal initial_count, Snippet.count, "Transaction should rollback"
    end
  end

  test "call updates snippet with summary after successful GeminiService call" do
    text = "Texto para resumir"
    summary = "Resumo gerado"

    stub_gemini_service(summary) do
      result = CreateSnippetService.call(text: text)

      assert result.success?
      snippet = Snippet.find(result.snippet.id)
      assert_equal summary, snippet.summary
      assert_equal text, snippet.text
    end
  end

  test "call can be called via class method" do
    text = "Teste via class method"
    summary = "Resumo"

    stub_gemini_service(summary) do
      result = CreateSnippetService.call(text: text)

      assert result.success?
      assert_equal text, result.snippet.text
    end
  end

  test "call can be called via instance method" do
    text = "Teste via instance method"
    summary = "Resumo"

    stub_gemini_service(summary) do
      service = CreateSnippetService.new(text: text)
      result = service.call

      assert result.success?
      assert_equal text, result.snippet.text
    end
  end

  test "call handles multiple errors in errors array" do
    result = CreateSnippetService.call(text: "")

    assert_not result.success?
    assert result.errors.is_a?(Array)
  end

  test "call returns success object with correct structure" do
    text = "Texto válido"
    summary = "Resumo"

    stub_gemini_service(summary) do
      result = CreateSnippetService.call(text: text)

      assert result.respond_to?(:success?)
      assert result.respond_to?(:snippet)
      assert result.respond_to?(:errors)
      assert result.success?
      assert result.snippet.is_a?(Snippet)
      assert result.errors.is_a?(Array)
    end
  end

  test "call returns failure object with correct structure" do
    result = CreateSnippetService.call(text: "")

    assert result.respond_to?(:success?)
    assert result.respond_to?(:snippet)
    assert result.respond_to?(:errors)
    assert_not result.success?
    assert_nil result.snippet
    assert result.errors.is_a?(Array)
  end

  private

  def stub_gemini_service(return_value)
    original_summarize = GeminiService.method(:summarize)
    GeminiService.define_singleton_method(:summarize) { |_| return_value }
    
    begin
      yield
    ensure
      GeminiService.define_singleton_method(:summarize, original_summarize)
    end
  end

  def stub_gemini_service_with_error(error_message)
    original_summarize = GeminiService.method(:summarize)
    GeminiService.define_singleton_method(:summarize) { |_| raise StandardError, error_message }
    
    begin
      yield
    ensure
      GeminiService.define_singleton_method(:summarize, original_summarize)
    end
  end
end

