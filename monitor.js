const http = require("http");
const https = require("https");
const EventEmitter = require("events");

/**
 * Network Monitor - Tiện ích giám sát mạng cho Lab 01
 * Theo dõi hiệu suất và thống kê các HTTP requests
 */
class NetworkMonitor extends EventEmitter {
  constructor() {
    super();
    this.stats = {
      totalRequests: 0,
      successfulRequests: 0,
      failedRequests: 0,
      averageResponseTime: 0,
      totalResponseTime: 0,
      requestsByMethod: {},
      requestsByStatus: {},
      requestHistory: [],
      startTime: Date.now(),
    };
    this.maxHistorySize = 100;
    this.isMonitoring = false;
  }

  /**
   * Bắt đầu monitoring
   */
  start() {
    if (this.isMonitoring) {
      console.log("Monitor is already running");
      return;
    }

    this.isMonitoring = true;
    this.startTime = Date.now();

    console.log("🎯 Network Monitor started");
    console.log("📊 Monitoring HTTP requests...\n");

    this.emit("started");
  }

  /**
   * Dừng monitoring
   */
  stop() {
    if (!this.isMonitoring) {
      console.log("Monitor is not running");
      return;
    }

    this.isMonitoring = false;

    console.log("\n🛑 Network Monitor stopped");
    this.printSummary();

    this.emit("stopped");
  }

  /**
   * Theo dõi một HTTP request
   */
  trackRequest(method, url, statusCode, responseTime, success = true) {
    if (!this.isMonitoring) return;

    // Cập nhật statistics
    this.stats.totalRequests++;
    this.stats.totalResponseTime += responseTime;
    this.stats.averageResponseTime = Math.round(
      this.stats.totalResponseTime / this.stats.totalRequests
    );

    if (success) {
      this.stats.successfulRequests++;
    } else {
      this.stats.failedRequests++;
    }

    // Đếm theo method
    this.stats.requestsByMethod[method] =
      (this.stats.requestsByMethod[method] || 0) + 1;

    // Đếm theo status code
    this.stats.requestsByStatus[statusCode] =
      (this.stats.requestsByStatus[statusCode] || 0) + 1;

    // Thêm vào history
    const requestInfo = {
      timestamp: new Date().toISOString(),
      method,
      url,
      statusCode,
      responseTime,
      success,
    };

    this.stats.requestHistory.unshift(requestInfo);

    // Giới hạn kích thước history
    if (this.stats.requestHistory.length > this.maxHistorySize) {
      this.stats.requestHistory.pop();
    }

    // Log request
    const statusIcon = success ? "✅" : "❌";
    const methodColor = this.getMethodColor(method);
    console.log(
      `${statusIcon} ${methodColor}${method}\x1b[0m ${url} - ${statusCode} (${responseTime}ms)`
    );

    this.emit("request", requestInfo);
  }

  /**
   * Lấy màu cho HTTP method
   */
  getMethodColor(method) {
    const colors = {
      GET: "\x1b[32m", // Green
      POST: "\x1b[34m", // Blue
      PUT: "\x1b[33m", // Yellow
      DELETE: "\x1b[31m", // Red
      PATCH: "\x1b[35m", // Magenta
      HEAD: "\x1b[36m", // Cyan
      OPTIONS: "\x1b[37m", // White
    };
    return colors[method] || "\x1b[37m";
  }

  /**
   * In thống kê hiện tại
   */
  printStats() {
    const uptime = Math.round((Date.now() - this.startTime) / 1000);
    const successRate =
      this.stats.totalRequests > 0
        ? Math.round(
            (this.stats.successfulRequests / this.stats.totalRequests) * 100
          )
        : 0;

    console.log("\n📊 Current Statistics:");
    console.log("═".repeat(50));
    console.log(`⏱️  Monitoring Duration: ${uptime} seconds`);
    console.log(`📈 Total Requests: ${this.stats.totalRequests}`);
    console.log(
      `✅ Successful: ${this.stats.successfulRequests} (${successRate}%)`
    );
    console.log(`❌ Failed: ${this.stats.failedRequests}`);
    console.log(
      `⚡ Average Response Time: ${this.stats.averageResponseTime}ms`
    );

    // Requests by method
    if (Object.keys(this.stats.requestsByMethod).length > 0) {
      console.log("\n📊 Requests by Method:");
      Object.entries(this.stats.requestsByMethod).forEach(([method, count]) => {
        const color = this.getMethodColor(method);
        console.log(`   ${color}${method}\x1b[0m: ${count}`);
      });
    }

    // Requests by status code
    if (Object.keys(this.stats.requestsByStatus).length > 0) {
      console.log("\n📊 Requests by Status Code:");
      Object.entries(this.stats.requestsByStatus).forEach(([status, count]) => {
        const statusColor =
          status >= 200 && status < 300 ? "\x1b[32m" : "\x1b[31m";
        console.log(`   ${statusColor}${status}\x1b[0m: ${count}`);
      });
    }

    console.log("═".repeat(50));
  }

  /**
   * In tóm tắt cuối session
   */
  printSummary() {
    const totalTime = Math.round((Date.now() - this.startTime) / 1000);

    console.log("\n📋 Session Summary:");
    console.log("═".repeat(50));
    console.log(`⏱️  Total Duration: ${totalTime} seconds`);
    console.log(`📊 Total Requests Monitored: ${this.stats.totalRequests}`);

    if (this.stats.totalRequests > 0) {
      const requestsPerSecond = (this.stats.totalRequests / totalTime).toFixed(
        2
      );
      console.log(`🔄 Average Requests/Second: ${requestsPerSecond}`);
    }

    console.log("═".repeat(50));
  }

  /**
   * In lịch sử requests gần nhất
   */
  printRecentHistory(limit = 10) {
    console.log(`\n📜 Recent Request History (last ${limit}):`);
    console.log("─".repeat(80));

    const recentRequests = this.stats.requestHistory.slice(0, limit);

    recentRequests.forEach((req, index) => {
      const time = new Date(req.timestamp).toLocaleTimeString();
      const statusIcon = req.success ? "✅" : "❌";
      const methodColor = this.getMethodColor(req.method);

      console.log(
        `${index + 1}. ${time} ${statusIcon} ${methodColor}${
          req.method
        }\x1b[0m ${req.url} - ${req.statusCode} (${req.responseTime}ms)`
      );
    });

    console.log("─".repeat(80));
  }

  /**
   * Export stats to JSON
   */
  exportStats() {
    return {
      ...this.stats,
      uptime: Date.now() - this.startTime,
      exportTime: new Date().toISOString(),
    };
  }

  /**
   * Reset tất cả statistics
   */
  reset() {
    this.stats = {
      totalRequests: 0,
      successfulRequests: 0,
      failedRequests: 0,
      averageResponseTime: 0,
      totalResponseTime: 0,
      requestsByMethod: {},
      requestsByStatus: {},
      requestHistory: [],
      startTime: Date.now(),
    };

    console.log("🔄 Statistics reset");
    this.emit("reset");
  }
}

/**
 * Tạo monitored HTTP client
 */
function createMonitoredClient(monitor) {
  const HTTPClient = require("./client");
  const client = new HTTPClient();

  // Override request method để track statistics
  const originalRequest = client.request.bind(client);

  client.request = async function (options, data = null) {
    const startTime = Date.now();
    const method = options.method || "GET";

    try {
      const response = await originalRequest(options, data);
      const responseTime = Date.now() - startTime;

      monitor.trackRequest(
        method,
        options.url,
        response.statusCode,
        responseTime,
        true
      );

      return response;
    } catch (error) {
      const responseTime = Date.now() - startTime;
      monitor.trackRequest(method, options.url, 0, responseTime, false);
      throw error;
    }
  };

  return client;
}

/**
 * Demo monitoring với các test requests
 */
async function runMonitoringDemo() {
  const monitor = new NetworkMonitor();
  const client = createMonitoredClient(monitor);

  console.log("🚀 Starting Network Monitoring Demo...\n");

  monitor.start();

  // Test cases với delay giữa các requests
  const testCases = [
    { method: "get", url: "http://localhost:3000/api/health" },
    { method: "get", url: "http://localhost:3000/api/server-info" },
    {
      method: "post",
      url: "http://localhost:3000/api/test",
      data: { test: true, timestamp: new Date().toISOString() },
    },
    { method: "get", url: "https://jsonplaceholder.typicode.com/posts/1" },
    { method: "get", url: "http://localhost:3000/api/nonexistent" }, // Này sẽ 404
    { method: "get", url: "http://nonexistent-domain.local/api/test" }, // Này sẽ fail
  ];

  for (let i = 0; i < testCases.length; i++) {
    const test = testCases[i];

    try {
      console.log(
        `\n🔄 Running test ${i + 1}/${
          testCases.length
        }: ${test.method.toUpperCase()} ${test.url}`
      );

      if (test.method === "post") {
        await client.post(test.url, test.data);
      } else {
        await client.get(test.url);
      }
    } catch (error) {
      // Error đã được tracked trong client
    }

    // Delay giữa các requests
    if (i < testCases.length - 1) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }

  // In stats
  setTimeout(() => {
    monitor.printStats();
    monitor.printRecentHistory(5);

    // Export stats
    const stats = monitor.exportStats();
    console.log("\n💾 Exported stats available via monitor.exportStats()");

    monitor.stop();
  }, 2000);
}

// Interactive CLI controls
function setupInteractiveControls(monitor) {
  console.log("\n🎮 Interactive Controls:");
  console.log("  s - Show current statistics");
  console.log("  h - Show recent history");
  console.log("  r - Reset statistics");
  console.log("  q - Quit monitoring");
  console.log("  Enter any command:\n");

  process.stdin.setEncoding("utf8");
  process.stdin.on("data", (input) => {
    const command = input.trim().toLowerCase();

    switch (command) {
      case "s":
        monitor.printStats();
        break;
      case "h":
        monitor.printRecentHistory();
        break;
      case "r":
        monitor.reset();
        break;
      case "q":
        monitor.stop();
        process.exit(0);
        break;
      default:
        console.log("Unknown command. Use s/h/r/q");
    }
  });
}

// Chạy nếu file được execute trực tiếp
if (require.main === module) {
  const args = process.argv.slice(2);

  if (args.includes("--interactive")) {
    const monitor = new NetworkMonitor();
    monitor.start();
    setupInteractiveControls(monitor);
  } else {
    runMonitoringDemo().catch(console.error);
  }
}

module.exports = { NetworkMonitor, createMonitoredClient };
