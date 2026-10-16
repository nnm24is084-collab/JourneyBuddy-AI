# Module 4 — Firebase Authentication
**Reference:** https://firebase.google.com/docs/auth

## Exercise and sequence
```text
Client submits credentials -> Firebase Authentication
 -> client receives ID token -> request to protected FastAPI route
 -> backend verifies token using Firebase Admin SDK
 -> backend checks role/resource permission -> response (or 401/403)
```

Never store raw passwords in the application database. Use HTTPS; verify tokens on the backend; do not trust a user ID merely because it appears in the request body. Return 401 for missing/invalid authentication and 403 for authenticated but unauthorized users. Keep service-account credentials out of source control and browser bundles. This is the required lifecycle design; Firebase is not claimed to be configured in the current app.
