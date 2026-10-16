# Module 5 — MongoDB Database and Atlas Vector Search
**Reference:** https://www.mongodb.com/docs/atlas/atlas-vector-search/

## Example document schema
```json
{
  "_id": "doc-001",
  "text": "Preparing for a data science internship",
  "author": "JourneyBuddy",
  "category": "career-guidance",
  "createdAt": "2026-10-01T10:00:00Z",
  "embedding": [0.12, -0.08, 0.31]
}
```
The short vector is illustrative only. Production embeddings need the full dimensionality required by the selected model.

## Illustrative ANN index fields
```json
{
  "fields": [
    {"type":"vector","path":"embedding","numDimensions":1536,"similarity":"cosine"},
    {"type":"filter","path":"category"},
    {"type":"filter","path":"author"}
  ]
}
```
`1536` is only an example and must match the actual embedding model. Workflow: embed query using compatible model; perform approximate nearest-neighbor search; apply metadata filters; return relevant documents; evaluate results. This is a design, not an active Atlas index.
