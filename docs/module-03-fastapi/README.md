# Module 2.3: FastAPI Framework



## 1. Objective



Define strict schema validation rules for a FastAPI endpoint that accepts identifiers and filter query parameters. Document how malformed request payloads are validated and how automated error responses are returned.



This module focuses on schema definitions, validation rules, and the request-validation workflow.



## 2. Overview



FastAPI is a Python web framework for building APIs. It uses Python type hints and Pydantic models to validate request data and generate API documentation.



For JourneyBuddy-AI, a FastAPI endpoint can validate incoming identifiers and filtering parameters before processing an internship search or another application request.



## 3. Proposed Endpoint Design



Example endpoint:



`GET /api/internships/{internship\_id}`



Purpose:

\- Accept an internship identifier as a path parameter.

\- Accept optional filters through query parameters.

\- Validate incoming values before running the endpoint logic.

\- Return structured responses for successful requests and validation failures.



The endpoint is a proposed example for documenting validation behavior; it does not claim that this exact route already exists in the application.



## 4. Schema and Validation Rules



### 4.1 Path Parameter



| Parameter | Type | Validation rule |

|---|---|---|

| `internship\_id` | Integer | Must be a positive integer |



Example valid request:



`GET /api/internships/12`



Example invalid request:



`GET /api/internships/abc`



The invalid request should be rejected because the identifier cannot be converted into an integer.



### 4.2 Query Parameters



| Parameter | Type | Validation rule |

|---|---|---|

| `location` | Optional string | Trim whitespace and enforce an appropriate maximum length |

| `category` | Optional string | Must be one of the supported categories, if a fixed category list is defined |

| `page` | Integer | Must be greater than or equal to 1 |

| `limit` | Integer | Must be within the configured range, for example 1â€“100 |



Example valid request:



`GET /api/internships/12?location=Pune&page=1&limit=20`



Example invalid request:



`GET /api/internships/12?page=0&limit=500`



The invalid request should fail validation because `page` and `limit` fall outside the proposed allowed ranges.



These validation rules are design choices for the example endpoint and can be adjusted to match the actual application requirements.



## 5. Pydantic Schema Example



The following Python example defines a strict request model for filter data.



```python

from pydantic import BaseModel, ConfigDict, Field





class InternshipFilters(BaseModel):

&#x20;   model\_config = ConfigDict(extra="forbid")



&#x20;   location: str | None = Field(default=None, max\_length=100)

&#x20;   category: str | None = Field(default=None, max\_length=50)

&#x20;   page: int = Field(default=1, ge=1)

&#x20;   limit: int = Field(default=20, ge=1, le=100)

```



### Explanation



\- `BaseModel` defines a structured data model.

\- `ConfigDict(extra="forbid")` rejects unexpected fields supplied to this model.

\- `Field()` defines constraints and default values.

\- `ge=1` means the value must be greater than or equal to 1.

\- `le=100` sets an upper limit of 100.

\- Optional string fields can be omitted when they are not required.



This example demonstrates a model for documenting validation rules. FastAPI endpoint parameters must be declared appropriately for these rules to be applied to actual requests.



## 6. Validation Workflow



```text

Incoming HTTP Request

&#x20;        |

&#x20;        v

Extract Path and Query Parameters

&#x20;        |

&#x20;        v

Apply Type and Schema Validation

&#x20;        |

&#x20;        +----------------------+

&#x20;        |                      |

&#x20;        v                      v

&#x20;   Valid Input             Invalid Input

&#x20;        |                      |

&#x20;        v                      v

&#x20;Execute Endpoint        Return Validation Error

&#x20;        |                      |

&#x20;        v                      v

&#x20;Process Application     Structured Error Response

&#x20;        |

&#x20;        v

&#x20;Return Successful Response

```



FastAPI performs validation before executing the endpoint when parameters and request models are declared correctly.



## 7. Malformed Payloads and Error Serialization



When request data fails validation, FastAPI normally returns an HTTP `422 Unprocessable Entity` response for validation errors.



Example response for an invalid query parameter:



```json

{

&#x20; "detail": \[

&#x20;   {

&#x20;     "type": "greater\_than\_equal",

&#x20;     "loc": \["query", "page"],

&#x20;     "msg": "Input should be greater than or equal to 1",

&#x20;     "input": 0

&#x20;   }

&#x20; ]

}

```



The exact validation error fields and messages can vary according to the input and installed versions.



The response communicates:

\- The type of validation failure.

\- The location of the invalid input.

\- A description of the validation issue.

\- The received input value, where included by the framework.



Applications can define custom exception handlers when a consistent error format is required across endpoints.



## 8. Error Handling Requirements



The proposed endpoint should:



1\. Reject invalid identifiers and query parameters.

2\. Prevent endpoint processing when validation fails.

3\. Return a structured validation response.

4\. Avoid exposing secrets or internal implementation details.

5\. Use suitable HTTP status codes for validation, missing resources, and server errors.

6\. Document expected success and failure responses.



A valid identifier may still refer to a resource that does not exist. That situation should be handled separately from a type-validation error, commonly with an HTTP `404 Not Found` response.



## 9. Testing Scenarios



| Test case | Expected behavior |

|---|---|

| Positive integer identifier | Passes identifier validation |

| Non-numeric identifier | Validation error |

| `page=1` | Passes page validation |

| `page=0` | Validation error |

| `limit=20` | Passes limit validation |

| `limit=500` | Validation error |

| Unknown filter field in a model configured with `extra="forbid"` | Rejected by model validation |

| Valid request for a missing resource | Resource-not-found response |



These scenarios can be implemented as automated tests when the endpoint is developed.



## 10. Deliverables



This module's documentation deliverable includes:



\- Proposed schema definitions and parameter constraints.

\- Path and query parameter validation rules.

\- Pydantic model example.

\- Validation workflow diagram.

\- Malformed-payload and error-serialization behavior.

\- Error-handling requirements and test scenarios.



## 11. Technical Documentation Reference



Official FastAPI documentation:



https://fastapi.tiangolo.com/



Relevant topics include request parameters, Pydantic models, request validation, and error handling.



\---



\*\*Module status:\*\* FastAPI validation documentation prepared. Endpoint implementation, automated tests, and GitHub submission must be verified separately.


