import os

def get_env(name: str, required: bool = True, default=None):
    value = os.getenv(name, default)
    if required and not value:
        raise RuntimeError(f"Missing required env var: {name}")
    return value
