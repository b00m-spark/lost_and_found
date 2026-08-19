# Lost and Found @ UCLA

Lost and Found @ UCLA is a full-stack web app for reporting, browsing, searching, and resolving lost or found items on campus. Students can create accounts, submit item reports with optional images, filter/search active posts, and mark their own posts as resolved after an item is returned.

Live site: [lost-and-found-iota-lilac.vercel.app](https://lost-and-found-iota-lilac.vercel.app/)

## Tech Stack

- Frontend: React, Vite, React Router, CSS
- Backend: Node.js, Express, Express Session
- Database: MySQL
- File uploads: Multer
- Deployment: Vercel frontend, Railway backend, Railway MySQL
- Testing: Vitest, React Testing Library, MSW, Supertest
- CI: GitHub Actions

## Features

- User signup and login with session-based authentication.
- Create lost/found item reports with title, type, description, category, location, contact, and optional image.
- Browse and search reports by keyword, item type, and category.
- View detailed post information and contact details.
- Mark personal posts as resolved.
- Production environment configuration for deployed frontend/backend URLs.

## Deployment

The project is deployed as a split full-stack app:

- Frontend: Vercel
- Backend API: Railway
- Database: Railway MySQL

Important environment variables:

Frontend `.env`:

```env
VITE_BACKEND_BASE=https://your-railway-backend-url
```

Backend `.env`:

```env
PORT=5050
FRONTEND_URL=http://localhost:5178
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASS=your_mysql_password
DB_NAME=lostfound_db
SESSION_SECRET=your_session_secret
```

For production, `FRONTEND_URL` should be the deployed Vercel URL and the database variables should come from Railway.

## Local Setup

### Frontend

```bash
cd lost_and_found/frontend
npm install
npm run dev
```

The frontend runs locally with Vite.

### Backend

Install MySQL if needed, then create a backend `.env` file using the template above.

Create the database schema:

```bash
cd lost_and_found/backend
mysql -u root -p < ./db/schema.sql
```

On PowerShell, if `<` does not work, use:

```powershell
Get-Content ./db/schema.sql | mysql -u root -p
```

Then run the backend:

```bash
npm install
npm run dev
```

## Testing

### Frontend Tests

```bash
cd lost_and_found/frontend
npm test
```

Current frontend coverage includes:

- Search page filtering behavior.
- Profile page rendering and post ownership behavior.
- Login form success and failure behavior.
- Create-post flow using MSW to mock backend API responses.

### Backend Tests

```bash
cd lost_and_found/backend
npm test
```

Current backend coverage includes:

- `GET /api/health`
- signup validation
- duplicate email handling
- successful signup
- successful login
- wrong-password login failure

Backend API tests use Supertest and mocked model functions, so they do not require a real MySQL database.

### Cucumber Tests

There are older Cucumber test files in `frontend/cucumber_tests`. They currently act more like scenario scaffolding than full browser-based end-to-end tests.

## Continuous Integration

GitHub Actions runs the project checks automatically on push and pull request:

- install frontend dependencies
- run frontend tests
- build frontend
- install backend dependencies
- run backend tests

This helps catch broken tests or failed production builds before changes are merged or deployed.

## Usage

1. Create an account or log in.
2. Browse or search existing lost/found reports.
3. Click the plus icon in the sidebar to report a lost or found item.
4. Visit your profile to view your posts.
5. Mark a post as resolved once the item has been returned.

## Diagrams

1. Entity Relationship Diagram

![ER diagram](ERDiagram.png)

2. Component Diagram

![Component diagram](ComponentDiagram.png)
