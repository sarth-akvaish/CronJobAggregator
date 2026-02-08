import "./JobCard.css";

function formatDate(dateStr) {
  if (!dateStr) return "N/A";
  return new Date(dateStr).toLocaleDateString();
}

export default function JobCard({ job }) {
  return (
    <div className="job-card">
      <h3 className="job-title">{job.title}</h3>

      <div className="job-meta">
        <span><strong>Company:</strong> {job.company}</span>
        <span><strong>Location:</strong> {job.location || "Not specified"}</span>
      </div>

      <div className="job-dates">
        <span>Posted: {formatDate(job.posted_at)}</span>
        <span>Updated: {formatDate(job.updated_at)}</span>
      </div>

      <a
        href={job.apply_url}
        target="_blank"
        rel="noreferrer"
        className="apply-btn"
      >
        Apply
      </a>
    </div>
  );
}
