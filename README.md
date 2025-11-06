# Desafio Pluga

Aplicação full-stack com backend Rails e frontend Next.js.

## Pré-requisitos

- Docker
- Docker Compose

## Configuração

1. Execute o script de setup para criar o arquivo `.env`:
   ```bash
   ./setup-env.sh
   ```

   Ou crie manualmente o arquivo `.env` na raiz do projeto com:
   ```bash
   RAILS_MASTER_KEY=$(cat backend/config/master.key)
   ```

2. **Configure a chave da API do Gemini** (obrigatório):
   - Obtenha sua chave em: https://makersuite.google.com/app/apikey
   - Edite o arquivo `.env` e substitua `your_gemini_api_key_here` pela sua chave

3. (Opcional) Edite o arquivo `.env` se precisar alterar outras configurações

## Executando com Docker Compose

### Subir todos os serviços

```bash
docker-compose up -d
```

### Ver logs

```bash
# Todos os serviços
docker-compose logs -f

# Apenas backend
docker-compose logs -f backend

# Apenas frontend
docker-compose logs -f frontend

# Apenas banco de dados
docker-compose logs -f postgres
```

### Parar os serviços

```bash
docker-compose down
```

### Parar e remover volumes (apaga dados do banco)

```bash
docker-compose down -v
```

### Reconstruir as imagens

```bash
docker-compose build --no-cache
```

## Serviços

- **Backend (Rails)**: http://localhost:3000
- **Frontend (Next.js)**: http://localhost:4000
- **PostgreSQL**: localhost:5432

## Estrutura do Projeto

```
desafio-pluga/
├── backend/          # Aplicação Rails
├── frontend/         # Aplicação Next.js
└── docker-compose.yml
```

## Variáveis de Ambiente

As variáveis de ambiente podem ser configuradas no arquivo `.env` na raiz do projeto:

### Obrigatórias

- `RAILS_MASTER_KEY`: Chave master do Rails (obrigatório)
- `GEMINI_API_KEY`: Chave da API do Google Gemini (obrigatório)
  - Obtenha em: https://makersuite.google.com/app/apikey

### Opcionais

- `POSTGRES_USER`: Usuário do PostgreSQL (padrão: postgres)
- `POSTGRES_PASSWORD`: Senha do PostgreSQL (padrão: postgres)
- `POSTGRES_DB`: Nome do banco de dados (padrão: backend_development)
- `ALLOWED_ORIGINS`: Origens permitidas para CORS (padrão: http://localhost:4000,http://localhost:3000)
- `NEXT_PUBLIC_API_URL`: URL da API para o frontend (padrão: http://localhost:3000)
- `GEMINI_MODEL`: Modelo do Gemini a ser usado (padrão: gemini-2.5-flash)

