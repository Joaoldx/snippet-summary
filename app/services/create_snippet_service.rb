require "ostruct"

class CreateSnippetService
  def self.call(text:)
    new(text: text).call
  end
  
    def initialize(text:)
      @text = text
      @snippet = nil
    end
  
  def call
    return failure("o parâmetro text é obrigatório") if @text.blank?

    result = nil
    error_occurred = false
    
    ActiveRecord::Base.transaction do
      @snippet = Snippet.new(text: @text)
      
      unless @snippet.save
        return failure(@snippet.errors.full_messages)
      end

      begin
        summary = GeminiService.summarize(@snippet.text)
        @snippet.update!(summary: summary)
        result = success(@snippet)
      rescue StandardError => e
        @error_message = e.message
        error_occurred = true
        Rails.logger.error "Erro ao gerar resumo: #{@error_message}"
        raise ActiveRecord::Rollback
      end
    end
    
    if error_occurred
      @snippet&.destroy
      return failure("Falha ao gerar resumo: #{@error_message}")
    end
    
    result
  end
  
    private
  
    def success(snippet)
      OpenStruct.new(
        success?: true,
        snippet: snippet,
        errors: []
      )
    end
  
    def failure(errors)
      OpenStruct.new(
        success?: false,
        snippet: nil,
        errors: Array(errors)
      )
    end
  end