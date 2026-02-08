import { useEffect, useState } from "react";
import { fetchJobs } from "../api/client";
import JobCard from "../components/JobCard";

const PAGE_SIZE = 20;

export default function Home() {
  const [jobs, setJobs] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);

  const [searchInput, setSearchInput] = useState("");
  const [activeSearch, setActiveSearch] = useState("");

  useEffect(() => {
    loadJobs(0, "");
  }, []);

  async function loadJobs(pageNumber, searchTerm = activeSearch) {
    setLoading(true);
    try {
      const offset = pageNumber * PAGE_SIZE;

      const data = await fetchJobs({
        limit: PAGE_SIZE,
        offset,
        search: searchTerm,
      });

      setJobs(data.jobs);
      setTotal(data.total);
      setPage(pageNumber);

      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const hasPrev = page > 0;
  const hasNext = (page + 1) * PAGE_SIZE < total;

  return (
    <div
      style={{
        maxWidth: "1200px",
        margin: "0 auto",
        padding: "20px 40px",
      }}
    >
      <h1
        style={{
          color: "#2563eb",
          fontSize: "32px",
          fontWeight: "700",
          marginBottom: "16px",
        }}
      >
        Job Aggregator
      </h1>
      <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="Search by title, company, or location..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              setActiveSearch(searchInput);
              loadJobs(0, searchInput);
            }
          }}
          style={{
            flex: 1,
            padding: "10px",
            fontSize: "16px",
          }}
        />

        <button
          onClick={() => {
            setActiveSearch(searchInput);
            loadJobs(0, searchInput);
          }}
          style={{
            padding: "10px 16px",
            backgroundColor: "#2563eb",
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            fontSize: "16px",
          }}
        >
          Search
        </button>
      </div>
      {loading && <p>Loading jobs...</p>}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
          gap: "16px",
        }}
      >
        {jobs.map((job) => (
          <JobCard key={job.job_id} job={job} />
        ))}
      </div>
      <div
        style={{
          marginTop: "24px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "10px",
          flexWrap: "wrap",
        }}
      >
        <div style={{ display: "flex", gap: "10px" }}>
          <button
            disabled={!hasPrev || loading}
            onClick={() => loadJobs(page - 1)}
            style={pageBtnStyle}
          >
            Previous
          </button>

          <button
            disabled={!hasNext || loading}
            onClick={() => loadJobs(page + 1)}
            style={pageBtnStyle}
          >
            Next
          </button>
        </div>

        <div style={{ fontSize: "14px", color: "#555" }}>
          Showing {page * PAGE_SIZE + 1}–
          {Math.min((page + 1) * PAGE_SIZE, total)} of {total} jobs
        </div>
      </div>
      {activeSearch && (
        <button
          onClick={() => {
            setSearchInput("");
            setActiveSearch("");
            loadJobs(0, "");
          }}
          style={{
            marginTop: "12px",
            background: "transparent",
            border: "none",
            color: "#2563eb",
            cursor: "pointer",
          }}
        >
          Clear search
        </button>
      )}
    </div>
  );
}

const pageBtnStyle = {
  padding: "8px 16px",
  borderRadius: "6px",
  border: "1px solid #2563eb",
  backgroundColor: "#2563eb",
  color: "white",
  cursor: "pointer",
  fontSize: "14px",
};
