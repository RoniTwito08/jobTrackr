import { useEffect, useState } from "react";
import { api } from "../api/axios";
import { useNavigate } from "react-router-dom";
import styles from "./MePage.module.css";
import JobApplicationForm from "../components/JobApplicationForm";
import JobChecker from "../components/JobChecker";
import JobApplicationCard from "../components/JobApplicationCard";

type User = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  createdAt: string;
};

type JobApplication = {
  _id: string;
  companyName: string;
  jobUrl: string;
  applicationDate: string;
  status: "applied" | "rejected" | "accepted" | "pending" | "interview";
};

export default function MePage() {
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [showChecker, setShowChecker] = useState(false);
  const [showApplicationsList, setShowApplicationsList] = useState(false);
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [foundApplication, setFoundApplication] = useState<JobApplication | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<JobApplication[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMe = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const res = await api.get("/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(res.data);
      } catch {
        setError("Session expired. Please sign in again.");
      }
    };
    fetchMe();
  }, []);

  useEffect(() => {
    if (user) {
      fetchApplications();
    }
  }, [user]);

  const fetchApplications = async () => {
    try {
      const res = await api.get("/jobs");
      setApplications(res.data);
    } catch (err) {
      console.error("Failed to fetch applications", err);
    }
  };

  const handleLogout = async () => {
    try {
      await api.post("/auth/logout");
    } finally {
      localStorage.removeItem("accessToken");
      navigate("/login");
    }
  };

  const handleApplicationCreated = () => {
    fetchApplications();
  };

  const handleDeleteApplication = async (id: string) => {
    if (!confirm("Are you sure you want to delete this application?")) return;
    try {
      await api.delete(`/jobs/${id}`);
      setApplications(applications.filter((app) => app._id !== id));
      setSearchResults(searchResults.filter((app) => app._id !== id));
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to delete application");
    }
  };

  const handleUpdateApplicationStatus = async (
    id: string,
    newStatus: "applied" | "rejected" | "accepted" | "pending",
  ) => {
    try {
      const res = await api.put(`/jobs/${id}`, { status: newStatus });
      setApplications(
        applications.map((app) => (app._id === id ? res.data : app)),
      );
      setSearchResults(
        searchResults.map((app) => (app._id === id ? res.data : app)),
      );
      if (foundApplication && foundApplication._id === id) {
        setFoundApplication(res.data);
      }
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to update application");
    }
  };

  const handleApplicationFound = (app: JobApplication) => {
    setFoundApplication(app);
    setShowChecker(false);
  };

  const handleNoApplication = () => {
    setFoundApplication(null);
    setShowChecker(false);
    setShowForm(true);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setShowChecker(false);
    setShowApplicationsList(false);
    if (query.trim()) {
      const results = applications.filter((app) =>
        app.companyName.toLowerCase().includes(query.toLowerCase())
      );
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
  };

  const itemsPerPage = 10;
  const paginatedApplications = applications.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  const totalPages = Math.ceil(applications.length / itemsPerPage);

  if (error) {
    return (
      <div className={styles.page}>
        <div className={styles.card}>
          <h2 className={styles.title}>Access lost</h2>
          <p className={styles.subtitle}>{error}</p>
          <button className={styles.primaryBtn} onClick={handleLogout}>
            Go to login
          </button>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className={styles.page}>
        <div className={styles.card}>
          <div className={styles.loader} />
          <p className={styles.subtitle}>Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.bgGlow} />
      <div className={styles.pageContainer}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.searchContainer}>
            <input
              type="text"
              className={styles.searchInput}
              placeholder="Search by company..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
            />
          </div>

          <div className={styles.headerCenter}>
            <h1 className={styles.headerTitle}>
              Welcome, {user.firstName.charAt(0).toUpperCase() + user.firstName.slice(1)} {user.lastName.charAt(0).toUpperCase() + user.lastName.slice(1)}
            </h1>
          </div>

          <div className={styles.headerEnd}>
            <button className={styles.logoutBtn} onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className={styles.mainContent}>
          {/* Stats Section */}
          <div className={styles.statsSection}>
            <h2 className={styles.statsTitle}>Your Progress</h2>
            <div className={styles.stats}>
              <div className={styles.stat}>
                <span className={styles.statLabel}>Applications</span>
                <span className={styles.statValue}>{applications.length}</span>
              </div>
              <div className={styles.stat}>
                <span className={styles.statLabel}>Applied</span>
                <span className={styles.statValue}>
                  {applications.filter((app) => app.status === "applied").length}
                </span>
              </div>
              <div className={styles.stat}>
                <span className={styles.statLabel}>Interviews</span>
                <span className={styles.statValue}>
                  {applications.filter((app) => app.status === "interview").length}
                </span>
              </div>
              <div className={styles.stat}>
                <span className={styles.statLabel}>Accepted</span>
                <span className={styles.statValue}>
                  {applications.filter((app) => app.status === "accepted").length}
                </span>
              </div>
              <div className={styles.stat}>
                <span className={styles.statLabel}>Rejected</span>
                <span className={styles.statValue}>
                  {applications.filter((app) => app.status === "rejected").length}
                </span>
              </div>
            </div>
          </div>

          {/* Content Section */}
          <div className={styles.contentSection}>
            {searchResults.length > 0 && (
              <div className={styles.foundSection}>
                <h3>
                  {searchResults.length} Application{searchResults.length !== 1 ? "s" : ""} Found
                </h3>
                {searchResults.map((app) => (
                  <JobApplicationCard
                    key={app._id}
                    id={app._id}
                    companyName={app.companyName}
                    jobUrl={app.jobUrl}
                    applicationDate={app.applicationDate}
                    status={app.status}
                    onDelete={handleDeleteApplication}
                    onUpdateStatus={handleUpdateApplicationStatus}
                  />
                ))}
              </div>
            )}

            {foundApplication && (
              <div className={styles.foundSection}>
                <h3>Already Applied</h3>
                <JobApplicationCard
                  id={foundApplication._id}
                  companyName={foundApplication.companyName}
                  jobUrl={foundApplication.jobUrl}
                  applicationDate={foundApplication.applicationDate}
                  status={foundApplication.status}
                  onDelete={handleDeleteApplication}
                  onUpdateStatus={handleUpdateApplicationStatus}
                />
                <button
                  className={styles.secondaryBtn}
                  onClick={() => setFoundApplication(null)}
                >
                  Clear
                </button>
              </div>
            )}

            {showChecker && (
              <JobChecker
                onApplicationFound={handleApplicationFound}
                onNoApplication={handleNoApplication}
              />
            )}

            {applications.length > 0 && showApplicationsList && (
              <div className={styles.applicationsList}>
                <h3>Your Applications</h3>
                {paginatedApplications.map((app) => (
                  <JobApplicationCard
                    key={app._id}
                    id={app._id}
                    companyName={app.companyName}
                    jobUrl={app.jobUrl}
                    applicationDate={app.applicationDate}
                    status={app.status}
                    onDelete={handleDeleteApplication}
                    onUpdateStatus={handleUpdateApplicationStatus}
                  />
                ))}
                {totalPages > 1 && (
                  <div className={styles.pagination}>
                    <button
                      className={styles.paginationBtn}
                      onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
                    >
                      ← Previous
                    </button>
                    <span className={styles.pageInfo}>
                      Page {currentPage} of {totalPages}
                    </span>
                    <button
                      className={styles.paginationBtn}
                      onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                      disabled={currentPage === totalPages}
                    >
                      Next →
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className={styles.sidebar}>
          <h3 className={styles.sidebarTitle}>Actions</h3>
          <button
            className={styles.sidebarBtn}
            onClick={() => {
              setShowForm(true);
              setShowChecker(false);
            }}
          >
            + Add Application
          </button>
          <button
            className={styles.sidebarBtn}
            onClick={() => {
              setShowChecker(!showChecker);
              setFoundApplication(null);
              setShowApplicationsList(false);
              setSearchQuery("");
              setSearchResults([]);
            }}
          >
            🔍 Check URL
          </button>
          <button
            className={styles.sidebarBtn}
            onClick={() => {
              setShowApplicationsList(!showApplicationsList);
              setSearchQuery("");
              setSearchResults([]);
              setCurrentPage(1);
              setShowChecker(false);
            }}
          >
            📋 View Applications
          </button>
        </div>
      </div>

      {showForm && (
        <JobApplicationForm
          onSuccess={handleApplicationCreated}
          onClose={() => setShowForm(false)}
        />
      )}
    </div>
  );
}
