const express = require("express");
const path = require("path");
const os = require("os");
const fs = require("fs");

const app = express();
const PORT = 3000;

// Middleware để parse JSON
app.use(express.json());

// Phục vụ static files từ thư mục public
app.use(express.static(path.join(__dirname, "public")));

// Custom headers cho tất cả responses
app.use((req, res, next) => {
  res.setHeader("X-Lab-Server", "Lab01-Client-Server");
  res.setHeader("X-Timestamp", new Date().toISOString());
  res.setHeader("X-Request-ID", Math.random().toString(36).substr(2, 9));
  next();
});

// API endpoint - Thông tin server
app.get("/api/server-info", (req, res) => {
  try {
    const serverInfo = {
      timestamp: new Date().toISOString(),
      server: {
        platform: os.platform(),
        architecture: os.arch(),
        nodeVersion: process.version,
        hostname: os.hostname(),
        uptime: process.uptime(),
        memory: {
          total: Math.round(os.totalmem() / 1024 / 1024) + " MB",
          free: Math.round(os.freemem() / 1024 / 1024) + " MB",
          usage: Math.round(process.memoryUsage().rss / 1024 / 1024) + " MB",
        },
        cpus: os.cpus().length,
        loadAverage: os.loadavg(),
      },
      request: {
        method: req.method,
        url: req.url,
        headers: req.headers,
        userAgent: req.get("User-Agent"),
        ip: req.ip || req.connection.remoteAddress,
      },
    };

    res.json(serverInfo);
  } catch (error) {
    console.error("Error getting server info:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// API endpoint - Test POST
app.post("/api/test", (req, res) => {
  try {
    const response = {
      message: "POST request received successfully",
      timestamp: new Date().toISOString(),
      receivedData: req.body,
      echo: req.body,
    };
    res.json(response);
  } catch (error) {
    console.error("Error handling POST request:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// API endpoint - Health check
app.get("/api/health", (req, res) => {
  res.json({
    status: "healthy",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// Route chính
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Xử lý 404
app.use((req, res) => {
  res.status(404).json({
    error: "Not Found",
    message: `The requested resource ${req.url} was not found on this server.`,
    timestamp: new Date().toISOString(),
    statusCode: 404,
  });
});

// Xử lý lỗi server
app.use((error, req, res, next) => {
  console.error("Server error:", error);
  res.status(500).json({
    error: "Internal Server Error",
    message: "Something went wrong on the server.",
    timestamp: new Date().toISOString(),
    statusCode: 500,
  });
});

// Khởi động server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
  console.log(`📊 API endpoints available:`);
  console.log(`   GET  /api/server-info - Server information`);
  console.log(`   POST /api/test       - Test POST endpoint`);
  console.log(`   GET  /api/health     - Health check`);
  console.log(`📁 Static files served from ./public/`);
  console.log(`⏰ Server started at: ${new Date().toISOString()}`);
});

// Graceful shutdown
process.on("SIGTERM", () => {
  console.log("🛑 SIGTERM received, shutting down gracefully");
  process.exit(0);
});

process.on("SIGINT", () => {
  console.log("🛑 SIGINT received, shutting down gracefully");
  process.exit(0);
});
