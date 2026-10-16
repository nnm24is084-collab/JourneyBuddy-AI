# Module 11 — Google ADK / Mobile Client Lifecycle
**Reference specified by PDF:** https://adk.dev/

## Exercise: asynchronous client/server lifecycle
```text
Idle -> UI event captured -> validate input -> Loading
  -> async request dispatched -> response received
  -> success: update data state -> re-render
  -> failure: update error state -> re-render
  -> next request returns to Loading
```

Avoid duplicate submissions while loading; handle retries, cancellation, stale responses and network errors; keep authentication tokens out of logs. The PDF names this module Google ADK (Android / App Development Kit); this README preserves the supplied terminology and URL. This is a conceptual mobile state diagram, not a mobile app implementation.
