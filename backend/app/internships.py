
from typing import List

from fastapi import APIRouter
from pydantic import BaseModel, Field

router = APIRouter(
    prefix="/internships",
    tags=["Internship Matchmaker"],
)

INTERNSHIPS = [
    {
        "id": 1,
        "title": "Data Science Intern",
        "company": "Insight Labs",
        "location": "Pune",
        "domain": "Data Science",
        "skills": ["python", "pandas", "machine learning"],
    },
    {
        "id": 2,
        "title": "Python Developer Intern",
        "company": "CodeNest",
        "location": "Bengaluru",
        "domain": "Software Development",
        "skills": ["python", "sql", "git"],
    },
    {
        "id": 3,
        "title": "Machine Learning Intern",
        "company": "FutureAI",
        "location": "Hyderabad",
        "domain": "Artificial Intelligence",
        "skills": ["python", "machine learning", "numpy"],
    },
    {
        "id": 4,
        "title": "Data Analyst Intern",
        "company": "DataBridge",
        "location": "Pune",
        "domain": "Data Analytics",
        "skills": ["python", "sql", "excel", "pandas"],
    },
    {
        "id": 5,
        "title": "AI Research Intern",
        "company": "NeuralWorks",
        "location": "Remote",
        "domain": "Artificial Intelligence",
        "skills": ["python", "machine learning", "deep learning"],
    },
]


class InternshipRequest(BaseModel):
    skills: List[str] = Field(min_length=1)
    preferred_domain: str = "Any"
    preferred_location: str = "Any"


@router.get("/")
def list_internships():
    return {
        "count": len(INTERNSHIPS),
        "notice": "Sample opportunities only; vacancies are not verified.",
        "internships": INTERNSHIPS,
    }


@router.post("/match")
def match_internships(request: InternshipRequest):
    student_skills = {
        skill.strip().lower()
        for skill in request.skills
        if skill.strip()
    }

    results = []

    for internship in INTERNSHIPS:
        required = set(internship["skills"])
        matched = sorted(student_skills & required)
        missing = sorted(required - student_skills)

        skill_score = len(matched) / len(required) * 70

        domain = request.preferred_domain.strip().lower()
        location = request.preferred_location.strip().lower()

        domain_match = (
            not domain
            or domain == "any"
            or domain in internship["domain"].lower()
        )

        location_match = (
            not location
            or location == "any"
            or location in internship["location"].lower()
        )

        score = round(
            skill_score
            + (15 if domain_match else 0)
            + (15 if location_match else 0)
        )

        results.append({
            **internship,
            "match_score": min(score, 100),
            "matched_skills": matched,
            "skill_gaps": missing,
            "explanation": (
                f"You match {len(matched)} of {len(required)} listed skills."
            ),
        })

    results.sort(
        key=lambda item: item["match_score"],
        reverse=True,
    )

    return {
        "count": len(results),
        "notice": "These are demonstration records, not verified vacancies.",
        "matches": results,
    }
