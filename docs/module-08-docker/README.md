# Module 2.8: Docker — Containerization and Multi-Stage Builds



## 1. Objective



The objective of this module is to understand how Docker packages an application and its dependencies into containers for consistent deployment.



This conceptual exercise focuses on:



\- Understanding Docker images and containers.

\- Designing a multi-stage Docker build.

\- Using a minimal base image to reduce the final image size.

\- Copying only the required build artifacts into the production image.

\- Exposing the application's required port.

\- Documenting container startup and deployment instructions.



\*\*Note:\*\* This README describes a proposed containerization design for JourneyBuddy AI. It does not claim that a Docker image has been built or deployed.



## 2. Introduction



Docker is a platform that allows applications and their dependencies to be packaged into portable containers.



A Docker image is a template used to create containers. A container is a running instance of an image.



Containerization helps make application behavior more consistent across development, testing, and deployment environments.



For JourneyBuddy AI, Docker could be used to package the frontend and backend services independently, allowing each service to be configured and deployed according to its requirements.



## 3. Multi-Stage Docker Builds



A multi-stage build uses multiple stages in a Dockerfile.



The build stage contains the tools and dependencies needed to prepare the application. The final stage copies only the required production artifacts into a smaller runtime image.



Benefits include:



\- Reduced final image size.

\- Separation of build-time and runtime dependencies.

\- Improved deployment efficiency.

\- A smaller set of tools in the production container.

\- Easier maintenance of application packaging.



The appropriate base image depends on the application runtime and its compatibility requirements.



## 4. Proposed Container Architecture



The proposed architecture separates the application into services:



\- \*\*Frontend:\*\* Next.js web application.

\- \*\*Backend:\*\* API service responsible for application logic.

\- \*\*Supporting services:\*\* External databases, Redis, authentication, and vector-search services where configured.



Each service can have its own Dockerfile and runtime configuration.



The frontend communicates with the backend through configured API endpoints. The backend connects to supporting services using environment-based configuration and appropriate credentials.



## 5. Multi-Stage Build Workflow



```text

Application Source Code

&#x20;         |

&#x20;         v

&#x20;     Build Stage

&#x20;         |

&#x20;         v

&#x20;Install Dependencies

&#x20;         |

&#x20;         v

&#x20;Build / Prepare Artifacts

&#x20;         |

&#x20;         v

&#x20;     Runtime Stage

&#x20;         |

&#x20;         v

&#x20;Copy Required Artifacts

&#x20;         |

&#x20;         v

&#x20;Configure Runtime Port

&#x20;         |

&#x20;         v

&#x20;Start Application Container

```



The exact build commands and copied artifacts depend on whether the service is a Next.js application, a Python API, or another application type.



## 6. Example Multi-Stage Dockerfile



The following is an illustrative Dockerfile structure for a Node.js application. It must be adapted to the actual application and its build configuration before use.



```dockerfile

# Stage 1: Build the application

FROM node:22-alpine AS builder



WORKDIR /app



COPY package\*.json ./

RUN npm ci



COPY . .

RUN npm run build



# Stage 2: Production runtime

FROM node:22-alpine AS runtime



WORKDIR /app



ENV NODE\_ENV=production



COPY --from=builder /app/package\*.json ./

RUN npm ci --omit=dev



COPY --from=builder /app/dist ./dist



EXPOSE 3000



CMD \["node", "dist/index.js"]

```



\*\*Important:\*\* This example assumes a Node.js application that generates a `dist` directory containing `index.js`. It is not a ready-to-run Dockerfile for every Node.js or Next.js project. The output directory, start command, dependencies, and production packaging must match the actual application.



For Next.js, the Dockerfile should follow the project's configured build output and start procedure. For a Python/FastAPI backend, a separate Dockerfile based on a compatible Python image would be more appropriate.



## 7. Dockerfile Instructions



| Instruction | Purpose |

|---|---|

| `FROM` | Selects the base image for a build stage |

| `WORKDIR` | Sets the working directory inside the image |

| `COPY` | Copies files into the image |

| `RUN` | Executes a command while building the image |

| `ENV` | Defines environment variables |

| `EXPOSE` | Documents the port the application listens on |

| `CMD` | Defines the default command used to start the container |



The `EXPOSE` instruction does not publish a port to the host by itself. Port publishing is configured when the container is run or through the deployment configuration.



## 8. Image Size and Security Considerations



The proposed design should follow these practices:



\- Use an appropriate, maintained base image.

\- Prefer minimal runtime images when compatible.

\- Use multi-stage builds to avoid copying unnecessary build tools.

\- Exclude local dependencies, secrets, and unnecessary files using `.dockerignore`.

\- Avoid storing passwords, API keys, or service credentials in the Dockerfile.

\- Run the application as a non-root user when practical.

\- Keep dependencies updated.

\- Use a suitable `.dockerignore` file to prevent unnecessary files from entering the build context.



## 9. Ports and Environment Configuration



Each service should document its required port and environment variables.



For example:



| Setting | Purpose |

|---|---|

| Application port | Port on which the service listens inside the container |

| API base URL | Backend endpoint used by the frontend |

| Database URI | Connection information supplied securely at runtime |

| Redis configuration | Connection settings for the cache service |

| Environment mode | Identifies development or production configuration |



Actual variable names should be documented according to the application's implementation. Secrets should be supplied through an appropriate environment or secrets-management mechanism.



## 10. Proposed Build and Startup Commands



Once an appropriate Dockerfile has been created, a developer could use commands such as:



```bash

# Build an image from the current directory

docker build -t journeybuddy-service .



# Start the container and publish port 3000

docker run --rm -p 3000:3000 journeybuddy-service

```



These commands are illustrative. The correct port and image configuration depend on the service being packaged.



Useful validation commands include:



```bash

# List locally available Docker images

docker images



# List running containers

docker ps



# View container logs

docker logs CONTAINER\_ID

```



Replace `CONTAINER\_ID` with the actual container identifier returned by Docker.



## 11. Testing and Validation Plan



If the design is implemented, the following checks should be performed:



1\. Confirm that Docker is installed and running.

2\. Verify that the correct Dockerfile and build context are used.

3\. Build the image and resolve any dependency or compilation errors.

4\. Confirm that required artifacts exist in the final image.

5\. Start the container with the correct configuration.

6\. Verify that the application listens on the expected port.

7\. Test the application endpoint or frontend in a browser.

8\. Inspect logs if startup fails.

9\. Confirm that secrets and unnecessary development files are not included in the image.

10\. Verify that the service can communicate with its required dependencies.



## 12. Expected Outcome



After completing this conceptual exercise, the expected understanding is:



\- How Docker images and containers work.

\- How multi-stage builds separate build and runtime environments.

\- How minimal base images and selective file copying can reduce image size.

\- How ports and environment variables configure containerized services.

\- How to plan container startup, testing, and troubleshooting.



## 13. Deliverables



The deliverables for this module are:



\- This Markdown README.

\- A proposed multi-stage Dockerfile specification.

\- Dockerfile instruction and image-layer notes.

\- Container port and configuration documentation.

\- Build, startup, and validation instructions.



## 14. Official Documentation



Docker documentation: https://docs.docker.com/



Refer to the official documentation for Dockerfiles, multi-stage builds, image optimization, networking, and container execution.



## 15. Conclusion



Docker provides a consistent way to package applications and their dependencies. A well-designed multi-stage build separates application compilation from production execution and includes only the necessary runtime artifacts. This conceptual design can later support containerized deployment of the JourneyBuddy AI frontend and backend services.



