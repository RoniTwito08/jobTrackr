import { useState } from "react";
import { api } from "../api/axios";
import styles from "./JobChecker.module.css";

type JobApplication = {
  _id: string;
  companyName: string;
  jobUrl: string;
  applicationDate: string;
  status: "applied" | "rejected" | "accepted" | "pending";
};

type JobCheckerProps = {
  onApplicationFound: (app: JobApplication) => void;
  onNoApplication: () => void;
};

export default function JobChecker({
  onApplicationFound,
  onNoApplication,
}: JobCheckerProps) {
  const [jobUrl, setJobUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCheck = async () => {
    if (!jobUrl.trim()) {
      setError("Please enter a job URL");
      return;
    }

    setError(null);
    setLoading(true);

    try {
      const res = await api.get("/jobs");
      const allApplications: JobApplication[] = res.data;
      
      const foundApp = allApplications.find(
        (app) => app.jobUrl.toLowerCase().trim() === jobUrl.toLowerCase().trim()
      );

      if (foundApp) {
        onApplicationFound(foundApp);
      } else {
        onNoApplication();
      }
      setJobUrl("");
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to check application");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !loading) {
      e.preventDefault();
      handleCheck();
    }
  };

  return (
    <div className={styles.container}>
      <h3>Check if you already applied</h3>
      <p className={styles.subtitle}>Paste a job URL to check your applications</p>
      
      <div className={styles.inputGroup}>
        <input
          type="url"
          placeholder="https://jobs.example.com/..."
          value={jobUrl}
          onChange={(e) => setJobUrl(e.target.value)}
          onKeyPress={handleKeyPress}
          disabled={loading}
        />
        <button onClick={handleCheck} disabled={loading} className={styles.checkBtn}>
          {loading ? "Checking..." : "Check"}
        </button>
      </div>

      {error && <div className={styles.error}>{error}</div>}
    </div>
  );
}
