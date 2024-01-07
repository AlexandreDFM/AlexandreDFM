# AlexandreDFM

An Epseed Technical Test

## Installation

```bash
ln -s ./env/.env.template .env
```

```bash
cd backend
yarn install
```

```bash
cd frontend
yarn install
```

## Docker development

```bash
docker compose up -d
```

or

```bash
docker-compose up -d
```

## Development Server

Start the development server on `http://localhost:3000`:

```bash
cd backend
yarn dev
```

```bash
cd frontend
yarn dev
```

## Production

Build the application for production:

```bash
cd backend
yarn build
```

```bash
cd frontend
yarn build
```

## Urls

- Backend: http://localhost:3000
- Swagger: http://localhost:3000/api/inventory/

- Frontend: http://localhost:8080
