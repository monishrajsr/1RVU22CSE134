# React URL Shortener 

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
  <img width="1912" height="1028" alt="output0" src="https://github.com/user-attachments/assets/bd2a7c86-1d29-41f2-be7b-1472379d05c4" />
  <img width="1901" height="941" alt="output 0 1" src="https://github.com/user-attachments/assets/36a6d4a2-0382-4462-81a1-8881ff88b675" />
  <img width="1910" height="1027" alt="output0 2" src="https://github.com/user-attachments/assets/9a53232f-670c-4352-bfaf-2a6c9692196c" />




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
   It will run 3000 by default, type y to use 3001
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
- Run
  ```sh
   node server.js
   ```

  ## Use Postman to verify

## License
MIT
