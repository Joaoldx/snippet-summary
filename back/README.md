# Snippet Summary
required: 
 - ruby 3.4.7
 - rails 8.1.1
 - postgres 13


### To run the application, execute the following scripts

```bash
bundle install
```

```bash
rails db:create
```

```bash
rails db:migrate
```

```bash
rails server
```

```docker
docker run -d -p 3000:80 --name snippet-summary \
  --env-file .env \
  -e RAILS_MASTER_KEY=$(cat config/master.key) \
  -e BACKEND_DATABASE_PASSWORD=$(grep DB_PASSWORD .env | cut -d '=' -f2) \
  -e DB_HOST=172.17.0.1 \
  -e DB_USERNAME=postgres \
  -e DB_PASSWORD=$(grep DB_PASSWORD .env | cut -d '=' -f2) \
  -e DB_PORT=5432 \
  -e DB_NAME=backend_development \
  snippet-summary
  ```