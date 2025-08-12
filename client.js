const http = require("http");
const https = require("https");
const url = require("url");
const querystring = require("querystring");

/**
 * HTTP Client class sử dụng built-in modules của Node.js
 */
class HTTPClient {
  constructor() {
    this.defaultTimeout = 5000;
    this.defaultHeaders = {
      "User-Agent": "Lab01-HTTPClient/1.0",
      Accept: "application/json",
      "Content-Type": "application/json",
    };
  }

  /**
   * Phương thức chung để thực hiện HTTP requests
   */
  request(options, data = null) {
    return new Promise((resolve, reject) => {
      const parsedUrl = url.parse(options.url);
      const isHTTPS = parsedUrl.protocol === "https:";
      const client = isHTTPS ? https : http;

      const requestOptions = {
        hostname: parsedUrl.hostname,
        port: parsedUrl.port || (isHTTPS ? 443 : 80),
        path: parsedUrl.path,
        method: options.method || "GET",
        headers: { ...this.defaultHeaders, ...options.headers },
        timeout: options.timeout || this.defaultTimeout,
      };

      // Nếu có data, thêm Content-Length header
      if (data && (options.method === "POST" || options.method === "PUT")) {
        const postData = typeof data === "object" ? JSON.stringify(data) : data;
        requestOptions.headers["Content-Length"] = Buffer.byteLength(postData);
      }

      console.log(`🔗 ${options.method || "GET"} ${options.url}`);
      console.log(`📋 Headers:`, requestOptions.headers);

      const startTime = Date.now();
      const req = client.request(requestOptions, (res) => {
        const chunks = [];
        const responseTime = Date.now() - startTime;

        console.log(
          `📡 Response Status: ${res.statusCode} ${res.statusMessage}`
        );
        console.log(`⏱️  Response Time: ${responseTime}ms`);
        console.log(`📋 Response Headers:`, res.headers);

        res.on("data", (chunk) => {
          chunks.push(chunk);
        });

        res.on("end", () => {
          const body = Buffer.concat(chunks).toString();

          let parsedBody;
          try {
            parsedBody = JSON.parse(body);
          } catch (e) {
            parsedBody = body;
          }

          const response = {
            statusCode: res.statusCode,
            statusMessage: res.statusMessage,
            headers: res.headers,
            body: parsedBody,
            responseTime: responseTime,
            url: options.url,
          };

          if (res.statusCode >= 200 && res.statusCode < 300) {
            console.log(`✅ Request successful\n`);
            resolve(response);
          } else {
            console.log(`❌ Request failed with status ${res.statusCode}\n`);
            reject(new Error(`HTTP ${res.statusCode}: ${res.statusMessage}`));
          }
        });
      });

      req.on("timeout", () => {
        console.log(`⏰ Request timeout for ${options.url}`);
        req.abort();
        reject(new Error("Request timeout"));
      });

      req.on("error", (error) => {
        console.log(`❌ Request error: ${error.message}\n`);
        reject(error);
      });

      // Gửi data nếu có
      if (data && (options.method === "POST" || options.method === "PUT")) {
        const postData = typeof data === "object" ? JSON.stringify(data) : data;
        req.write(postData);
      }

      req.end();
    });
  }

  /**
   * GET request
   */
  get(url, headers = {}) {
    return this.request({ url, method: "GET", headers });
  }

  /**
   * POST request
   */
  post(url, data, headers = {}) {
    return this.request({ url, method: "POST", headers }, data);
  }

  /**
   * PUT request
   */
  put(url, data, headers = {}) {
    return this.request({ url, method: "PUT", headers }, data);
  }

  /**
   * DELETE request
   */
  delete(url, headers = {}) {
    return this.request({ url, method: "DELETE", headers });
  }
}

/**
 * Các test cases
 */
async function runTests() {
  const client = new HTTPClient();

  console.log("🧪 Starting HTTP Client Tests...\n");
  console.log("=".repeat(50));

  // Test 1: GET request tới server cục bộ
  try {
    console.log("📝 Test 1: GET request to local server");
    const response1 = await client.get("http://localhost:3000/api/server-info");
    console.log("✅ Local server response received");
    console.log(
      "📊 Server uptime:",
      response1.body.server?.uptime,
      "seconds\n"
    );
  } catch (error) {
    console.log(`❌ Test 1 failed: ${error.message}`);
    console.log("💡 Make sure the server is running on port 3000\n");
  }

  // Test 2: GET request tới external API
  try {
    console.log("📝 Test 2: GET request to external API (GitHub)");
    const response2 = await client.get("https://api.github.com/users/octocat");
    console.log("✅ External API response received");
    console.log(
      "👤 GitHub user:",
      response2.body.login,
      "-",
      response2.body.name,
      "\n"
    );
  } catch (error) {
    console.log(`❌ Test 2 failed: ${error.message}\n`);
  }

  // Test 3: POST request tới JSONPlaceholder
  try {
    console.log("📝 Test 3: POST request to JSONPlaceholder");
    const postData = {
      title: "Lab 01 Test Post",
      body: "This is a test post from our HTTP client",
      userId: 1,
    };
    const response3 = await client.post(
      "https://jsonplaceholder.typicode.com/posts",
      postData
    );
    console.log("✅ POST request successful");
    console.log("📝 Created post ID:", response3.body.id, "\n");
  } catch (error) {
    console.log(`❌ Test 3 failed: ${error.message}\n`);
  }

  // Test 4: POST tới local server
  try {
    console.log("📝 Test 4: POST request to local server");
    const localPostData = {
      message: "Hello from HTTP Client",
      timestamp: new Date().toISOString(),
      testData: { value: 123, active: true },
    };
    const response4 = await client.post(
      "http://localhost:3000/api/test",
      localPostData
    );
    console.log("✅ Local POST request successful");
    console.log("📨 Echo data received:", response4.body.echo?.message, "\n");
  } catch (error) {
    console.log(`❌ Test 4 failed: ${error.message}\n`);
  }

  // Test 5: Xử lý lỗi - server không khả dụng
  try {
    console.log("📝 Test 5: Error handling - unavailable server");
    await client.get("http://localhost:9999/api/test");
  } catch (error) {
    console.log("✅ Error handling working correctly");
    console.log("🔍 Error type:", error.code || error.message, "\n");
  }

  // Test 6: Timeout test
  try {
    console.log("📝 Test 6: Timeout test");
    const timeoutClient = new HTTPClient();
    timeoutClient.defaultTimeout = 1; // 1ms timeout
    await timeoutClient.get("https://httpbin.org/delay/2");
  } catch (error) {
    if (error.message === "Request timeout") {
      console.log("✅ Timeout handling working correctly\n");
    } else {
      console.log("⚠️  Timeout test inconclusive:", error.message, "\n");
    }
  }

  console.log("=".repeat(50));
  console.log("🏁 HTTP Client Tests Complete!");
}

// Chạy tests nếu file được execute trực tiếp
if (require.main === module) {
  runTests().catch(console.error);
}

module.exports = HTTPClient;
