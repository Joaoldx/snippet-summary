require "net/http"
require "json"
require "uri"

class GeminiService
  BASE_URL = "https://generativelanguage.googleapis.com"

  def self.summarize(text)
    new.summarize(text)
  end

  def summarize(text)
    api_key = ENV.fetch("GEMINI_API_KEY", nil)
    model = ENV.fetch("GEMINI_MODEL", "gemini-2.5-flash")

    if api_key.blank?
      raise ArgumentError, "A variável de ambiente GEMINI_API_KEY é obrigatória"
    end

    uri = URI("#{BASE_URL}/v1beta/models/#{model}:generateContent?key=#{api_key}")
    http = Net::HTTP.new(uri.host, uri.port)
    http.use_ssl = true

    request = Net::HTTP::Post.new(uri)
    request["Content-Type"] = "application/json"

    prompt = "Faça um resumo curto e objetivo do seguinte texto: #{text}"
    request.body = {
      contents: [{
        role: "user",
        parts: [{ text: prompt }]
      }]
    }.to_json

    response = http.request(request)

    if response.code == "200"
      data = JSON.parse(response.body)
      summary = data.dig("candidates", 0, "content", "parts", 0, "text")
      summary&.strip
    else
      Rails.logger.error "Erro na API Gemini: #{response.code} - #{response.body}"
      raise StandardError, "Falha ao gerar resumo da API Gemini"
    end
  rescue JSON::ParserError => e
    Rails.logger.error "Falha ao analisar resposta da Gemini: #{e.message}"
    raise StandardError, "Falha ao analisar resposta da API Gemini"
  rescue StandardError => e
    Rails.logger.error "Erro no serviço Gemini: #{e.message}"
    raise
  end
end

