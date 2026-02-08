const USERNAME = import.meta.env.VITE_ADMIN_USERNAME;
const PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD;

const AUTH_HEADER = "Basic " + btoa(`${USERNAME}:${PASSWORD}`);

export async function fetchJobs() {
  const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/jobs`, {
    headers: {
      Authorization: AUTH_HEADER,
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch jobs");
  }

  return res.json();
}
