# Lab 01 - Client-Server Fundamentals

**Môn học:** Phát triển Ứng dụng Web Nâng cao  
**Ngày thực hiện:** 12/08/2025  
**Hình thức:** Thực hành nhóm (3 sinh viên)

## 📋 Mục tiêu

Thực hiện bài lab về kiến thức cơ bản Client-Server với các mục tiêu:

### 1.1 Về kiến thức

- Nắm vững kiến trúc client-server và cách hoạt động
- Hiểu sâu về HTTP protocol: methods, status codes, headers
- Phân biệt static content và dynamic content
- Nắm được vòng đời request-response

### 1.2 Về kỹ năng thực hành

- Xây dựng HTTP server đơn giản phục vụ static files
- Lập trình HTTP client từ đầu
- Sử dụng browser developer tools phân tích network traffic
- Debugging và khắc phục vấn đề kết nối

## 🛠️ Thiết lập kỹ thuật

### Yêu cầu hệ thống

- **Node.js:** Phiên bản 16.0+
- **Trình duyệt:** Chrome hoặc Firefox (có Developer Tools)
- **Editor:** Visual Studio Code (khuyến nghị)
- **Git:** Để quản lý mã nguồn

### Thư viện sử dụng

- `express`: Web framework cho Node.js
- `path`: Built-in module xử lý đường dẫn file
- Chỉ sử dụng built-in modules cho HTTP client (không dùng axios, fetch libraries)

## 🚀 Hướng dẫn cài đặt

### 1. Clone repository

```bash
git clone <repository-url>
cd lab01-client-server
```

### 2. Cài đặt dependencies

```bash
npm install
```

### 3. Khởi động server

```bash
npm start
```

Server sẽ chạy tại: `http://localhost:3000`

### 4. Chạy HTTP Client tests

```bash
npm run client
```

### 5. Chạy Network Monitor

```bash
npm run monitor
```

Hoặc chạy interactive mode:

```bash
node monitor.js --interactive
```

## 📁 Cấu trúc dự án

```
lab01-client-server/
├── README.md                 # Tài liệu hướng dẫn
├── package.json             # Cấu hình npm và dependencies
├── server.js                # HTTP Server chính (Express.js)
├── client.js                # HTTP Client tùy chỉnh
├── monitor.js               # Tiện ích giám sát mạng
├── public/                  # Static files
│   ├── index.html          # Trang web chính
│   ├── style.css           # CSS styling responsive
│   └── script.js           # JavaScript phía client
├── screenshots/            # Screenshots demo
├── docs/                   # Tài liệu kỹ thuật
└── presentation/          # Slide thuyết trình
```

## ⚡ Tính năng chính

### Phần A: Static Web Server (35 điểm)

**🌟 Tính năng:**

- HTTP server chạy trên port 3000
- Phục vụ static files (HTML, CSS, JavaScript)
- API endpoints:
  - `GET /api/server-info` - Thông tin server và hệ thống
  - `POST /api/test` - Test endpoint cho POST requests
  - `GET /api/health` - Health check
- Custom HTTP headers trong response
- Xử lý lỗi 404, 500
- Real-time server timestamp và thông tin hệ thống

**🎨 Giao diện Web:**

- Responsive design với CSS modern
- AJAX calls để lấy dữ liệu server
- Network monitoring dashboard
- Real-time statistics
- Interactive API testing

### Phần B: HTTP Client (35 điểm)

**🔧 Tính năng:**

- HTTP client từ đầu sử dụng built-in modules
- Hỗ trợ GET, POST, PUT, DELETE methods
- Xử lý cả HTTP và HTTPS requests
- Error handling chi tiết
- Request/response logging
- Performance tracking

**🧪 Test cases:**

- GET request tới server cục bộ
- GET request tới external API (GitHub API)
- POST request tới JSONPlaceholder
- Xử lý lỗi server không khả dụng
- Timeout handling

### Phần C: Network Monitoring (20 điểm)

**📊 Tính năng:**

- Real-time monitoring HTTP requests
- Performance statistics:
  - Total requests, success/failure rates
  - Average response time
  - Requests by method và status code
- Request history tracking
- Interactive CLI controls
- Export statistics

## 🎯 Demo và sử dụng

### 1. Demo Web Interface

1. Mở trình duyệt tại `http://localhost:3000`
2. Bấm "Refresh Data" để lấy thông tin server
3. Sử dụng API Testing section để test các endpoints
4. Mở Developer Tools (F12) > Network tab để xem HTTP requests

### 2. Demo HTTP Client

```bash
node client.js
```

Sẽ chạy các test cases tự động và hiển thị kết quả

### 3. Demo Network Monitor

```bash
node monitor.js --interactive
```

Commands:

- `s` - Show statistics
- `h` - Show history
- `r` - Reset stats
- `q` - Quit

## 🔍 Network Traffic Analysis

### Browser Developer Tools

1. Mở F12 > Network tab
2. Refresh trang để capture requests
3. Phân tích:
   - Static files (HTML, CSS, JS)
   - API calls (XHR/Fetch)
   - Response headers và timing
   - Request/response sizes

### Monitor Script

- Theo dõi real-time performance
- Statistics chi tiết về response times
- Request history và patterns

## 📸 Screenshots

Thư mục `screenshots/` chứa:

- `server-running.png` - Server khởi động
- `web-interface.png` - Giao diện web
- `network-analysis.png` - Network tab analysis
- `api-response.png` - API response examples
- `client-output.png` - HTTP client output
- `monitor-stats.png` - Network monitor statistics

## 🚨 Xử lý lỗi thường gặp

### Server không khởi động được

```bash
# Kiểm tra port 3000 có đang được sử dụng
netstat -an | find \"3000\"

# Kill process nếu cần
taskkill /f /pid <process_id>
```

### Client connection errors

- Đảm bảo server đang chạy trên port 3000
- Kiểm tra firewall settings
- Test với `curl` hoặc Postman

### Module not found errors

```bash
npm install
```

## 📊 Hiệu suất và Benchmarks

### Response Times (Local)

- Static files: < 5ms
- API endpoints: 10-50ms
- External requests: 100-2000ms

### Memory Usage

- Server: ~25-50MB
- Monitoring: ~5-10MB additional

## 🔒 Security Considerations

- Server chỉ chạy local development
- Không có authentication (lab purpose)
- CORS enabled cho local testing
- Input validation cho API endpoints

## 📚 Tài liệu tham khảo

- [Node.js HTTP Module](https://nodejs.org/api/http.html)
- [Express.js Documentation](https://expressjs.com/)
- [MDN HTTP Overview](https://developer.mozilla.org/en-US/docs/Web/HTTP)
- [Browser Developer Tools](https://developers.google.com/web/tools/chrome-devtools/network)

## 👥 Thông tin nhóm

**Nhóm:**: 20  
**Thành viên:**

- [2212353] - [Nguyễn Tiến Đạt]
- [2212390] - [Danh Nguyễn Tuấn Khanh]
- [2212453] - [Ngô Bá Tài]

## 📝 Báo cáo kỹ thuật

Chi tiết trong file `docs/technical-report.md`:

- Kiến trúc hệ thống
- Phân tích implementation
- Performance benchmarks
- Challenges và solutions
- Lessons learned

## 🎤 Thuyết trình

**Thời gian:** 15 phút (8 phút demo + 2 phút giới thiệu + 3 phút kết luận + 10 phút Q&A)

**Nội dung chính:**

1. Giới thiệu nhóm và phân công
2. Demo trực tiếp các tính năng
3. Network analysis với developer tools
4. Code walkthrough
5. Performance insights
6. Challenges và solutions

## 📄 License

MIT License - Chỉ sử dụng cho mục đích học tập.

---

**🚀 Happy Coding!**  
_Hướng dẫn chi tiết và support qua Discord/Slack group_
