from fastapi import FastAPI, Depends, Query
from typing import List, Optional
from api.db import jobs_collection
from api.schemas import Job
from api.auth import authenticate

app = FastAPI(title="Job Aggregator API")

@app.get("/health")
def health():
    return {"status": "ok"}

@app.get("/companies", response_model=List[str], dependencies=[Depends(authenticate)])
def get_companies():
    companies = jobs_collection.distinct("company")
    return sorted(companies)

@app.get("/jobs", response_model=List[Job], dependencies=[Depends(authenticate)])
def get_jobs(
    company: Optional[str] = None,
    limit: int = Query(20, le=100),
    offset: int = 0,
):
    query = {}
    if company:
        query["company"] = company

    cursor = (
        jobs_collection
        .find(query, {"_id": 0})
        .skip(offset)
        .limit(limit)
        .sort("updated_at", -1)
    )

    return list(cursor)
