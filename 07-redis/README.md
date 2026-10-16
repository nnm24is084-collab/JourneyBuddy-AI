# Module 7 — Redis Cache-Aside
**Reference:** https://redis.io/docs/

## Workflow
```text
GET key -> cache hit: return cached value
        -> cache miss: query persistent store
                       -> if found, SET cache value with TTL
                       -> return value
```

```python
def get_profile(user_id):
    key = f"profile:{user_id}"
    cached = redis.get(key)
    if cached is not None:
        return decode(cached)
    value = database.fetch_profile(user_id)
    if value is None:
        return None
    redis.set(key, encode(value), ex=300)  # five-minute TTL
    return value
```
Helpers and connections are illustrative. Set TTL based on freshness needs and invalidate or expire stale values after updates. Avoid caching sensitive data unless explicitly permitted by the security design.
