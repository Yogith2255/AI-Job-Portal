from pydantic import BaseModel


class ChatRequest(BaseModel):
    question: str
    resume_skills: list[str]
    jobs_context: str


class CoachingRequest(BaseModel):
    resume_text: str
    resume_skills: str
    jobs_context: str


from fastapi import FastAPI, UploadFile, File, Form

from chatbot import get_chat_response, get_resume_coaching_feedback
from job_matcher import calculate_match_score
from resume_parser import (
    extract_text_from_pdf,
    extract_skills,
    parse_resume_with_gemini
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

    gemini_data = parse_resume_with_gemini(text)
    
    if gemini_data:
        skills = gemini_data.get("skills", [])
        summary = gemini_data.get("summary", "")
        experience_summary = gemini_data.get("experience_summary", "")
        education = gemini_data.get("education", [])
    else:
        skills = extract_skills(text)
        summary = ""
        experience_summary = ""
        education = []

    return {
        "skills": skills,
        "total_skills": len(skills),
        "summary": summary,
        "experience_summary": experience_summary,
        "education": education,
        "text": text
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


@app.post("/resume-coaching")
async def resume_coaching(
    request: CoachingRequest
):
    import json
    feedback_str = get_resume_coaching_feedback(
        request.resume_text,
        request.resume_skills,
        request.jobs_context
    )
    try:
        feedback = json.loads(feedback_str)
        return feedback
    except Exception as e:
        print("Coaching response JSON parse error:", e)
        return {
            "ats_score": 75,
            "strengths": ["Strong core skills list", "Professional formatting"],
            "improvements": ["Formatting tips could not be processed dynamically. Ensure clear typography."],
            "missing_skills_for_jobs": [],
            "roadmap_tips": ["Add projects matching selected job roles."],
            "raw_response": feedback_str
        }