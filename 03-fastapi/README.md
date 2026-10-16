# Module 3 — FastAPI Schema Validation
**Reference:** https://fastapi.tiangolo.com/

## Exercise
Specify strict body and query validation and the malformed-input error path.

```python
from typing import Literal
from pydantic import BaseModel, ConfigDict, Field

class EntityQuery(BaseModel):
    model_config = ConfigDict(extra="forbid")
    entity_ids: list[str] = Field(min_length=1, max_length=100)
    category: str | None = Field(default=None, min_length=1, max_length=80)
    sort_by: Literal["created_at", "name"] = "created_at"
    descending: bool = True
```

Rules: 1–100 entity IDs; reject unknown fields; bound category length; allow only supported sort fields; type and bound query/path parameters.

```text
Request -> parse body/parameters -> validation
  valid -> endpoint -> typed response
  invalid -> HTTP 422 with JSON `detail` validation errors
```
Example response shape: `{"detail":[{"loc":["body","entity_ids"],"msg":"Field required","type":"missing"}]}`. Exact messages can vary by version. This is a documented example, not a claim the model is wired into the existing app.
