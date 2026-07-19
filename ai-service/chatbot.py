import os
import google.generativeai as genai

from dotenv import load_dotenv

load_dotenv()

genai.configure(
    api_key=os.getenv("GEMINI_API_KEY")
)

model = genai.GenerativeModel(
    "gemini-2.5-flash"
)


def get_chat_response(
    question,
    resume_skills,
    jobs_context
):
    prompt = f"""
You are an AI Career Assistant.

Use the following information.

RESUME SKILLS:
{resume_skills}

AVAILABLE JOBS:
{jobs_context}

User Question:
{question}

Instructions:
- Answer professionally.
- If user asks about jobs, use available jobs.
- If user asks about skills, use resume skills and jobs.
- Suggest improvements where needed.
- Keep answers concise and practical.
"""
    try:
        response = model.generate_content(
            prompt
        )

        return response.text
    except Exception as e:
        print(f"Gemini chatbot error: {e}")
        return "I'm sorry, I am currently experiencing high traffic or a temporary issue. Please try asking again in a moment."


def get_resume_coaching_feedback(
    resume_text,
    resume_skills,
    jobs_context
):
    prompt = f"""
You are an expert ATS (Applicant Tracking System) optimizer and professional Career Coach.
Analyze the candidate's resume details and provide a comprehensive feedback report.

RESUME TEXT:
{resume_text}

RESUME SKILLS:
{resume_skills}

PORTAL JOBS LIST:
{jobs_context}

Analyze the resume and return ONLY a valid JSON object matching this structure (do NOT wrap it in markdown code blocks, do not output any surrounding text, return raw JSON string):
{{
    "ats_score": 85,
    "strengths": [
        "Identified strength 1",
        "Identified strength 2"
    ],
    "improvements": [
        "Recommendation for improvement 1",
        "Recommendation for improvement 2"
    ],
    "missing_skills_for_jobs": [
        "Skill - Recommended to match specific job"
    ],
    "roadmap_tips": [
        "Actionable roadmap or learning tip 1",
        "Actionable roadmap or learning tip 2"
    ]
}}
"""

    response = model.generate_content(
        prompt
    )

    content = response.text.strip()
    if content.startswith("```json"):
        content = content[7:]
    if content.endswith("```"):
        content = content[:-3]
    content = content.strip()
    return content