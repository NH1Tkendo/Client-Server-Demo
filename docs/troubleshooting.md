# Troubleshooting Guide - Lab 01

## 🚨 Common Issues and Solutions

### Server Issues

#### Issue: Server won't start

**Error:** `Error: listen EADDRINUSE :::3000`

**Solution:**

```bash
# Check what's using port 3000
netstat -ano | findstr :3000

# Kill the process (Windows)
taskkill /pid <PID> /f

# Or use different port
set PORT=3001 && npm start
```

#### Issue: Module not found

**Error:** `Cannot find module 'express'`

**Solution:**

```bash
# Install dependencies
npm install

# Clear cache if needed
npm cache clean --force
npm install
```

#### Issue: Server crashes on requests

**Error:** Various runtime errors

**Solution:**

1. Check server logs in terminal
2. Ensure all dependencies are installed
3. Verify file permissions
4. Check Node.js version: `node --version`

### Client Issues

#### Issue: Connection refused

**Error:** `ECONNREFUSED localhost:3000`

**Solution:**

1. Ensure server is running: `npm start`
2. Check server port in terminal output
3. Verify firewall settings
4. Test with browser: http://localhost:3000

#### Issue: Timeout errors

**Error:** `Request timeout`

**Solution:**

1. Increase timeout in client.js:
   ```javascript
   this.defaultTimeout = 10000; // 10 seconds
   ```
2. Check network connectivity
3. Test with smaller requests first

#### Issue: JSON parsing errors

**Error:** `Unexpected token in JSON`

**Solution:**

1. Check API endpoint responses
2. Verify Content-Type headers
3. Use browser Developer Tools to inspect responses

### Browser Issues

#### Issue: CORS errors

**Error:** `Access to XMLHttpRequest blocked by CORS policy`

**Solution:**
Already handled in server.js, but if issues persist:

```javascript
// Add to server.js
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  next();
});
```

#### Issue: JavaScript not loading

**Error:** 404 for script.js or style.css

**Solution:**

1. Check file paths in index.html
2. Ensure files exist in public/ directory
3. Check server static file serving
4. Clear browser cache (Ctrl+F5)

#### Issue: AJAX requests failing

**Error:** Network errors in console

**Solution:**

1. Open Developer Tools > Network tab
2. Check request headers and URLs
3. Verify server is responding
4. Check for JavaScript errors in Console

### Network Monitor Issues

#### Issue: Monitor not tracking requests

**Error:** Statistics showing 0 requests

**Solution:**

1. Ensure monitor is started before making requests
2. Check if HTTPClient is using monitored version
3. Verify event listeners are properly attached

#### Issue: Memory usage growing

**Error:** High memory consumption

**Solution:**

1. Increase history limit in monitor.js:
   ```javascript
   this.maxHistorySize = 50; // Reduce from 100
   ```
2. Call `monitor.reset()` periodically
3. Check for memory leaks in event listeners

## 🔧 Development Environment Issues

### VS Code Issues

#### Issue: Tasks not working

**Solution:**

1. Reload VS Code window (Ctrl+Shift+P → "Reload Window")
2. Check .vscode/tasks.json syntax
3. Ensure workspace is opened correctly

#### Issue: Debugging not working

**Solution:**

1. Check .vscode/launch.json configuration
2. Ensure Node.js debugger is enabled
3. Set breakpoints in appropriate files
4. Use "Attach to Process" if needed

### Git Issues

#### Issue: Large files in repository

**Solution:**

1. Check .gitignore is working
2. Remove node_modules from tracking:
   ```bash
   git rm -r --cached node_modules
   git commit -m "Remove node_modules"
   ```

#### Issue: Merge conflicts

**Solution:**

1. Use VS Code merge editor
2. Communicate with team members
3. Keep commits small and focused

## 🧪 Testing Issues

### Manual Testing

#### Issue: External APIs not responding

**Services:** GitHub API, JSONPlaceholder

**Solution:**

1. Check internet connectivity
2. Test with curl:
   ```bash
   curl -v https://api.github.com/users/octocat
   ```
3. Use alternative test endpoints
4. Mock responses for offline testing

#### Issue: Performance varies greatly

**Observation:** Response times inconsistent

**Expected behavior:**

- Local requests: 2-25ms
- External requests: 100-2000ms
- Network dependent variation is normal

### Load Testing

#### Issue: Server crashes under load

**Solution:**

1. Monitor memory usage
2. Implement request queuing
3. Add rate limiting
4. Use clustering for production

## 📊 Performance Issues

### High Memory Usage

**Symptoms:**

- Server using >100MB memory
- Slow response times
- System lag

**Solutions:**

1. Monitor with `process.memoryUsage()`
2. Limit request history size
3. Implement garbage collection hints
4. Use streaming for large responses

### Slow Response Times

**Symptoms:**

- API responses >100ms locally
- Frontend feels sluggish

**Solutions:**

1. Check for blocking operations
2. Use asynchronous operations
3. Implement caching
4. Optimize database queries (if applicable)

## 🌐 Network Issues

### External API Failures

**Common scenarios:**

- Rate limiting (429 errors)
- Service downtime (503 errors)
- Network timeouts

**Solutions:**

1. Implement retry logic with backoff
2. Cache successful responses
3. Have fallback test data
4. Monitor API status pages

### Local Network Issues

**Symptoms:**

- Can't access localhost:3000
- Browser shows connection errors

**Solutions:**

1. Check Windows Firewall settings
2. Verify antivirus isn't blocking
3. Test with different browsers
4. Try 127.0.0.1 instead of localhost

## 📱 Browser Compatibility

### Older Browsers

**Issues:**

- ES6+ features not supported
- Fetch API not available

**Solutions:**

1. Use babel for transpilation
2. Add polyfills for older browsers
3. Test with different browsers
4. Provide fallback implementations

### Mobile Browsers

**Issues:**

- Responsive design problems
- Touch interaction issues

**Solutions:**

1. Test on actual devices
2. Use browser dev tools mobile simulation
3. Adjust CSS media queries
4. Test touch events

## 🔒 Security Considerations

### Development vs Production

**Development (current):**

- Detailed error messages
- No rate limiting
- CORS allow all

**Production requirements:**

- Sanitize error messages
- Implement rate limiting
- Restrict CORS origins
- Add authentication
- Use HTTPS

## 📞 Getting Help

### During Lab Session

- Ask instructor or TAs
- Collaborate with team members
- Check lab Discord/Slack channel

### Self-Help Resources

1. Node.js documentation
2. Express.js guides
3. MDN Web Docs
4. Stack Overflow
5. GitHub Issues

### Emergency Backup Plan

If everything fails during demo:

1. Use prepared screenshots
2. Walk through code without running
3. Explain architecture concepts
4. Show alternative working version

## 📝 Logging for Debug

Add detailed logging to help troubleshooting:

```javascript
// Enhanced logging in server.js
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  console.log("Headers:", req.headers);
  next();
});

// Enhanced logging in client.js
console.log("Request details:", {
  method: options.method,
  url: options.url,
  headers: requestOptions.headers,
  timestamp: new Date().toISOString(),
});
```

Remember: Most issues can be resolved by carefully reading error messages and checking the basics (server running, correct ports, file paths, etc.).
