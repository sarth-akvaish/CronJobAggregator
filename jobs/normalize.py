def normalize_greenhouse_job(raw: dict) -> dict:
    return {
        "job_id": f"greenhouse_{raw['id']}",
        "company": raw["company_name"],
        "title": raw["title"],
        "location": raw["location"]["name"],
        "apply_url": raw["absolute_url"],
        "source": "greenhouse",
        "posted_at": raw.get("first_published"),
        "updated_at": raw.get("updated_at"),
    }
