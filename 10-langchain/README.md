# Module 10 — LangChain Retrieval Pipeline
**Reference:** https://python.langchain.com/docs/

## Pipeline
```text
Validate input -> dynamic slots (question, context, filters)
 -> vector search -> top-k documents -> build context prompt
 -> invoke model -> parse/validate output -> return response and permitted sources
```

Example input:
```json
{"question":"How should I prepare for a data science internship?","filters":{"category":"career-guidance"},"top_k":5}
```

Bound user input and `top_k`; enforce retrieval permissions; treat retrieved documents as data, not instructions; handle empty results, timeouts and provider failures; validate structured output before downstream use; never expose secrets or private documents. This pipeline is conceptual and not claimed to be integrated.
