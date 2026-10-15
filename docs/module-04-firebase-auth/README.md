# Module 2.4: Firebase Authentication



## 1. Objective



Document a secure authentication lifecycle for JourneyBuddy-AI, from user credential submission to identity token issuance, backend token verification, and authorization of protected routes and resources.



This module focuses on the authentication architecture and its documentation requirements.



## 2. Overview



Firebase Authentication provides services for authenticating users. After a user signs in successfully, the application can obtain a Firebase ID token to establish the user's identity when communicating with a protected backend.



The backend must verify the token before trusting the authenticated identity. Authentication establishes who the user is, while authorization determines what the user is permitted to access.



## 3. Authentication Lifecycle



The proposed authentication sequence is:



1\. The user opens JourneyBuddy-AI and selects a sign-in or sign-up option.

2\. The frontend submits credentials through the configured Firebase Authentication client.

3\. Firebase Authentication validates the credentials.

4\. Following successful authentication, the client obtains a Firebase ID token.

5\. The client sends the token with a request to a protected backend endpoint.

6\. The backend verifies the token using the Firebase Admin SDK.

7\. The backend checks whether the authenticated user is authorized to access the requested resource.

8\. The backend processes the request and returns an appropriate response.



Invalid credentials, invalid tokens, expired tokens, and unauthorized resource access must be handled safely.



## 4. Authentication Sequence Diagram



```text

User

&#x20;|

&#x20;| Sign in / Sign up

&#x20;v

JourneyBuddy-AI Frontend

&#x20;|

&#x20;| Submit credentials

&#x20;v

Firebase Authentication

&#x20;|

&#x20;| Authentication succeeds

&#x20;v

Frontend receives ID token

&#x20;|

&#x20;| API request with Bearer token

&#x20;v

Backend Authentication Middleware

&#x20;|

&#x20;| Verify token

&#x20;v

Authorization Check

&#x20;|

&#x20;+---- Invalid token ----> 401 Unauthorized

&#x20;|

&#x20;+---- Insufficient permission ----> 403 Forbidden

&#x20;|

&#x20;+---- Authorized

&#x20;         |

&#x20;         v

&#x20;   Protected API Handler

&#x20;         |

&#x20;         v

&#x20;   Return API Response

```



The diagram represents the proposed workflow. Actual routes and middleware depend on the application's implementation.



## 5. Token Handling



### 5.1 ID Token Issuance



After successful authentication, Firebase Authentication provides an ID token that represents the authenticated user.



The frontend should obtain the token through the Firebase Authentication SDK rather than creating or modifying tokens itself.



### 5.2 Sending the Token



For protected API requests, the frontend can send the token using the HTTP `Authorization` header.



Example:



```http

Authorization: Bearer <FIREBASE\_ID\_TOKEN>

```



The placeholder represents the actual token supplied at runtime. Real tokens must never be committed to GitHub or included in public documentation.



### 5.3 Token Verification



The backend should verify the token using the Firebase Admin SDK.



Verification should establish that the token is valid and that the authenticated identity can be trusted. The backend must not rely only on a user ID or other identity value supplied directly by the client.



### 5.4 Token Expiration



Expired or invalid tokens should not grant access to protected resources. The frontend can obtain a fresh token through the supported Firebase Authentication SDK flow when appropriate.



## 6. Protected Backend Resources



JourneyBuddy-AI may have protected resources such as:



\- User-specific internship preferences.

\- Saved internship results.

\- Personalized career roadmaps.

\- User profile information.



These are examples of resources that could be protected. Their actual availability depends on the implemented backend.



Before returning protected information, the backend should:



1\. Verify the Firebase ID token.

2\. Identify the authenticated user.

3\. Check the user's permissions for the requested operation.

4\. Restrict access to data the user is allowed to view or modify.

5\. Return a suitable HTTP response.



## 7. Authentication and Authorization



| Situation | Expected behavior |

|---|---|

| Valid credentials | Authentication succeeds |

| Invalid credentials | Authentication fails safely |

| Valid ID token and sufficient permissions | Request may proceed |

| Missing, invalid, or expired ID token | Return HTTP 401 |

| Valid identity but insufficient permissions | Return HTTP 403 |

| Authenticated user requests a nonexistent resource | Return HTTP 404 where appropriate |



These status codes describe the proposed API behavior and should be implemented consistently.



## 8. Security Considerations



\- Use HTTPS for authentication and API communication in deployed environments.

\- Never store passwords or plaintext credentials in application logs.

\- Never commit real ID tokens, service-account private keys, or API secrets to GitHub.

\- Verify ID tokens on the backend using trusted Firebase server-side libraries.

\- Do not treat client-side route protection as a replacement for backend authorization.

\- Apply authorization checks to every protected operation.

\- Use appropriate token-storage practices and protect against cross-site scripting and cross-site request forgery according to the chosen authentication design.

\- Keep Firebase configuration and server credentials managed appropriately for the deployment environment.



## 9. Testing Scenarios



| Test case | Expected result |

|---|---|

| Successful sign-in | User receives authenticated application access |

| Incorrect credentials | Sign-in is rejected |

| Request without a token | Protected endpoint returns 401 |

| Request with an invalid token | Protected endpoint returns 401 |

| Request with an expired token | Protected endpoint returns 401 |

| Valid token with insufficient permissions | Protected endpoint returns 403 |

| Valid token with sufficient permissions | Request proceeds to authorization and resource processing |



These scenarios can be implemented as automated tests when authentication is integrated.



## 10. Deliverables



This module's documentation deliverable includes:



\- End-to-end authentication lifecycle.

\- Firebase ID token issuance and handling.

\- Backend token-verification workflow.

\- Protected-resource authorization design.

\- Authentication sequence diagram.

\- Security considerations and testing scenarios.



## 11. Technical Documentation Reference



Official Firebase Authentication documentation:



https://firebase.google.com/docs/auth



For backend token verification, refer to the Firebase Admin SDK documentation:



https://firebase.google.com/docs/auth/admin/verify-id-tokens



\---



\*\*Module status:\*\* Firebase authentication architecture documented. Integration, security testing, and GitHub submission must be verified separately.


