def calculate_match_score(
    resume_skills,
    job_skills
):
    resume_set = set(
        skill.lower()
        for skill in resume_skills
    )

    job_set = set(
        skill.lower()
        for skill in job_skills
    )

    matched = list(
        resume_set.intersection(job_set)
    )

    missing = list(
        job_set - resume_set
    )

    score = 0

    if len(job_set) > 0:
        score = round(
            (len(matched) / len(job_set)) * 100,
            2
        )

    return {
        "match_score": score,
        "matched_skills": matched,
        "missing_skills": missing,
    }