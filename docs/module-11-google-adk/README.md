# Module 2.11: Google ADK — Mobile Client-Server Architecture



## 1. Objective



The objective of this module is to design a conceptual mobile client-server architecture that explains how a mobile application captures user interface (UI) events, sends asynchronous network requests, updates application state, and re-renders the view.



This document follows the Google ADK task description provided in the internship assignment. It describes the proposed architecture and workflow; it does not claim that a working mobile application has been implemented.



## 2. Scope



The design covers:



\- Capturing user interactions such as button clicks and form submissions.

\- Validating user input before sending a request.

\- Dispatching asynchronous network requests to a backend service.

\- Managing loading, success, empty, and error states.

\- Updating application state when a response arrives.

\- Re-rendering the UI to reflect the latest state.

\- Handling network failures and preventing duplicate requests.



## 3. High-Level Architecture



The proposed application contains the following components:



1\. \*\*Mobile UI:\*\* Displays screens, input fields, buttons, and response content.

2\. \*\*Event Handler:\*\* Receives UI events and validates user actions.

3\. \*\*State Manager:\*\* Maintains loading status, user input, response data, and error messages.

4\. \*\*Network Client:\*\* Sends asynchronous HTTP requests to the backend API.

5\. \*\*Backend API:\*\* Processes requests and returns structured responses.

6\. \*\*Response Handler:\*\* Interprets the response and updates application state.

7\. \*\*View Renderer:\*\* Refreshes the visible interface based on the updated state.



## 4. Client-Server Lifecycle



The request lifecycle follows these steps:



1\. The user interacts with the mobile interface.

2\. The event handler captures the action.

3\. The application validates the input.

4\. The state manager changes the state to loading.

5\. The network client sends an asynchronous request to the backend.

6\. The backend processes the request and returns a response.

7\. The response handler checks the result.

8\. The state manager stores the response or an error.

9\. The view renderer updates the interface.

10\. The user sees the updated content or an appropriate error message.



Asynchronous network calls allow the interface to remain responsive while waiting for the backend.



## 5. Architecture Diagram



```mermaid

flowchart TD

&#x20;   A\[User Interaction] --> B\[UI Event Handler]

&#x20;   B --> C{Input Valid?}

&#x20;   C -- No --> D\[Show Validation Error]

&#x20;   C -- Yes --> E\[Update State: Loading]

&#x20;   E --> F\[Async Network Request]

&#x20;   F --> G\[Backend API]

&#x20;   G --> H\[API Response]

&#x20;   H --> I{Request Successful?}

&#x20;   I -- Yes --> J\[Update State with Data]

&#x20;   I -- No --> K\[Update State with Error]

&#x20;   J --> L\[Re-render View]

&#x20;   K --> L

&#x20;   L --> M\[Display Updated UI]

```



## 6. Application State Management



The application should represent its current state explicitly.



| State | Description | UI Behaviour |

|---|---|---|

| Idle | No request is in progress | Display the initial screen |

| Loading | A request is being processed | Display a loading indicator |

| Success | The request completed successfully | Display the returned data |

| Empty | The request succeeded but returned no results | Display an empty-state message |

| Error | The request failed | Display an error and retry option |



State transitions should be predictable. A successful response must not be displayed as an error, and a failed request must not leave the application stuck in the loading state.



## 7. Asynchronous Network Dispatch



The network client is responsible for communicating with the backend.



The proposed request flow is:



\- Construct the request using validated input.

\- Attach required authentication credentials when applicable.

\- Send the request asynchronously.

\- Wait for the response without blocking the UI.

\- Check the HTTP status and response format.

\- Pass successful data to the state manager.

\- Convert failures into useful error states.



Requests should have appropriate timeouts. The application should also handle unavailable servers, connection interruptions, and malformed responses.



## 8. UI Re-rendering



The view should reflect changes to the application state.



Examples include:



\- When a request begins, display a loading indicator.

\- When a response arrives, display the returned information.

\- When no data is available, display a suitable empty-state message.

\- When a request fails, display a readable error and allow retrying.



The application should avoid unnecessary re-renders and should not update a screen using stale results from an older request.



## 9. Error Handling and Reliability



The proposed design considers the following situations:



\- \*\*Invalid input:\*\* Display validation feedback before making a request.

\- \*\*Network unavailable:\*\* Show a connection error and provide a retry option.

\- \*\*Request timeout:\*\* Stop waiting after the configured timeout and update the UI.

\- \*\*Server error:\*\* Display a general message without exposing internal server details.

\- \*\*Unauthorized request:\*\* Ask the user to authenticate again when appropriate.

\- \*\*Repeated submission:\*\* Disable the submit action while an identical request is in progress.

\- \*\*Screen closed during a request:\*\* Avoid applying obsolete results to a no-longer-active screen.

\- \*\*Empty response:\*\* Display a clear message rather than a blank interface.



## 10. Security Considerations



\- Use HTTPS for communication with backend services.

\- Do not store passwords or sensitive credentials in plain text.

\- Keep secret API keys out of the mobile application.

\- Validate input on both the client and server.

\- Use backend authentication and authorization for protected resources.

\- Avoid logging access tokens, passwords, or private user data.

\- Apply appropriate request timeouts and error handling.



## 11. Testing Plan



The proposed architecture should be evaluated using these scenarios:



1\. A valid UI action sends the expected request.

2\. Invalid input is rejected before dispatch.

3\. The loading indicator appears while a request is pending.

4\. A successful response updates the UI correctly.

5\. An empty response produces the expected empty state.

6\. A network failure produces an understandable error.

7\. A timeout allows the user to retry.

8\. Repeated button clicks do not create unintended duplicate requests.

9\. Authentication failures are handled appropriately.

10\. The interface remains responsive during network operations.



## 12. Deliverables



The conceptual deliverables for this module are:



\- This README describing the mobile client-server architecture.

\- A client-server lifecycle and state-transition diagram.

\- A description of asynchronous network dispatch.

\- A definition of loading, success, empty, and error states.

\- A security and reliability checklist.

\- A testing plan for validating the proposed workflow.



## 13. Conclusion



This module defines a conceptual architecture for a responsive mobile application. By separating UI event handling, network communication, state management, and view rendering, the design makes the application easier to understand, test, and maintain.



The architecture can later be adapted to the mobile development framework specified by the project.



## 14. Technical Documentation



\- Google ADK reference supplied in the assignment: https://adk.dev/







