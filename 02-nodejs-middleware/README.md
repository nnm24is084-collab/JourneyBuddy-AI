# Module 2 — Node.js Middleware Architecture
**Reference:** https://nodejs.org/en/docs/

## Exercise
Inspect request headers, capture entry timestamps, write telemetry, and forward to the next handler.

```text
HTTP request -> timestamp + request ID -> inspect safe headers
 -> record start metric -> next middleware -> route handler
 -> record status/duration -> response
```

Illustrative Express-style pseudocode:
```js
function telemetryMiddleware(req, res, next) {
  const startedAt = Date.now();
  req.requestId = req.headers["x-request-id"] || createRequestId();
  recordMetric({ event: "request_started", requestId: req.requestId,
    method: req.method, path: req.path,
    timestamp: new Date(startedAt).toISOString() });
  res.on("finish", () => recordMetric({ event: "request_finished",
    requestId: req.requestId, statusCode: res.statusCode,
    durationMs: Date.now() - startedAt }));
  next();
}
```
`createRequestId` and `recordMetric` are illustrative helpers. Never log passwords, tokens, or secrets. Telemetry failure should not accidentally crash normal request handling.
