import fitz
import pandas as pd
import os
import json
import google.generativeai as genai

skills_df = pd.read_csv("data/skills.csv")

COMMON_SKILLS = (
    skills_df["skill"]
    .dropna()
    .str.lower()
    .tolist()
)

# Configure genai if GEMINI_API_KEY is present
api_key = os.getenv("GEMINI_API_KEY")
if api_key:
    genai.configure(api_key=api_key)

def extract_text_from_pdf(pdf_file):
    text = ""

    pdf = fitz.open(
        stream=pdf_file.read(),
        filetype="pdf"
    )

    for page in pdf:
        text += page.get_text()

    return text


def extract_skills(text):
    text = text.lower()

    found_skills = []

    for skill in COMMON_SKILLS:
        if skill in text:
            found_skills.append(skill)

    return list(set(found_skills))


def parse_resume_with_gemini(text):
    """
    Parses resume text using Gemini to extract technical and soft skills, summary, education, and experience.
    """
    if not os.getenv("GEMINI_API_KEY"):
        return None
        
    try:
        model = genai.GenerativeModel("gemini-2.5-flash")
        prompt = f"""
You are an expert ATS (Applicant Tracking System) parser. Analyze the resume text below and extract:
1. Technical and professional skills (e.g. programming languages, frameworks, methodologies, tools, domain expertise). Keep names short and standardized (e.g. 'react', 'python', 'git').
2. Professional summary.
3. Experience summary (brief description of professional history).
4. Education details.

Return ONLY a valid JSON object matching this structure (no markdown formatting, no code block tick marks):
{{
    "skills": ["skill1", "skill2", ...],
    "summary": "professional summary text",
    "experience_summary": "experience summary text",
    "education": ["education detail 1", ...]
}}

Resume Text:
{text}
"""
        response = model.generate_content(prompt)
        content = response.text.strip()
        if content.startswith("```json"):
            content = content[7:]
        if content.endswith("```"):
            content = content[:-3]
        content = content.strip()
        
        parsed = json.loads(content)
        if "skills" in parsed and isinstance(parsed["skills"], list):
            parsed["skills"] = [s.strip().lower() for s in parsed["skills"]]
        return parsed
    except Exception as e:
        print(f"Gemini resume parsing error: {e}")
        return None