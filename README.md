# JourneyBuddy AI 

**JourneyBuddy Ai** is a student-focused web application designed to help students explore internship opportunities and organize their career preparation through learning roadmaps.

## Project Overview

The goal of JourneyBuddy AI is to provide students with a centralized platform for career exploration, internship discovery, and learning guidance.

##  Features

- **Dashboard:** A central page for navigating the platform.
- **Internships:** An interface for exploring internship information.
- **Career Roadmap:** A structured view of learning and career preparation steps.
- **Responsive UI:** A clean interface using a cream, forest-green, and gold theme.
- **Backend API:** A Python FastAPI backend for application functionality.

> Note: Internship records are currently sample/demo data and should not be treated as verified live vacancies.

##  Technology Stack

| Technology | Purpose |
|---|---|
| Next.js | Frontend framework |
| React | UI development |
| TypeScript | Type-safe frontend code |
| Python | Backend programming |
| FastAPI | Backend API framework |
| Uvicorn | Runs the FastAPI application |
| Git & GitHub | Version control and source code hosting |

##  Project Structure

text
JourneyBuddy-AI/
├── frontend/
│   ├── app/
│   │   ├── page.tsx
│   │   ├── internships/
│   │   │   └── page.tsx
│   │   └── roadmap/
│   │       └── page.tsx
│   └── package.json
├── backend/
│   └── app/
│       └── main.py
└── README.md


*This is a simplified overview; your actual repository may contain additional files.*

##  Prerequisites

Install the following before running the project:

- [Node.js](https://nodejs.org/)
- Python
- Git

## Installation and Setup

### 1. Clone the repository

bash
git clone https://github.com/nnm24is084-collab/JourneyBuddy-AI.git
cd JourneyBuddy-AI


### 2. Start the backend

From the project root, activate your existing Python virtual environment if needed, then run:

bash
python -m uvicorn app.main:app --reload --app-dir backend


The backend should be available at:

- API: http://127.0.0.1:8000
- Interactive API documentation: http://127.0.0.1:8000/docs
- Health check: http://127.0.0.1:8000/health

### 3. Start the frontend

Open a second terminal:

```bash
cd frontend
npm install
npm run dev
```

Open http://localhost:3000 in your browser.

Keep the backend running while testing frontend functionality that depends on the API.

##  GitHub Repository

[JourneyBuddy AI — GitHub](https://github.com/nnm24is084-collab/JourneyBuddy-AI)

## Future Enhancements

- Integrate verified and regularly updated internship listings.
- Add user authentication and student profiles.
- Provide personalized career and skill-development roadmaps.
- Add AI-powered recommendations and relevant learning resources.
- Improve testing, error handling, and deployment configuration.
- Deploy the frontend and backend for public access.

## Project Status

JourneyBuddy AI is currently a development-stage prototype. The source code is hosted on GitHub; public deployment and additional integrations remain future work unless separately implemented and verified.

## Author

**Anushka Garthe**

GitHub: [nnm24is084-collab](https://github.com/nnm24is084-collab)

---

*Built to help students organize their career journey, one step at a time.*
