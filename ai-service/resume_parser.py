import fitz
import pandas as pd

skills_df = pd.read_csv("data/skills.csv")

COMMON_SKILLS = (
    skills_df["skill"]
    .dropna()
    .str.lower()
    .tolist()
)


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