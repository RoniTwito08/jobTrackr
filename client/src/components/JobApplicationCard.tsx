import { useState } from "react";
import styles from "./JobApplicationCard.module.css";

type JobApplicationCardProps = {
  id: string;
  companyName: string;
  jobUrl: string;
  applicationDate: string;
  status: "applied" | "rejected" | "accepted" | "pending" | "interview";
  onDelete: (id: string) => void;
  onUpdateStatus?: (id: string, newStatus: "applied" | "rejected" | "accepted" | "pending" | "interview") => void;
};

export default function JobApplicationCard({
  id,
  companyName,
  jobUrl,
  applicationDate,
  status,
  onDelete,
  onUpdateStatus,
}: JobApplicationCardProps) {
  const [isEditingStatus, setIsEditingStatus] = useState(false);
  const [newStatus, setNewStatus] = useState(status);

  const statusColors: Record<string, string> = {
    applied: styles.statusApplied,
    pending: styles.statusPending,
    accepted: styles.statusAccepted,
    rejected: styles.statusRejected,
    interview: styles.statusInterview,
  };

  const date = new Date(applicationDate).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  const handleSaveStatus = () => {
    if (onUpdateStatus && newStatus !== status) {
      onUpdateStatus(id, newStatus);
    }
    setIsEditingStatus(false);
  };

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <div>
          <h4 className={styles.company}>{companyName}</h4>
          <a
            href={jobUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.link}
          >
            View Job Posting
          </a>
        </div>
        {isEditingStatus ? (
          <div className={styles.statusEdit}>
            <select 
              value={newStatus} 
              onChange={(e) => setNewStatus(e.target.value as any)}
              className={styles.statusSelect}
            >
              <option value="applied">Applied</option>
              <option value="pending">Pending</option>
              <option value="interview">Interview</option>
              <option value="accepted">Accepted</option>
              <option value="rejected">Rejected</option>
            </select>
            <button 
              className={styles.saveBtn}
              onClick={handleSaveStatus}
            >
              Save
            </button>
            <button 
              className={styles.cancelStatusBtn}
              onClick={() => {
                setIsEditingStatus(false);
                setNewStatus(status);
              }}
            >
              Cancel
            </button>
          </div>
        ) : (
          <span 
            className={`${styles.status} ${statusColors[status]}`}
            onClick={() => setIsEditingStatus(true)}
            style={{ cursor: 'pointer' }}
            title="Click to edit"
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </span>
        )}
      </div>

      <div className={styles.footer}>
        <span className={styles.date}>Applied: {date}</span>
        <button
          className={styles.deleteBtn}
          onClick={() => onDelete(id)}
          title="Delete application"
        >
          Delete
        </button>
      </div>
    </div>
  );
}
