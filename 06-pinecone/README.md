# Module 6 — Pinecone and Vector Databases
**Reference:** https://docs.pinecone.io/

## Semantic clusters (illustrative)
- Internship search: “Find a data science internship”; “Show machine learning internship openings.”
- Learning roadmap: “What Python skills should I learn next?”; “Create a plan to improve SQL.”
- Application preparation: “Help me prepare my resume”; “Give me interview practice questions.”

Cosine similarity is `(A · B) / (||A|| × ||B||)`. Higher similarity usually means vectors point in more similar directions; it is not a probability of relevance.

## Workflow
1. Embed sentences using one embedding model.
2. Upsert vectors and metadata with unique IDs into an index configured for the correct dimension and metric.
3. Embed the user query using the same model.
4. Query top-k nearest vectors, optionally using metadata filters.
5. Review ranked results for contextual relevance.

No numeric scores are claimed because no live embedding experiment was run.
