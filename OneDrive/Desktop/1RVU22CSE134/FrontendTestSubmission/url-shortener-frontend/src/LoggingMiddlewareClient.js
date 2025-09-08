// LoggingMiddlewareClient.js
// Use this module in your React frontend to send logs to the backend logging middleware
import axios from 'axios';

const LOGGING_MIDDLEWARE_URL = 'http://localhost:3001/log'; // Adjust if needed

export async function logFrontendEvent(message, level = 'info', stack = 'frontend', pkg = 'react-ui') {
  try {
    await axios.post(LOGGING_MIDDLEWARE_URL, {
      stack,
      level,
      package: pkg,
      message,
    });
  } catch (err) {
    // Optionally handle logging errors silently
  }
}
