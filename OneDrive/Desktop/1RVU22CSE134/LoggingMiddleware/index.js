const express = require("express");
const axios = require("axios");

const app = express();
app.use(express.json());

// 🔹 Logging Middleware
async function loggingMiddleware(req, res, next) {
  console.log(`[${new Date()}] ${req.method} ${req.url}`);

  try {
    await axios.post(
      "http://20.244.56.144/evaluation-service/logs",
      {
        stack: "backend",
        level: "info",
        package: "handler",
        message: `API ${req.method} ${req.url} called`,
      },
      {
        headers: {
          Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiJtb25pc2hyYWpzci5idGVjaDIyQHJ2dS5lZHUuaW4iLCJleHAiOjE3NTczMTA1MTAsImlhdCI6MTc1NzMwOTYxMCwiaXNzIjoiQWZmb3JkIE1lZGljYWwgVGVjaG5vbG9naWVzIFByaXZhdGUgTGltaXRlZCIsImp0aSI6IjFjOGQyMDI4LWI4YzgtNDliNC04ZWI2LTAzYTU2ODg1NWY5MyIsImxvY2FsZSI6ImVuLUlOIiwibmFtZSI6InMuciBtb25pc2ggcmFqIiwic3ViIjoiNDIwYmFhZjUtZTQ2MS00NWM1LTgzZTYtY2EwMDYyN2RiOWM4In0sImVtYWlsIjoibW9uaXNocmFqc3IuYnRlY2gyMkBydnUuZWR1LmluIiwibmFtZSI6InMuciBtb25pc2ggcmFqIiwicm9sbE5vIjoiMXJ2dTIyY3NlMTM0IiwiYWNjZXNzQ29kZSI6IldQVnFrdyIsImNsaWVudElEIjoiNDIwYmFhZjUtZTQ2MS00NWM1LTgzZTYtY2EwMDYyN2RiOWM4IiwiY2xpZW50U2VjcmV0Ijoia1hKelh2UGd5Y0NjS0h5VSJ9.4NQsfcjWieCoTTYeyHy5mOJFuNHsC57QaTjWICWVXf8`,
        },
      }
    );
  } catch (err) {
    console.error("Log API error:", err.message);
  }

  next();
}

app.use(loggingMiddleware);

// Example Test Route
app.get("/test", (req, res) => {
  res.json({ message: "Logging middleware is working!" });
});

app.listen(3001, () => {
  console.log("Logging Middleware server running on port 3001");
});
