# Integration Project — Intelligent Assistant System

## Goal
Design the end-to-end architecture required by the curriculum PDF.

## Architecture
```text
Next.js web client + Google ADK mobile client
                  |
                  v
        Node.js / FastAPI gateway
        Firebase Authentication
        Redis rate limiting/cache
                  |
                  v
 MongoDB Atlas Vector Search + Pinecone
                  |
                  v
         LangChain agent workflow
          /                 \
  tool invocation       formatted response
          \                 /
                  v
        client response (streaming where implemented)

Deployment target: Docker containers on Google Cloud Platform
```

## Required sequence
1. Client layer: web and mobile clients submit inquiries and receive responses.
2. Security/routing: Node.js/FastAPI gateway, Firebase authentication and Redis rate limiting.
3. Retrieval: index and retrieve knowledge through MongoDB Atlas Vector Search and Pinecone.
4. Reasoning: LangChain evaluates prompt/context and decides between tool calls and formatted response.
5. Infrastructure: containerize services with Docker and deploy to GCP.
6. Submission: push integration design, architecture blueprint and README.

## Honest implementation status
The existing JourneyBuddy app has a Next.js frontend, FastAPI backend, internship matching, roadmap generation and SQLite roadmap persistence. The architecture above is the PDF target design. Firebase, Redis, MongoDB Atlas Vector Search, Pinecone, LangChain, a mobile client, Docker and GCP deployment are documented as proposed components only unless separately configured and tested.

## Final submission checklist
- [ ] Copy this folder into the JourneyBuddy-AI repository.
- [ ] Review each module README and reference URL.
- [ ] Commit and push the deliverables.
- [ ] Confirm the commit appears on GitHub.
