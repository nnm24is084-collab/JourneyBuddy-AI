# Module 2.7: Redis — Caching and Cache-Aside Pattern



## 1. Objective



The objective of this module is to understand how Redis can improve application performance through caching.



This conceptual exercise focuses on:



\- Checking whether requested data exists in the cache.

\- Retrieving data directly from Redis when a cache hit occurs.

\- Querying persistent storage when a cache miss occurs.

\- Storing retrieved data in the cache for future requests.

\- Using Time-To-Live (TTL) to manage cache expiration.



\*\*Note:\*\* This document describes a proposed caching design. It does not claim that Redis has been installed or integrated into the JourneyBuddy AI application.



## 2. Introduction



Redis is an in-memory data store that can be used as a cache. Frequently requested information can be stored in Redis so that an application does not need to query its persistent database every time.



Caching can reduce response latency and the number of repeated database queries.



The cache-aside pattern is a common caching strategy in which the application checks the cache first and retrieves data from persistent storage only when the requested item is not available in the cache.



## 3. Cache-Aside Pattern



The proposed workflow follows these steps:



1\. A client requests information from the application.

2\. The application generates a cache key for the requested information.

3\. The application checks Redis using that key.

4\. If the data exists in Redis, the application returns the cached result. This is a \*\*cache hit\*\*.

5\. If the data does not exist, the application queries persistent storage, such as a database. This is a \*\*cache miss\*\*.

6\. The application stores the retrieved result in Redis.

7\. A TTL is assigned to the cached entry when appropriate.

8\. The application returns the result to the client.



## 4. Cache-Aside Flow Diagram



```text

&#x20;         Client Request

&#x20;               |

&#x20;               v

&#x20;      Generate Cache Key

&#x20;               |

&#x20;               v

&#x20;        Check Redis Cache

&#x20;               |

&#x20;         +-----+-----+

&#x20;         |           |

&#x20;         v           v

&#x20;     Cache Hit    Cache Miss

&#x20;         |           |

&#x20;         v           v

&#x20;    Return Data   Query Database

&#x20;                     |

&#x20;                     v

&#x20;                Store in Redis

&#x20;                with TTL

&#x20;                     |

&#x20;                     v

&#x20;                 Return Data

```



## 5. Cache Hit and Cache Miss



### Cache Hit



A cache hit occurs when the requested key exists in Redis and its value is still valid.



Example:



\- Requested key: `journey:123`

\- Redis contains the cached journey details.

\- The application retrieves the value from Redis.

\- The application returns the result without querying the database.



### Cache Miss



A cache miss occurs when the requested key is absent or the cached entry has expired.



Example:



\- Requested key: `journey:456`

\- Redis does not contain the requested journey.

\- The application queries persistent storage.

\- The application stores the retrieved journey in Redis.

\- The application returns the result.



If the database has no matching record, the application should handle the missing result appropriately instead of caching an invalid response unintentionally.



## 6. Cache Key Design



Cache keys should be descriptive and consistent.



| Example key | Purpose |

|---|---|

| `journey:123` | Cached journey details |

| `user:101:preferences` | Cached user preferences |

| `search:beach:goa` | Cached results for a particular search |

| `destination:manali` | Cached destination information |



Key names should distinguish different types of information. If cached data depends on user identity, filters, permissions, or other parameters, the key design should account for those differences to avoid returning the wrong result.



Sensitive information should not be placed directly in cache keys.



## 7. Time-To-Live (TTL)



TTL specifies how long a cached entry should remain available before it expires.



For example, a cached destination result could have a TTL of 300 seconds. After the TTL expires, Redis can treat the entry as expired, and a later request can retrieve fresh data from persistent storage.



TTL helps:



\- Limit the lifetime of cached information.

\- Reduce the chance of serving outdated data indefinitely.

\- Manage cache storage.

\- Refresh frequently changing information when needed.



TTL values should be selected according to the type of data and how frequently it changes. A five-minute TTL is only an illustrative example, not a universal setting.



## 8. Cache Invalidation and Data Consistency



Cached data can become outdated when the underlying database record changes.



A proposed cache-management strategy should consider:



\- \*\*Expiration:\*\* Allow entries to expire according to their TTL.

\- \*\*Invalidation:\*\* Remove or update relevant cache entries after changes to persistent data.

\- \*\*Refresh:\*\* Fetch fresh data when a cache miss occurs.

\- \*\*Consistency:\*\* Define how the application handles updates that happen while an older value is cached.



For example, if journey details change in the database, the application may delete the corresponding `journey:123` cache entry so the next request retrieves the updated record.



## 9. Error Handling



The proposed caching workflow should handle the following situations:



\- Redis is unavailable.

\- A requested cache key does not exist.

\- A cached value cannot be decoded.

\- Persistent storage is unavailable.

\- A database query returns no matching record.

\- Cached data becomes outdated.



Where appropriate, the application can fall back to persistent storage if Redis is unavailable. The fallback must be designed carefully because a database-only fallback may increase database load.



## 10. Testing and Validation Plan



If this design is implemented, the following tests should be performed:



1\. Request a key that is already cached and verify that the cached value is returned.

2\. Request a key that is absent from Redis and verify that persistent storage is queried.

3\. Verify that retrieved data is stored in Redis after a cache miss.

4\. Confirm that the configured TTL is applied.

5\. Wait for a short test TTL to expire and verify that the next request follows the cache-miss workflow.

6\. Update persistent data and test the selected invalidation strategy.

7\. Test the application's behavior when Redis is unavailable.

8\. Verify that different users or query parameters do not accidentally share incompatible cached results.



## 11. Expected Outcome



After completing this conceptual exercise, the expected understanding is:



\- How Redis can act as an application cache.

\- How the cache-aside pattern works.

\- The difference between cache hits and cache misses.

\- How cache keys organize stored values.

\- How TTL controls the lifetime of cached entries.

\- How invalidation and fallback strategies help manage consistency and failures.



## 12. Deliverables



The deliverables for this module are:



\- This Markdown README.

\- The cache-aside workflow diagram.

\- Example cache key definitions.

\- TTL and expiration design notes.

\- Cache error-handling and validation plans.



## 13. Official Documentation



Redis documentation: https://redis.io/docs/



Refer to the official documentation for Redis data types, key expiration, and cache-related implementation details.



## 14. Conclusion



Redis can improve application responsiveness by keeping frequently accessed information in memory. With the cache-aside pattern, the application checks Redis first, queries persistent storage on a cache miss, and caches retrieved results with an appropriate TTL. This proposed design can later support efficient destination searches and other frequently requested information in JourneyBuddy AI.




