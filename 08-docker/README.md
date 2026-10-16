# Module 8 — Docker Containerization
**Reference:** https://docs.docker.com/

## Illustrative multi-stage FastAPI Dockerfile
```dockerfile
FROM python:3.12-slim AS builder
WORKDIR /build
COPY requirements.txt .
RUN pip install --no-cache-dir --prefix=/install -r requirements.txt

FROM python:3.12-slim AS runtime
ENV PYTHONDONTWRITEBYTECODE=1 PYTHONUNBUFFERED=1
WORKDIR /app
COPY --from=builder /install /usr/local
COPY app ./app
EXPOSE 8000
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

Optimization notes: pin tested dependencies; use `.dockerignore` for `.venv`, `.git`, caches, local DBs and secrets; run as non-root in production; inject secrets at runtime; add health checks; test the image before deployment. Adjust paths and dependencies to the actual backend. This is a specification, not a tested image.
