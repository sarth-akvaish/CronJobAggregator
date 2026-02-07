import os
import yaml
from pymongo import MongoClient
from scrapers.greenhouse import GreenhouseScraper
from jobs.normalize import normalize_greenhouse_job

MONGO_URI = os.getenv("MONGO_URI")

def main():
    if not MONGO_URI:
        raise RuntimeError("MONGO_URI not set")

    client = MongoClient(MONGO_URI)
    db = client.jobs_db
    collection = db.jobs

    with open("config/names.yaml") as f:
        companies = yaml.safe_load(f)["greenhouse"]

    total = 0

    for company in companies:
        scraper = GreenhouseScraper(company)
        raw_jobs = scraper.fetch_jobs()

        for raw in raw_jobs:
            job = normalize_greenhouse_job(raw)
            collection.update_one(
                {"job_id": job["job_id"]},
                {"$set": job},
                upsert=True
            )
            total += 1

    print(f"Upserted {total} jobs")

if __name__ == "__main__":
    main()
