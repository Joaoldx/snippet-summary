class SnippetsController < ApplicationController
  before_action :set_snippet, only: [:show]

  # POST /snippets
  def create
    result = CreateSnippetService.call(text: params[:text])

    if result.success?
      render json: result.snippet.as_json(only: [:id, :text, :summary]), 
             status: :created
    else
      render json: { error: result.errors.first }, 
             status: :unprocessable_entity
    end
  end

  # GET /snippets/:id
  def show
    render json: @snippet.as_json(only: [:id, :text, :summary])
  end

  # GET /snippets
  def index
    @snippets = Snippet.all.order(created_at: :desc)
    render json: @snippets.as_json(only: [:id, :text, :summary])
  end

  private

  def set_snippet
    @snippet = Snippet.find(params[:id])
  rescue ActiveRecord::RecordNotFound
    render json: { error: "Snippet não encontrado" }, status: :not_found
  end
end