#!/bin/bash

# Script para criar arquivo .env a partir do master.key

if [ ! -f "backend/config/master.key" ]; then
    echo "Erro: Arquivo backend/config/master.key não encontrado!"
    exit 1
fi

RAILS_MASTER_KEY=$(cat backend/config/master.key)

cat > .env << EOF
# Rails Master Key
RAILS_MASTER_KEY=${RAILS_MASTER_KEY}

# Database Configuration
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=backend_development

# Backend Configuration
DB_HOST=postgres
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_NAME=backend_development
BACKEND_DATABASE_PASSWORD=postgres

# CORS Configuration
ALLOWED_ORIGINS=http://localhost:4000,http://localhost:3000

# Frontend Configuration
NEXT_PUBLIC_API_URL=http://localhost:3000

# Gemini API Configuration (obrigatório)
# Obtenha sua chave em: https://makersuite.google.com/app/apikey
GEMINI_API_KEY=your_gemini_api_key_here
GEMINI_MODEL=gemini-2.5-flash
EOF

echo "Arquivo .env criado com sucesso!"
echo ""
echo "⚠️  IMPORTANTE: Configure a chave da API do Gemini no arquivo .env:"
echo "   1. Obtenha sua chave em: https://makersuite.google.com/app/apikey"
echo "   2. Edite o arquivo .env e substitua 'your_gemini_api_key_here' pela sua chave"
echo ""
echo "Você pode editar o arquivo .env se necessário antes de executar docker-compose up"

