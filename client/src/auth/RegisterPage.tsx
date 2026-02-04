import { useState } from "react";
import { GoogleLogin } from "@react-oauth/google";
import { api } from "../api/axios";
import { useNavigate, Link } from "react-router-dom";
import styles from "./RegisterPage.module.css";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await api.post("/auth/register", {
        email,
        firstName,
        lastName,
        password,
      });

      navigate("/login");
    } catch (err: any) {
      setError(
        err.response?.data?.message || "Registration failed"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse: any) => {
    try {
      setError(null);
      setLoading(true);
      const res = await api.post("/auth/google", {
        idToken: credentialResponse.credential,
      });
      localStorage.setItem("accessToken", res.data.accessToken);
      navigate("/me");
    } catch (err: any) {
      setError(err.response?.data?.message || "Google sign-up failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.bgGlow} />
      <form className={styles.card} onSubmit={handleSubmit}>
        <div className={styles.brand}>
          <span className={styles.logoDot} />
          <span>JobTrackr</span>
        </div>
        <h2 className={styles.title}>Create your account</h2>
        <p className={styles.subtitle}>
          Track applications, manage interviews, and move faster.
        </p>

        <div className={styles.field}>
          <label>Email</label>
          <input
            placeholder="you@company.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
          />
        </div>

        <div className={styles.field}>
          <label>First Name</label>
          <input
            placeholder="John"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            autoComplete="given-name"
          />
        </div>

        <div className={styles.field}>
          <label>Last Name</label>
          <input
            placeholder="Doe"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            autoComplete="family-name"
          />
        </div>

        <div className={styles.field}>
          <label>Password</label>
          <input
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="new-password"
          />
        </div>

        {error && <div className={styles.error}>{error}</div>}

        <button className={styles.primaryBtn} disabled={loading}>
          {loading ? "Creating..." : "Create account"}
        </button>

        <div className={styles.divider}>
          <span>or</span>
        </div>

        <GoogleLogin
          onSuccess={handleGoogleSuccess}
          onError={() => setError("Google sign-up failed")}
          text="signup_with"
        />

        <p className={styles.footerText}>
          Already have an account?{" "}
          <Link className={styles.link} to="/login">
            Sign in
          </Link>
        </p>
      </form>
    </div>
  );
}
