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

    response = model.generate_content(
        prompt
    )

    return response.text