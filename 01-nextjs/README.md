# Module 1 — Next.js Frontend Architecture
**Reference:** https://nextjs.org/docs

## Exercise
Define client/server boundaries for the multi-page dashboard.

## Proposed layout
```text
frontend/app/
  page.tsx                 # Dashboard route
  internships/page.tsx     # Internship route
  roadmap/page.tsx         # Roadmap route
  components/
    SiteNavigation.tsx     # Mostly static UI
    InternshipSearch.tsx   # Interactive form (client)
    MatchResults.tsx       # Results display
    RoadmapGenerator.tsx   # Interactive controls (client)
```

Static headings, navigation labels, and explanatory content can be pre-rendered. Components using React state, event handlers, browser APIs, loading states, or client-side API calls need a client boundary. Keep secrets server-side. Browser-side requests to FastAPI must show loading and error states.

```text
Browser -> Next.js route -> rendered layout
                           -> interactive client form
                           -> FastAPI on submit
                           -> state update -> results render
```
JourneyBuddy already has dashboard, internships, and roadmap pages; this document describes the intended boundary and does not claim a complete refactor.
