const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const USERNAME = import.meta.env.VITE_ADMIN_USERNAME;
const PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD;

const AUTH_HEADER = "Basic " + btoa(`${USERNAME}:${PASSWORD}`);

export async function fetchJobs({ limit = 20, offset = 0, search = "" } = {}) {
  const params = new URLSearchParams({
    limit,
    offset,
  });

  if (search) {
    params.append("search", search);
  }

  const res = await fetch(`${API_BASE_URL}/jobs?${params.toString()}`, {
    headers: {
      Authorization: AUTH_HEADER,
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch jobs");
  }

  return res.json();
}
