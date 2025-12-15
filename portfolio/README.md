# AlexandreDFM

This is the portfolio section of AlexandreDFM's projects, showcasing various applications and tools.
The portfolio includes only the real frontend, the backend is a light version of the real backend, with limited functionality and data.

## Installation

```bash
ln -s ./env/.env.template .env
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
yarn dev
```

If you want to run a backend server, you can use:

```bash
docker compose up -d
```

This will start a directus instance server on `http://localhost:8055`.
(https://docs.directus.io/getting-started/installation/)
The directus instance is configured with a simple database and a few collections they are in the `directus-database` folder.

## Production

Build the application for production:

```bash
yarn build
```

Build the docker dev image:

```bash
docker build -t frontend . -f Dockerfile.dev
```

Build the docker production image:

```bash
docker build -t frontend .
```

## Urls

- Backend: http://localhost:3000
- Frontend: http://localhost:8080
