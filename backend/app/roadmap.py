
from fastapi import APIRouter
from pydantic import BaseModel, Field
from typing import List

router = APIRouter(
    prefix="/roadmap",
    tags=["Personalized Skill Roadmap"],
)


class RoadmapRequest(BaseModel):
    skills: List[str] = Field(min_length=1)
    target_role: str = "Data Science Intern"


SKILL_PLANS = {
    "python": {
        "duration": "Week 1",
        "task": "Practice Python functions, lists, dictionaries, and file handling.",
        "project": "Build a simple command-line application.",
    },
    "pandas": {
        "duration": "Week 2",
        "task": "Learn DataFrames, filtering, grouping, and missing-value handling.",
        "project": "Analyze a CSV dataset using Pandas.",
    },
    "sql": {
        "duration": "Week 3",
        "task": "Practice SELECT, WHERE, JOIN, GROUP BY, and aggregate functions.",
        "project": "Write queries for a sample student database.",
    },
    "machine learning": {
        "duration": "Week 4",
        "task": "Study supervised learning, train/test splits, and model evaluation.",
        "project": "Train a basic prediction model using scikit-learn.",
    },
    "numpy": {
        "duration": "Week 5",
        "task": "Practice arrays, indexing, vectorized operations, and statistics.",
        "project": "Perform numerical analysis on a sample dataset.",
    },
    "excel": {
        "duration": "Week 3",
        "task": "Practice formulas, sorting, filtering, and pivot tables.",
        "project": "Create a small data-analysis report.",
    },
    "git": {
        "duration": "Week 1",
        "task": "Learn Git commits, branches, and pushing code to GitHub.",
        "project": "Publish a small Python project on GitHub.",
    },
    "deep learning": {
        "duration": "Week 6",
        "task": "Learn neural-network fundamentals and basic model training.",
        "project": "Build a small introductory neural-network experiment.",
    },
}


@router.post("/")
def create_roadmap(request: RoadmapRequest):
    student_skills = {
        skill.strip().lower()
        for skill in request.skills
        if skill.strip()
    }

    roadmap = []

    for skill, plan in SKILL_PLANS.items():
        if skill not in student_skills:
            roadmap.append({
                "skill": skill.title(),
                **plan,
                "status": "Not started",
            })

    roadmap.sort(key=lambda item: item["duration"])

    for index, item in enumerate(roadmap, start=1):
        item["step"] = index

    return {
        "target_role": request.target_role,
        "known_skills": sorted(student_skills),
        "total_steps": len(roadmap),
        "roadmap": roadmap,
        "notice": (
            "This is a starter learning plan. "
            "Tasks and durations can be personalized further."
        ),
    }
