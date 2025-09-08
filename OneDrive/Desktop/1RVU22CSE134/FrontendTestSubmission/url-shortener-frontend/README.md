# React URL Shortener Frontend

A responsive React web application for shortening URLs and viewing analytics, integrated with a backend microservice and custom logging middleware.

## Features
- Shorten up to 5 URLs at once
- Set validity period and preferred shortcode for each URL
- Client-side validation for URL format and validity
- View shortened URLs, expiry, and creation time
- Statistics page showing:
  - Shortened URL and its creation/expiry
  - Total clicks
  - Click details: timestamp, source, IP, and location (if available)
- Beautiful Material UI design
- All logging routed through custom Logging Middleware (no console.log)

## Getting Started

### Prerequisites
- Node.js and npm installed
- Backend server running (see BackendTestSubmission)
- Logging Middleware running (see LoggingMiddleware)

### Installation
1. Install dependencies:
   ```sh
   npm install
   ```
2. Start the frontend:
   ```sh
   npm start
   ```
   The app runs on [http://localhost:3001](http://localhost:3001) by default.

## Usage
1. Open the app in your browser.
2. Use the URL Shortener page to create short links.
3. View analytics in the Statistics page.

## Project Structure
- `src/UrlShortenerPage.js`: Main form for shortening URLs
- `src/StatisticsPage.js`: Displays statistics for shortened URLs
- `src/LoggingMiddlewareClient.js`: Handles frontend logging

## Notes
- Backend must be running on `http://localhost:3000`
- Logging Middleware must be running on `http://localhost:3001`
- All shortened URLs and stats are stored in-memory (session-based)

## License
MIT
