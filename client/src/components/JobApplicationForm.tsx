import { useState } from "react";
import { api } from "../api/axios";
import styles from "./JobApplicationForm.module.css";

type JobApplicationFormProps = {
  onSuccess: () => void;
  onClose: () => void;
  initialData?: {
    companyName: string;
    jobUrl: string;
    applicationDate: string;
    status: "applied" | "rejected" | "accepted" | "pending";
  };
};

export default function JobApplicationForm({
  onSuccess,
  onClose,
  initialData,
}: JobApplicationFormProps) {
  const [companyName, setCompanyName] = useState(
    initialData?.companyName || "",
  );
  const [jobUrl, setJobUrl] = useState(initialData?.jobUrl || "");
  const [applicationDate, setApplicationDate] = useState(
    initialData?.applicationDate || new Date().toISOString().split("T")[0],
  );
  const [status, setStatus] = useState<
    "applied" | "rejected" | "accepted" | "pending"
  >(initialData?.status || "applied");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await api.post("/jobs", {
        companyName,
        jobUrl,
        applicationDate: new Date(applicationDate).toISOString(),
        status,
      });
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to create application");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <form className={styles.form} onClick={(e) => e.stopPropagation()} onSubmit={handleSubmit}>
        <div className={styles.header}>
          <h2>New Job Application</h2>
          <button
            type="button"
            className={styles.closeBtn}
            onClick={onClose}
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <div className={styles.field}>
          <label>Company Name</label>
          <input
            placeholder="Google, Microsoft, etc."
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            required
          />
        </div>

        <div className={styles.field}>
          <label>Job Posting URL</label>
          <input
            type="url"
            placeholder="https://jobs.example.com/..."
            value={jobUrl}
            onChange={(e) => setJobUrl(e.target.value)}
            required
          />
        </div>

        <div className={styles.field}>
          <label>Application Date</label>
          <input
            type="date"
            value={applicationDate}
            onChange={(e) => setApplicationDate(e.target.value)}
            required
          />
        </div>

        <div className={styles.field}>
          <label>Status</label>
          <select value={status} onChange={(e) => setStatus(e.target.value as any)}>
            <option value="applied">Applied</option>
            <option value="pending">Pending</option>
            <option value="accepted">Accepted</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>

        {error && <div className={styles.error}>{error}</div>}

        <div className={styles.actions}>
          <button type="button" className={styles.cancelBtn} onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className={styles.submitBtn} disabled={loading}>
            {loading ? "Creating..." : "Create Application"}
          </button>
        </div>
      </form>
    </div>
  );
}
