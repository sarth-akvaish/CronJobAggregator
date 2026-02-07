from pydantic import BaseModel
from typing import Optional

class Job(BaseModel):
    job_id: str
    company: str
    title: str
    location: str
    apply_url: str
    source: str
    posted_at: Optional[str]
    updated_at: Optional[str]
