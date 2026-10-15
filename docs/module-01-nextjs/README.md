# Module 2.1: Next.js Frontend Architecture



## 1. Objective



Design a Next.js frontend architecture for a multi-page dashboard by identifying the boundary between Server Components and Client Components. Determine which parts of the application are suitable for static pre-rendering and which require client-side interactivity.



## 2. Existing Project Structure



The current JourneyBuddy-AI frontend uses Next.js App Router.



```text

JourneyBuddy-AI/

â””â”€â”€ frontend/

&#x20;   â”œâ”€â”€ app/

&#x20;   â”‚   â”œâ”€â”€ page.tsx

&#x20;   â”‚   â”œâ”€â”€ layout.tsx

&#x20;   â”‚   â”œâ”€â”€ globals.css

&#x20;   â”‚   â””â”€â”€ favicon.ico

&#x20;   â”œâ”€â”€ public/

&#x20;   â”œâ”€â”€ package.json

&#x20;   â””â”€â”€ README.md

```



### Existing files



\- `app/page.tsx`: Main dashboard page containing the current user interface and interactive functionality.

\- `app/layout.tsx`: Root layout shared by application pages.

\- `app/globals.css`: Global styles used throughout the frontend.

\- `public/`: Directory for static assets.

\- `package.json`: Contains project dependencies and development scripts.



This documentation describes the current structure and proposes how it can be extended for a multi-page dashboard. The proposed files are architectural suggestions, not files already implemented.



## 3. Proposed Multi-Page Architecture



```text

frontend/

â”œâ”€â”€ app/

â”‚   â”œâ”€â”€ layout.tsx

â”‚   â”œâ”€â”€ page.tsx

â”‚   â”œâ”€â”€ internships/

â”‚   â”‚   â””â”€â”€ page.tsx

â”‚   â”œâ”€â”€ roadmap/

â”‚   â”‚   â””â”€â”€ page.tsx

â”‚   â”œâ”€â”€ components/

â”‚   â”‚   â”œâ”€â”€ DashboardHeader.tsx

â”‚   â”‚   â”œâ”€â”€ InternshipSearchForm.tsx

â”‚   â”‚   â”œâ”€â”€ InternshipResults.tsx

â”‚   â”‚   â””â”€â”€ RoadmapPanel.tsx

â”‚   â”œâ”€â”€ lib/

â”‚   â”‚   â””â”€â”€ api.ts

â”‚   â”œâ”€â”€ globals.css

â”‚   â””â”€â”€ favicon.ico

â”œâ”€â”€ public/

â”œâ”€â”€ package.json

â””â”€â”€ README.md

```



### Architectural responsibilities



\- `app/page.tsx`: Main landing page and dashboard overview.

\- `app/internships/page.tsx`: Internship search and matching page.

\- `app/roadmap/page.tsx`: Roadmap display page.

\- `app/components/`: Reusable user-interface components.

\- `app/lib/api.ts`: Shared helper functions for communicating with the backend.

\- `app/layout.tsx`: Common layout, navigation, and page structure.



The structure can be adapted as the project grows.



## 4. Server Components and Client Components



Next.js App Router uses Server Components by default. Client Components are required when a component needs client-side state, event handlers, effects, or browser APIs.



### 4.1 Server Components



Server Components are suitable for:



\- Static page content and informational sections.

\- Dashboard headings and descriptive content.

\- Shared page layouts and navigation that do not require client-side state.

\- Fetching data on the server when appropriate.

\- Rendering content that does not require direct user interaction.



Server Components can reduce the amount of JavaScript sent to the browser.



### 4.2 Client Components



Client Components are suitable for:



\- Internship search bars and interactive forms.

\- Filter controls and dropdown selections.

\- Buttons that trigger actions.

\- Loading indicators and interactive status cards.

\- Components that update the interface in response to user input.

\- State management and event handlers.



The `"use client"` directive should be placed at the top of a component file when that component needs client-side functionality.



It is preferable to keep the Client Component boundary as small as practical instead of making the entire application interactive unnecessarily.



## 5. Static Pre-Rendering and Dynamic Interaction



| Dashboard component | Recommended approach | Reason |

|---|---|---|

| Landing page information | Static pre-rendering when suitable | Content changes infrequently |

| Shared layout | Server Component by default | Common structure does not inherently require client state |

| Internship search bar | Client Component | Accepts and processes user input |

| Search filters | Client Component | Updates selections interactively |

| Internship results | Depends on data flow | Results may update after a search |

| Live status cards | Client Component for live updates | May need state, polling, or other client-side updates |

| Roadmap display | Server or Client Component | Depends on whether it is static or interactive |



Static pre-rendering is appropriate for content that can be prepared ahead of a request. Data that changes frequently or depends on a user's actions may require dynamic fetching or client-side updates.



A page can combine Server Components and Client Components rather than choosing only one rendering approach for the entire page.



## 6. Client-Server Boundary



The proposed interaction flow is:



```text

User opens JourneyBuddy-AI

&#x20;           |

&#x20;           v

Next.js page and shared layout

&#x20;           |

&#x20;           v

Server-rendered page content

&#x20;           |

&#x20;           v

Interactive Client Components

&#x20;           |

&#x20;           v

User enters internship search criteria

&#x20;           |

&#x20;           v

Frontend sends request to backend API

&#x20;           |

&#x20;           v

Backend processes the request

&#x20;           |

&#x20;           v

Frontend displays matching results

```



The frontend is responsible for collecting user input and displaying results. The backend is responsible for processing requests and providing the corresponding data.



## 7. Architecture Decisions



1\. Use the Next.js App Router for page organization.

2\. Keep shared layouts and non-interactive content as Server Components by default.

3\. Use Client Components for interactive search, filters, buttons, and live status updates.

4\. Separate reusable components from page-level components.

5\. Keep backend API communication in shared helper functions where practical.

6\. Avoid adding `"use client"` to components that do not need client-side functionality.

7\. Choose static or dynamic rendering according to the content and data requirements.



## 8. Validation and Testing



The proposed architecture can be evaluated by checking that:



\- Each route has a clear responsibility.

\- Reusable components are organized separately from pages.

\- Interactive controls respond to user input.

\- Search results display the backend response correctly.

\- Static content renders without requiring unnecessary client-side JavaScript.

\- Client-only functionality is placed within appropriate Client Components.

\- Existing dashboard functionality remains intact after architectural changes.



## 9. Deliverables



This module's documentation deliverable includes:



\- The existing frontend directory structure.

\- A proposed multi-page directory structure.

\- An explanation of Server Components and Client Components.

\- A classification of static and interactive dashboard components.

\- A description of the client-server boundary and request flow.

\- Architecture decisions and validation criteria.



## 10. Technical Documentation Reference



Official Next.js documentation:



https://nextjs.org/docs



Relevant topic: Next.js App Router, Server and Client Components, and rendering strategies.



\---



\*\*Module status:\*\* Architecture documentation prepared for Module 2.1. Implementation and GitHub submission should be verified separately.


