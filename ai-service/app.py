from pydantic import BaseModel


class ChatRequest(BaseModel):
    question: str
    resume_skills: list[str]
    jobs_context: str

from fastapi import FastAPI, UploadFile, File, Form

from chatbot import get_chat_response
from job_matcher import calculate_match_score
from resume_parser import (
    extract_text_from_pdf,
    extract_skills
)

from resume_parser import (
    extract_text_from_pdf,
    extract_skills,
)

app = FastAPI()


@app.get("/")
def home():
    return {
        "message":
        "Resume Parser API Running"
    }


@app.post("/parse-resume")
async def parse_resume(
    resume: UploadFile = File(...)
):
    text = extract_text_from_pdf(
        resume.file
    )

    skills = extract_skills(text)

    return {
        "skills": skills,
        "total_skills": len(skills)
    }
@app.post("/match-job")
async def match_job(
    resume: UploadFile = File(...),
    job_skills: str = Form(...)
):
    # Extract text from PDF
    text = extract_text_from_pdf(resume.file)

    # Extract skills from text
    extracted_skills = extract_skills(text)

    required_skills = [
        skill.strip().lower()
        for skill in job_skills.split(",")
    ]

    matched = list(
        set(extracted_skills) &
        set(required_skills)
    )

    missing = list(
        set(required_skills) -
        set(extracted_skills)
    )

    score = 0

    if len(required_skills) > 0:
        score = round(
            len(matched) /
            len(required_skills) * 100
        )

    return {
        "match_score": score,
        "matched_skills": matched,
        "missing_skills": missing,
        "resume_skills": extracted_skills
    }
@app.post("/career-chat")
async def career_chat(
    request: ChatRequest
):
    answer = get_chat_response(
        request.question,
        request.resume_skills,
        request.jobs_context
    )

    return {
        "answer": answer
    }