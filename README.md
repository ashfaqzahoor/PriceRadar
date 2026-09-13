# PriceRadar

> Live grocery price comparison across Indian quick-commerce platforms (Blinkit, Swiggy Instamart, and Zepto/BigBasket).

PriceRadar helps shoppers instantly see who has the lowest price for daily grocery items and calculates whole-basket checkout totals (including delivery fees and out-of-stock items) so you don't overpay.

---

## Key Features

- **Side-by-Side 3-Store Comparison**: View real-time prices for Blinkit, Instamart, and BigBasket side-by-side with an honest "Lowest" badge and 1-click deep links.
- **Multi-Store Basket**: Add multiple items to compare whole-order landed totals (subtotal + delivery fee) and discover net savings.
- **Out-of-Stock Handling**: Choose whether to keep or skip substitute items per store.
- **Location Aware**: Switch delivery hubs by Indian PIN code or browser GPS to reflect local store stock and delivery ETAs.
- **Price History & Trends**: Interactive price-trend chart tracking price movements over 7, 14, and 30 days.
- **Watchlist**: Save essential items to keep an eye on price drops.

---

## Tech Stack

- **Frontend**: React 19, Vite, Tailwind CSS, Redux Toolkit, Lucide Icons.
- **Backend**: Node.js (ESM), Express, MongoDB (Mongoose), Redis (caching), JWT authentication.

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher)
- [MongoDB](https://www.mongodb.com/) (running locally or MongoDB Atlas URI)
- (Optional) [Redis](https://redis.io/) for API response caching

---

### Installation

Clone the repository and install dependencies for both frontend and backend:

```bash
# Install root, backend, and frontend dependencies
npm run install:all
```

---

### Environment Setup

Create a `.env` file in the `backend/` directory (you can copy from `backend/.env.example` if available):

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/priceradar
JWT_SECRET=your_jwt_secret_key
CORS_ORIGIN=http://localhost:5173
REDIS_URL=redis://localhost:6379
```

---

## Basic Commands

### Run Everything Together (Frontend + Backend)

```bash
npm run dev
```

- **Frontend** runs at: `http://localhost:5173`
- **Backend API** runs at: `http://localhost:5000`

---

### Run Individually

**Backend Only:**
```bash
npm --prefix backend run dev
```

**Frontend Only:**
```bash
npm --prefix frontend run dev
```

---

### Build for Production

```bash
# Build frontend production bundle
npm run build

# Start backend in production mode
npm run start
```
