import os
from fastapi import FastAPI, Depends, Query
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Optional
from api.db import jobs_collection
from api.schemas import PaginatedJobs
from api.auth import authenticate

app = FastAPI(title="Job Aggregator API")

allowed_origins_env = os.getenv("ALLOWED_ORIGINS", "")
allowed_origins = [o.strip() for o in allowed_origins_env.split(",") if o.strip()]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
def health():
    return {"status": "ok"}

@app.get("/companies", response_model=List[str], dependencies=[Depends(authenticate)])
def get_companies():
    companies = jobs_collection.distinct("company")
    return sorted(companies)

@app.get("/jobs", response_model=PaginatedJobs, dependencies=[Depends(authenticate)])
def get_jobs(
    company: Optional[str] = None,
    search : Optional[str] = None,
    limit: int = Query(20, le=100),
    offset: int = 0,
):
    query = {}

    if search:
        query["$or"] = [
            {"title": {"$regex": search, "$options": "i"}},
            {"company": {"$regex": search, "$options": "i"}},
            {"location": {"$regex": search, "$options": "i"}},
        ]

    total = jobs_collection.count_documents(query)

    cursor = (
        jobs_collection
        .find(query, {"_id": 0})
        .sort([
            ("job_id", 1)
        ])
        .skip(offset)
        .limit(limit)
        )

    return {
        "total": total,
        "limit": limit,
        "offset": offset,
        "jobs": list(cursor),
    }
