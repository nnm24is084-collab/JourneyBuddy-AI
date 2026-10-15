\# JourneyBuddy AI



\*\*Your Personal Learning and Career Copilot\*\*



JourneyBuddy AI is a student-focused career assistance project that helps users explore internship opportunities, match their skills with relevant roles, and generate personalized learning roadmaps.



\## Features



\- \*\*Internship Listing:\*\* View sample internship opportunities.

\- \*\*Internship Matching:\*\* Rank opportunities based on skills, preferred domain, and location.

\- \*\*Skill Gap Analysis:\*\* Identify skills that may need improvement for a target opportunity.

\- \*\*Personalized Learning Roadmaps:\*\* Generate step-by-step learning plans based on existing skills.

\- \*\*Roadmap Persistence:\*\* Save generated roadmaps in a local SQLite database.

\- \*\*REST API:\*\* Access backend functionality through FastAPI and interactive API documentation.



\## Technology Stack



\- Python

\- FastAPI

\- SQLite

\- Pydantic

\- Next.js frontend



\## Project Structure



```text

JourneyBuddy-AI/

├── backend/

│   └── app/

│       ├── main.py

│       ├── internships.py

│       ├── roadmap.py

│       ├── database.py

│       └── journeybuddy.db  # Generated locally

├── docs/

├── frontend/

├── .gitignore

└── README.md

```



\## Run the Backend Locally



1\. Clone or download this repository.

2\. Open a terminal in the project directory.

3\. Activate your Python virtual environment if you have one configured.

4\. Install the backend dependencies:



&#x20;  ```powershell

&#x20;  pip install -r backend/requirements.txt

&#x20;  ```



5\. Start the API:



&#x20;  ```powershell

&#x20;  python -m uvicorn app.main:app --reload --app-dir backend

&#x20;  ```



6\. Open the API documentation:



&#x20;  http://127.0.0.1:8000/docs



\## API Endpoints



| Method | Endpoint | Purpose |

|---|---|---|

| GET | `/` | Check the welcome endpoint |

| GET | `/health` | Check backend health |

| GET | `/internships/` | List sample internships |

| POST | `/internships/match` | Match internships to skills and preferences |

| POST | `/roadmap/` | Generate and save a learning roadmap |

| GET | `/roadmaps/saved` | Retrieve saved roadmaps |



\## Example Roadmap Request



```json

{

&#x20; "skills": \["Python", "Pandas"],

&#x20; "target\_role": "Data Science Intern"

}

```



\## Current Limitations



\- Internship listings are sample data; vacancies are not verified live.

\- Learning roadmaps are starter plans and may require further personalization.

\- Saved roadmaps use a local SQLite database.

\- Advanced integrations such as cloud databases, vector search, and AI-agent services are not yet documented as implemented.



\## Future Improvements



\- Connect a verified internship data source.

\- Add user authentication and individual profiles.

\- Integrate a cloud database and semantic search.

\- Improve AI-assisted career recommendations.

\- Deploy the frontend and backend.



\## License



No license has been specified yet.



