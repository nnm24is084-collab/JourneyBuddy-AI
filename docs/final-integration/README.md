# JourneyBuddy AI — Final System Integration Architecture



## 1. Objective



The objective of this document is to describe the proposed end-to-end architecture for JourneyBuddy AI by connecting the concepts covered in Modules 2.1 through 2.12.



The design combines web and mobile clients, backend APIs, authentication, caching, hybrid vector retrieval, an AI orchestration layer, containerization, and cloud deployment.



\*\*Important:\*\* This document describes a proposed integration architecture. The inclusion of a technology in this design does not mean that the corresponding service has already been implemented, configured, or deployed.



## 2. System Overview



JourneyBuddy AI is designed as an AI-powered application through which users can submit inquiries using a web dashboard or mobile client and receive responses from backend services.



The proposed system contains the following layers:



1\. \*\*Presentation Layer:\*\* Next.js web frontend and Google ADK mobile client.

2\. \*\*API Layer:\*\* Node.js middleware and FastAPI services.

3\. \*\*Security Layer:\*\* Firebase Authentication, token verification, and route authorization.

4\. \*\*Performance Layer:\*\* Redis caching and rate limiting.

5\. \*\*Retrieval Layer:\*\* MongoDB Atlas Vector Search and Pinecone.

6\. \*\*AI Orchestration Layer:\*\* LangChain and an agentic tool-selection workflow.

7\. \*\*Infrastructure Layer:\*\* Docker containers and Google Cloud Platform (GCP).



## 3. High-Level Architecture Diagram



```mermaid id="jba2026"

flowchart TD

&#x20;   U\[User] --> W\[Next.js Web Client]

&#x20;   U --> M\[Google ADK Mobile Client]

&#x20;   W --> G\[Node.js API Gateway]

&#x20;   M --> G

&#x20;   G --> A\[Firebase Token Verification]

&#x20;   A --> R\[Redis Rate Limiting and Cache]

&#x20;   R --> F\[FastAPI Services]

&#x20;   F --> L\[LangChain Orchestration]

&#x20;   L --> D\[MongoDB Atlas Vector Search]

&#x20;   L --> P\[Pinecone Vector Search]

&#x20;   L --> T\[Approved Agent Tools]

&#x20;   D --> L

&#x20;   P --> L

&#x20;   T --> L

&#x20;   L --> F

&#x20;   F --> G

&#x20;   G --> W

&#x20;   G --> M

&#x20;   F -. Deployment .-> C\[Docker Containers]

&#x20;   C -. Hosting and Storage .-> GC\[GCP Infrastructure]

```



The diagram represents a conceptual service flow. Exact deployment boundaries, network connections, and request routing would be finalized during implementation.



## 4. Web and Mobile Clients



### 4.1 Next.js Web Frontend



The web application provides a dashboard where users can enter inquiries and view responses.



Proposed responsibilities:



\- Render pages and shared layout components.

\- Use static pre-rendering for suitable pages.

\- Use interactive client components for search, live status, and response updates.

\- Validate basic user input before submitting requests.

\- Display loading, success, empty, and error states.

\- Present streamed response content when supported by the backend.



### 4.2 Google ADK Mobile Client



The mobile client follows a similar request lifecycle:



1\. Capture a user interaction.

2\. Validate the input.

3\. Set the interface to a loading state.

4\. Dispatch an asynchronous network request.

5\. Receive the response or streaming updates.

6\. Update application state.

7\. Re-render the interface.



The web and mobile clients should use consistent API contracts and error-handling conventions.



## 5. Backend API Architecture



### 5.1 Node.js API Gateway and Middleware



The proposed Node.js layer acts as an entry point for incoming requests.



Middleware responsibilities include:



\- Inspect request headers and HTTP methods.

\- Capture request-entry timestamps.

\- Attach request identifiers for tracing.

\- Verify authentication information through the configured authentication integration.

\- Apply request-rate limits.

\- Record request telemetry.

\- Forward valid requests to the appropriate handler.

\- Return consistent error responses when requests are rejected.



Middleware should execute in a predictable order. Authentication and authorization checks must happen before protected operations are performed.



### 5.2 FastAPI Services



FastAPI provides typed API endpoints and schema validation for backend operations.



Proposed responsibilities:



\- Define request and response models.

\- Validate identifiers and filter query parameters.

\- Reject malformed payloads with structured error responses.

\- Coordinate retrieval and AI orchestration.

\- Apply backend business rules.

\- Return consistent status codes and response schemas.



Node.js and FastAPI should have clearly defined responsibilities to avoid duplicating validation, authorization, and business logic unnecessarily.



## 6. Authentication and Authorization



Firebase Authentication is the proposed identity provider.



The authentication lifecycle is:



1\. The user signs in through the supported client authentication flow.

2\. Firebase issues an authentication token after successful authentication.

3\. The client sends the token with protected API requests.

4\. Backend middleware verifies the token using the supported verification mechanism.

5\. The backend checks whether the authenticated user is authorized to access the requested resource.

6\. Authorized requests continue to the relevant service.

7\. Unauthorized requests receive an appropriate error response.



Authentication confirms identity, while authorization determines which resources the user may access. Protected operations must not rely solely on client-side checks.



## 7. Redis Caching and Rate Limiting



Redis is proposed for low-latency caching and request-rate control.



### 7.1 Cache-Aside Retrieval



The cache-aside workflow is:



1\. Construct a cache key from the relevant request parameters.

2\. Check Redis for the requested value.

3\. If the value exists and is valid, return the cached result.

4\. If the value is missing or expired, query the appropriate persistent service.

5\. Store eligible results in Redis with a configured time-to-live (TTL).

6\. Return the result to the caller.



Cache keys should include relevant tenant, user, or authorization context when needed to prevent data from being shared across users incorrectly.



### 7.2 Rate Limiting



The API layer can use Redis to track request counts over a defined time window.



The rate-limiting design should specify:



\- The identity used for limiting, such as an authenticated user or client.

\- The permitted request count and time window.

\- How rejected requests are represented.

\- How rate-limit state expires.

\- How limits behave when Redis is temporarily unavailable.



Sensitive or user-specific responses should only be cached when the cache key, access controls, and invalidation rules are appropriate.



## 8. Hybrid Vector Retrieval



The proposed retrieval layer combines MongoDB Atlas Vector Search and Pinecone.



### 8.1 MongoDB Atlas Vector Search



MongoDB Atlas stores application documents and associated metadata, such as:



\- Document identifier.

\- Author or source.

\- Category.

\- Creation or update timestamp.

\- Text or content reference.

\- Embedding vector.



A vector index should be configured for the embedding field with the appropriate vector dimensions and similarity metric. Metadata filters can help restrict retrieval to relevant categories or permitted records.



### 8.2 Pinecone



Pinecone provides a vector-indexing and similarity-search option for semantic retrieval.



The proposed workflow is:



1\. Generate an embedding for the user's query.

2\. Search the configured vector index.

3\. Retrieve the most relevant candidate records.

4\. Apply supported metadata filters.

5\. Evaluate similarity and relevance.

6\. Pass suitable results to the AI orchestration layer.



Cosine similarity may be used where appropriate for the selected embedding model and index configuration.



### 8.3 Combining Both Retrieval Systems



The integration design must define why each vector system is used. For example, MongoDB Atlas may support retrieval closely coupled to application documents and metadata, while Pinecone may support a separately managed semantic index.



If both systems are queried, the application should define how results are normalized, deduplicated, ranked, and combined. It should also consider indexing consistency, latency, cost, and failure handling.



Using both systems does not automatically improve retrieval quality; the decision should be validated through testing.



## 9. LangChain and Agentic AI



LangChain is proposed as the orchestration layer for retrieval-augmented generation and approved tool use.



The conceptual pipeline is:



1\. Receive the validated user inquiry.

2\. Construct the prompt and required context.

3\. Retrieve relevant information from the configured retrieval services.

4\. Insert selected context into the model input.

5\. Invoke the configured language model.

6\. Parse and validate the model output.

7\. Return the response through the backend API.



An agentic workflow may select between approved tools, such as web search and an authorized internal database query, when additional information is required.



The agent should evaluate tool results before continuing. It must follow execution limits, access permissions, and safety checks. It should not claim that an external action succeeded unless the relevant tool confirms success.



## 10. Streaming Responses



The web and mobile clients may receive incremental response updates when streaming is supported by the backend.



A proposed streaming lifecycle is:



1\. The client submits an inquiry.

2\. The backend authenticates and validates the request.

3\. The orchestration layer processes the request.

4\. The backend emits response chunks using an appropriate streaming protocol.

5\. The client renders chunks as they arrive.

6\. The backend signals completion or an error.

7\. The client finalizes the interface state.



The implementation must define the selected protocol, such as Server-Sent Events or streaming over a supported HTTP connection, along with cancellation, timeout, and reconnection behaviour.



## 11. Docker and Deployment on GCP



Docker is proposed for packaging the application services into reproducible containers.



The container design should:



\- Use appropriate, minimal base images.

\- Install only required dependencies.

\- Separate build and runtime stages where useful.

\- Copy only necessary application artifacts.

\- Expose the required service ports.

\- Configure startup commands and health checks.

\- Run with appropriate permissions.

\- Avoid embedding credentials or secrets in the image.



GCP is the proposed cloud platform for hosting services and storing relevant assets.



The final deployment design should select suitable GCP products based on service requirements. It should document:



\- The services and resources to be deployed.

\- The storage bucket layout.

\- Public and private asset access.

\- IAM role bindings and service identities.

\- Network access rules.

\- Environment configuration and secret management.

\- Logs, metrics, health checks, and monitoring.



Resources should follow least-privilege access. Private data and internal service endpoints should not be exposed publicly without an explicit requirement and suitable controls.



## 12. End-to-End Request Lifecycle



The proposed request lifecycle is:



1\. A user submits an inquiry through the web or mobile client.

2\. The client validates basic input and sends the request.

3\. Node.js middleware captures telemetry and verifies authentication through the configured integration.

4\. Redis applies the configured rate limit and checks for an eligible cached result.

5\. On a cache miss, the request reaches the appropriate FastAPI endpoint.

6\. FastAPI validates the request schema and coordinates the operation.

7\. LangChain constructs the context and initiates retrieval.

8\. The retrieval layer queries MongoDB Atlas Vector Search, Pinecone, or both according to the retrieval strategy.

9\. An approved agent tool may be called if additional information is necessary.

10\. The orchestration layer generates and validates the response.

11\. FastAPI returns or streams the result through the API layer.

12\. The client displays the response and updates its state.

13\. Eligible results may be cached under the defined cache policy.



This is a proposed flow. The exact sequence may vary depending on authentication, caching, retrieval, and streaming implementation choices.



## 13. Error Handling and Observability



The integrated design should define consistent behaviour for:



\- Invalid requests and schema-validation errors.

\- Missing, invalid, or expired authentication tokens.

\- Unauthorized resource access.

\- Rate-limit violations.

\- Redis failures and cache misses.

\- Vector-search timeouts or unavailable indexes.

\- Language-model errors and invalid outputs.

\- Streaming interruption and client cancellation.

\- Container health-check failures.

\- Cloud storage permission errors.



The backend should use appropriate HTTP status codes and structured error bodies. Internal stack traces, secrets, tokens, and sensitive user data should not be exposed to clients.



Request identifiers, timestamps, latency metrics, and service-level error metrics should support troubleshooting across the system. Logs should follow privacy and retention requirements.



## 14. Configuration and Secrets



Configuration should be environment-specific and external to application source code where appropriate.



Examples of configuration categories include:



\- Backend service URLs and ports.

\- Firebase project and token-verification configuration.

\- Redis connection and TTL settings.

\- MongoDB Atlas connection configuration.

\- Pinecone index configuration.

\- Embedding model and language-model settings.

\- Streaming and timeout settings.

\- GCP resource identifiers and IAM configuration.



Secrets must be stored using an appropriate secret-management mechanism. Real credentials must not be committed to GitHub or placed in public documentation.



A documented environment-variable template may contain placeholder values, but it must not contain real keys, passwords, or tokens.



## 15. Integration Testing Plan



The following tests are proposed before deployment:



1\. Confirm that web and mobile clients can submit valid requests.

2\. Verify that malformed API requests receive structured validation errors.

3\. Confirm that invalid tokens and unauthorized requests are rejected.

4\. Verify that rate limits are applied consistently.

5\. Test Redis cache hits, misses, and TTL expiration.

6\. Validate document metadata and vector-index configuration.

7\. Compare retrieval relevance and latency for the selected vector-search strategy.

8\. Confirm that LangChain receives the intended context.

9\. Test approved agent tool selection and execution limits.

10\. Verify that streaming updates appear in the client in the correct order.

11\. Test cancellation, timeouts, and service failures.

12\. Build and run container images in a controlled environment.

13\. Validate GCP IAM permissions and private asset access.

14\. Check that secrets and sensitive data are not exposed in logs.

15\. Test the complete request lifecycle from client submission to final response.



## 16. GitHub Documentation Deliverables



The proposed repository documentation should include:



\- Individual README files for Modules 2.1 through 2.12.

\- This final integration architecture README.

\- Architecture and workflow diagrams.

\- API schema and validation specifications.

\- Authentication and authorization flow.

\- Cache and rate-limit specifications.

\- Vector schema and index design.

\- AI orchestration and tool-selection workflow.

\- Docker and cloud deployment specifications.

\- Integration and testing plans.



These documents describe design deliverables. Any code, infrastructure configuration, or working integration should be added and tested separately before being described as implemented.



## 17. Conclusion



This document presents a proposed end-to-end architecture for JourneyBuddy AI. It explains how the web and mobile clients, API services, authentication, Redis, hybrid vector retrieval, LangChain, agentic AI, Docker, and GCP could work together.



The architecture provides a foundation for implementation, testing, deployment, and future improvement. Actual technology choices, service configurations, security controls, and performance characteristics must be verified during implementation.



## 18. Technical Documentation



\- Next.js: https://nextjs.org/docs

\- Node.js: https://nodejs.org/en/docs/

\- FastAPI: https://fastapi.tiangolo.com/

\- Firebase Authentication: https://firebase.google.com/docs/auth

\- MongoDB Atlas Vector Search: https://www.mongodb.com/docs/atlas/atlas-vector-search/

\- Pinecone: https://docs.pinecone.io/

\- Redis: https://redis.io/docs/

\- Docker: https://docs.docker.com/

\- Google Cloud: https://cloud.google.com/docs

\- LangChain: https://python.langchain.com/docs/

\- Google ADK reference supplied in the assignment: https://adk.dev/

\- Agent Skills: https://agentskills.io/home




