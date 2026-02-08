from typing import List
from pydantic import BaseModel

class Job(BaseModel):
    job_id: str
    company: str
    title: str
    location: str | None = None
    apply_url: str
    posted_at: str | None = None
    updated_at: str | None = None
    source: str | None = None


class PaginatedJobs(BaseModel):
    total: int
    limit: int
    offset: int
    jobs: List[Job]
