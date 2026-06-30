# Movie Backend API

A TypeScript-based backend service for movie discovery, user authentication, and profile management. The API integrates with The Movie Database (TMDB), stores user data in PostgreSQL through Prisma, and uses Redis for caching movie responses.

## Features

- User registration, login, logout, token refresh, password changes, and profile retrieval
- JWT-based authentication with refresh-token support
- Movie discovery endpoints for popular, top-rated, upcoming, latest, now-playing, search, genre, and date-range queries
- TMDB integration for movie metadata and cast information
- Redis caching to speed up repeated movie requests
- Prisma + PostgreSQL persistence for users, watchlists, and reviews
- Security middleware with CORS, Helmet, and structured error handling

## Tech Stack

- Node.js + Express.js
- TypeScript
- Prisma ORM
- PostgreSQL
- Redis
- TMDB API via Axios
- JWT and bcryptjs
- Cookie-based refresh token handling

## Project Structure

```text
src/
  app/                # Express app bootstrap, routing, and server startup
  database/           # Prisma client and schema
  middlewares/        # Auth and error handling middleware
  modules/
    auth/             # Authentication routes, controllers, services, repository
    movies/           # Movie routes, controllers, services, repository
  utils/              # Logger, token generation, Redis, email helper, secret generator
``` 

## Prerequisites

Before running the project, make sure you have:

- Node.js 18+
- pnpm
- PostgreSQL running
- Redis running
- A TMDB API key

## Installation

1. Clone the repository
   ```bash
   git clone <repository-url>
   cd movie-be
   ```

2. Install dependencies
   ```bash
   pnpm install
   ```

3. Generate the Prisma client
   ```bash
   pnpm prisma:generate
   ```

4. Configure environment variables (see below)

5. Run database migrations
   ```bash
   pnpm prisma:migrate
   ```

6. Start the development server
   ```bash
   pnpm dev
   ```

The server will start on the port defined by `PORT` (default: `8080`).

## Environment Variables

Create a `.env` file in the project root with the following variables:

```env
NODE_ENV=development
PORT=8080
FRONTEND_URL=http://localhost:3000

DATABASE_URL=postgresql://<user>:<password>@<host>:<port>/<database>
REDIS_URL=redis://localhost:6379

TMDB_API_KEY=your_tmdb_api_key
ACCESS_TOKEN_SECRET=your_access_token_secret
REFRESH_TOKEN_SECRET=your_refresh_token_secret
LOG_LEVEL=debug
```

### Notes

- `ACCESS_TOKEN_SECRET` and `REFRESH_TOKEN_SECRET` are required for JWT signing.
- `TMDB_API_KEY` is required for all movie-related endpoints.
- `DATABASE_URL` must point to an accessible PostgreSQL database.
- `REDIS_URL` must point to a reachable Redis instance.

## API Endpoints

The API is mounted under `/api/v1`.

### Health Check

- `GET /health`

### Authentication

- `POST /api/v1/auth/register`
  - Body: `{ "name": "User", "email": "user@example.com", "password": "secret123" }`
- `POST /api/v1/auth/login`
  - Body: `{ "email": "user@example.com", "password": "secret123" }`
- `POST /api/v1/auth/logout`
  - Requires `Authorization: Bearer <accessToken>`
- `POST /api/v1/auth/refresh-token`
  - Requires a valid refresh token in the `refreshToken` cookie
- `POST /api/v1/auth/change-password`
  - Requires `Authorization: Bearer <accessToken>`
- `GET /api/v1/auth/profile`
  - Requires `Authorization: Bearer <accessToken>`

### Movies

- `GET /api/v1/movies/popular`
- `GET /api/v1/movies/top-rated`
- `GET /api/v1/movies/upcoming`
- `GET /api/v1/movies/latest`
- `GET /api/v1/movies/now-playing`
- `GET /api/v1/movies/search?q=Inception`
- `GET /api/v1/movies/genres`
- `GET /api/v1/movies/genre/:genreId`
- `GET /api/v1/movies/date-range?startDate=2024-01-01&endDate=2024-12-31`
- `GET /api/v1/movies/:id`

### Query Parameters

- `page` and `limit` are supported on list endpoints
- `q` is used for search requests
- `startDate` and `endDate` are used for release-date filtering

## Usage Examples

### Register a user

```bash
curl -X POST http://localhost:8080/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"secret123"}'
```

### Log in

```bash
curl -X POST http://localhost:8080/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"secret123"}'
```

### Fetch popular movies

```bash
curl http://localhost:8080/api/v1/movies/popular?page=1&limit=5
```

## Notes and Warnings

- The application expects both PostgreSQL and Redis to be running before startup.
- The movie endpoints rely on a valid TMDB API key and will fail if it is missing or invalid.
- Refresh tokens are stored in the database and are cleared on logout.
- In production, set `NODE_ENV=production` and use secure cookie settings.

## License

This project is licensed under the ISC License.

## Author

**Muhammad Muzammil** (Monarch of Code) — Full Stack Developer
