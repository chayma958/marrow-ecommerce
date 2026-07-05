# Marrow — Full-Stack E-Commerce Platform

A production-style e-commerce web app built as a portfolio project: a curated goods
storefront with product browsing, filtering & search, wishlist, coupons, Stripe checkout,
order tracking, an admin dashboard with analytics, and English/French localization.

**Stack:** React 19 + TypeScript + Tailwind CSS (Vite) · Node.js + Express + TypeScript ·
MongoDB + Mongoose · JWT auth + Google OAuth · Stripe (test mode) · i18next

---

## Features

**Storefront**
- Product catalog with search, category filters, price range, and sorting
- Product detail pages with image gallery, stock status, and customer reviews/ratings
  (create, edit, delete your own review)
- Related-product recommendations
- Wishlist, separate from the cart, with move-to-cart
- Persistent cart, scoped per signed-in user (or guest), with quantity controls
- Coupon codes with minimum-order rules, re-validated automatically if the cart total
  drops below the threshold
- Multi-step checkout: shipping → payment method → review → pay
- Country dropdown + searchable phone country-code/flag picker for shipping details
- Stripe Elements integration for card payments (test mode) + a cash-on-delivery option
- Order history and order detail/tracking pages
- English / French language switcher (English by default)
- Contact form, About, FAQ, Shipping & Delivery, Returns & Refund, Privacy, and Terms pages
- Fully responsive, accessible UI with a distinct visual identity

**Auth**
- JWT-based registration/login (httpOnly cookie + bearer token fallback)
- Sign in with Google
- Forgot / reset password via email
- Protected routes for checkout, profile, wishlist, and admin areas

**Admin dashboard**
- Revenue and orders analytics (monthly charts)
- Product CRUD (create, edit, delete)
- Coupon management (create, edit, delete)
- Order list with payment/delivery status, mark-as-delivered action
- User management (view, delete)

**Backend engineering**
- REST API with pagination, text search, and filtering at the database level
- Server-side price/stock validation on order creation (never trusts client totals)
- Contact form submissions and password resets sent by email (Nodemailer)
- Centralized error handling, request logging, security headers (Helmet), CORS
- Seed script with realistic sample data (products, admin + customer accounts)

---

## Project structure

```
morrow-ecommerce/
├── backend/                Express + TypeScript API
│   └── src/
│       ├── config/         MongoDB connection
│       ├── controllers/    Route handlers (auth, products, orders, payments,
│       │                   coupons, uploads, wishlist, analytics, contact)
│       ├── middleware/     JWT auth guard, admin guard, error handler
│       ├── models/         Mongoose schemas (User, Product, Order, Coupon)
│       ├── routes/         Express routers
│       ├── utils/          JWT helper, email sender
│       └── seed.ts         Database seeder
└── frontend/               React + TypeScript + Tailwind (Vite)
    └── src/
        ├── api/            Axios calls per resource
        ├── components/     Reusable UI (Navbar, Footer, ProductCard, PhoneInput,
        │                   LanguageSwitcher, StripeCheckoutForm, etc.)
        ├── context/        Auth, Cart & Wishlist providers
        ├── i18n/           i18next setup + en/fr translation files
        ├── pages/          Route-level pages
        │   ├── admin/      Admin dashboard, product/order/coupon/user management
        │   └── info/       About, Contact, FAQ, Shipping, Returns, Privacy, Terms
        ├── types/          Shared TypeScript interfaces
        └── utils/          Countries list, pricing helpers

Path alias: `@/*` resolves to `frontend/src/*` (see vite.config.ts / tsconfig.app.json).
```

---

## Getting started

### Prerequisites
- Node.js 18+
- A MongoDB instance (local, or a free [MongoDB Atlas](https://www.mongodb.com/atlas) cluster)
- A free [Stripe](https://dashboard.stripe.com/register) account for **test-mode** API keys

### 1. Backend setup

```bash
cd backend
npm install
cp .env.example .env
```

Edit `.env` — see `.env.example` for the full list (MongoDB, JWT, Stripe, Google OAuth,
Cloudinary, Gmail SMTP). At minimum for local development:
```
MONGO_URI=mongodb://127.0.0.1:27017/ecommerce   # or your Atlas connection string
JWT_SECRET=some_long_random_string
STRIPE_SECRET_KEY=sk_test_...                     # from Stripe dashboard, test mode
CLIENT_URL=http://localhost:5173
```
Google OAuth, Cloudinary image uploads, and outgoing email (password resets, contact
form) are optional — the app runs without them, just with those specific features disabled
or logging a warning instead of sending mail.

Seed the database with sample products and demo users:
```bash
npm run seed
```
This creates:
- **Admin** — `admin@example.com` / `admin123`
- **Customer** — `jane@example.com` / `jane1234`
- Sample products across Electronics, Home, Apparel, Footwear & Accessories

Start the API:
```bash
npm run dev
```
The API runs at `http://localhost:5000`.

### 2. Frontend setup

```bash
cd frontend
npm install
cp .env.example .env
```

Edit `.env`:
```
VITE_API_URL=http://localhost:5000/api
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...           # from Stripe dashboard, test mode
VITE_GOOGLE_CLIENT_ID=...                          # optional, enables "Sign in with Google"
```

Start the dev server:
```bash
npm run dev
```
The app runs at `http://localhost:5173`.

### 3. Test a purchase

Use Stripe's test card during checkout:
- Card number: `4242 4242 4242 4242`
- Expiry: any future date · CVC: any 3 digits · ZIP: any

---

## Available scripts

**Backend** (`backend/`)
| Command | Description |
|---|---|
| `npm run dev` | Start API with hot reload (nodemon) |
| `npm run build` | Compile TypeScript to `dist/` |
| `npm start` | Run the compiled build |
| `npm run seed` | Import sample data (wipes existing data first) |
| `npm run seed:destroy` | Remove all seeded data |

**Frontend** (`frontend/`)
| Command | Description |
|---|---|
| `npm run dev` | Start Vite dev server |
| `npm run build` | Type-check and build for production |
| `npm run preview` | Preview the production build locally |

---

## Running with Docker

Requires [Docker](https://www.docker.com/) and Docker Compose. This spins up MongoDB, the
API, and the frontend (built and served via Nginx) as three containers.

```bash
cp .env.example .env
```

Edit `.env` with real values (Stripe test keys, JWT secret, etc. — see comments in the
file). Then build and start everything:

```bash
docker compose up --build
```

- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:5000/api` (health check at `/api/health`)
- MongoDB: `localhost:27017` (data persisted in the `mongo-data` volume)

Seed the database (run once, against the running `backend` container):
```bash
docker compose exec backend npm run seed
```

Notes:
- The frontend's `VITE_*` variables are baked into the static build at image-build time —
  changing them in `.env` requires `docker compose up --build frontend` to take effect.
- Uploaded images (when not using Cloudinary) persist in the `backend-uploads` volume.
- To stop and remove containers: `docker compose down` (add `-v` to also drop the Mongo
  data volume).

---

## Production hardening

The backend includes baseline production safeguards:
- `helmet` security headers, gzip `compression`, and `trust proxy` (correct client IPs
  behind a reverse proxy / load balancer)
- Rate limiting: a general limiter on all `/api` routes and a stricter one on
  auth endpoints (login, register, Google auth, forgot/reset password) to slow brute-force
  attempts
- Startup env validation — in `NODE_ENV=production`, the process refuses to start if
  `MONGO_URI`, `JWT_SECRET`, `STRIPE_SECRET_KEY`, or `CLIENT_URL` are missing, or if
  `JWT_SECRET` is still the placeholder value
- Graceful shutdown on `SIGTERM`/`SIGINT` — stops accepting new connections, closes the
  MongoDB connection, then exits (with a 10s force-exit fallback)

There is no automated test suite yet — CI covers lint/typecheck/build only, not behavior.

---

## CI/CD (GitHub Actions)

[.github/workflows/ci.yml](.github/workflows/ci.yml) runs on every push/PR to `main`:

1. **backend** — install, `typecheck`, `build` (TypeScript → `dist/`)
2. **frontend** — install, `lint` (oxlint), `typecheck`, `build` (Vite)
3. **validate-compose** — sanity-checks `docker-compose.yml` with `docker compose config`
4. **docker-backend** / **docker-frontend** — *push to `main` only*: build the production
   Docker images and publish them to GitHub Container Registry as
   `ghcr.io/<owner>/<repo>-backend` and `ghcr.io/<owner>/<repo>-frontend`, tagged `latest`
   and the commit SHA. No external secrets required — auth uses the built-in
   `GITHUB_TOKEN`.

To bake real values into the published frontend image (rather than the empty-string
defaults used for the CI build check), add these as **repository variables** (Settings →
Secrets and variables → Actions → Variables): `VITE_API_URL`,
`VITE_STRIPE_PUBLISHABLE_KEY`, `VITE_GOOGLE_CLIENT_ID`.

Pulling and running the published images elsewhere:
```bash
docker pull ghcr.io/<owner>/<repo>-backend:latest
docker pull ghcr.io/<owner>/<repo>-frontend:latest
```
(Make the packages public under the repo's **Packages** tab, or `docker login ghcr.io`
first if they're private.)

Dependabot ([.github/dependabot.yml](.github/dependabot.yml)) opens weekly PRs for npm
dependencies (backend/frontend), Docker base images, and GitHub Actions versions.

---

## Deployment guide (MongoDB Atlas + Render + Cloudflare Pages)

This wires up **automatic deployment on every push to `main`**: Render and Cloudflare
Pages each connect directly to the GitHub repo and rebuild/redeploy on their own when
they see a new commit — no extra CI step needed.

### 1. Database — MongoDB Atlas

1. Create a free account at [mongodb.com/atlas](https://www.mongodb.com/atlas) and a free
   **M0** cluster.
2. **Database Access** → add a database user (username/password, read/write role).
3. **Network Access** → add `0.0.0.0/0` (allow from anywhere). Render's free tier has no
   static outbound IP, so this is required — the connection is still protected by the
   database user's password.
4. **Database** → **Connect** → **Drivers** → copy the connection string, e.g.
   `mongodb+srv://<user>:<password>@cluster0.xxxxx.mongodb.net/ecommerce?retryWrites=true&w=majority`.
   This is your `MONGO_URI`.

### 2. Backend — Render

This repo includes [render.yaml](render.yaml), a Render Blueprint that deploys
`backend/Dockerfile` as a web service with `autoDeploy: true`.

1. Push these changes to `main` on GitHub (Render reads `render.yaml` from the repo).
2. On [render.com](https://render.com) → **New** → **Blueprint** → connect the
   `marrow-ecommerce` repo → Render detects `render.yaml` and provisions the
   `marrow-backend` web service.
3. Render will prompt for the env vars marked `sync: false` in the blueprint — fill in:
   `MONGO_URI` (from step 1), `STRIPE_SECRET_KEY`, `CLIENT_URL` (the Cloudflare Pages URL
   from step 3 — you can update this after step 3 completes), and optionally
   `GOOGLE_CLIENT_ID`, `CLOUDINARY_*`, `EMAIL_*`, `CONTACT_EMAIL`. `JWT_SECRET` is
   auto-generated by Render.
4. Deploy. Once live, note the service URL, e.g. `https://marrow-backend.onrender.com`.
   Health check: `https://marrow-backend.onrender.com/api/health`.
5. Seed the database once (Render dashboard → your service → **Shell**):
   ```bash
   npm run seed
   ```

Note: Render's free plan spins the service down after ~15 min of inactivity; the first
request after idle takes ~30-60s to wake up.

### 3. Frontend — Cloudflare Pages

1. On the [Cloudflare dashboard](https://dash.cloudflare.com) → **Workers & Pages** →
   **Create** → **Pages** → **Connect to Git** → select the `marrow-ecommerce` repo.
2. Build settings:
   - **Root directory**: `frontend`
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`
3. **Environment variables** (Settings → Environment variables, for the *Production*
   environment — these are build-time, baked into the static bundle):
   - `VITE_API_URL` = `https://marrow-backend.onrender.com/api` (your Render URL + `/api`)
   - `VITE_STRIPE_PUBLISHABLE_KEY` = your Stripe publishable key
   - `VITE_GOOGLE_CLIENT_ID` = your Google OAuth client ID (optional)
4. Deploy. Cloudflare gives you a URL like `https://marrow-ecommerce.pages.dev`.
5. [frontend/public/_redirects](frontend/public/_redirects) makes client-side routing
   (React Router) work on Cloudflare Pages by falling back to `index.html` for unmatched
   paths — already included, no action needed.

### 4. Connect the two

Go back to Render → `marrow-backend` → **Environment** → set `CLIENT_URL` to your
Cloudflare Pages URL (`https://marrow-ecommerce.pages.dev`), so CORS allows requests from
the deployed frontend. Save — Render redeploys automatically.

### From here on

Every push to `main` now:
- Runs the existing [CI workflow](.github/workflows/ci.yml) (lint/typecheck/build,
  publishes Docker images to GHCR)
- Triggers Render to rebuild and redeploy `marrow-backend` (via `render.yaml`
  `autoDeploy: true`)
- Triggers Cloudflare Pages to rebuild and redeploy the frontend

These three are independent — a failure in one doesn't block the others. If you want CI
to gate the Render/Cloudflare deploys (e.g. only deploy if lint/build pass), disable
auto-deploy on each platform and instead trigger their deploy hooks from a step in
`ci.yml` after the `backend`/`frontend` jobs succeed.

Remember to switch Stripe keys from test (`sk_test_`/`pk_test_`) to live keys only once
you're ready to accept real payments — this project is wired for test mode throughout.

