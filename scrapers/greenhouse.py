import requests
from scrapers.base import JobScraper

class GreenhouseScraper(JobScraper):
    def __init__(self, company: str):
        self.company = company
        self.url = f"https://boards-api.greenhouse.io/v1/boards/{company}/jobs"

    def fetch_jobs(self) -> list[dict]:
        resp = requests.get(
            self.url,
            headers={"User-Agent": "JobAggregatorBot/1.0"},
            timeout=10,
        )
        resp.raise_for_status()
        return resp.json()["jobs"]
