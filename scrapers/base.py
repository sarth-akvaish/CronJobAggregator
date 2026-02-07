from abc import ABC, abstractmethod

class JobScraper(ABC):
    @abstractmethod
    def fetch_jobs(self) -> list[dict]:
        pass
