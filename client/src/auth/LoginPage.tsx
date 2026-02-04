import { useState } from "react";
import { GoogleLogin } from "@react-oauth/google";
import { api } from "../api/axios";
import { useNavigate, Link } from "react-router-dom";
import styles from "./LoginPage.module.css";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await api.post("/auth/login", { email, password });
      localStorage.setItem("accessToken", res.data.accessToken);
      navigate("/me");
    } catch {
      setError("Login failed. Check your credentials.");
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
      setError(err.response?.data?.message || "Google sign-in failed. Please try again.");
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
        <h2 className={styles.title}>Welcome back</h2>
        <p className={styles.subtitle}>
          Continue tracking your applications in real time.
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
          <label>Password</label>
          <input
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
          />
        </div>

        {error && <div className={styles.error}>{error}</div>}

        <button className={styles.primaryBtn} disabled={loading}>
          {loading ? "Signing in..." : "Sign in"}
        </button>

        <div className={styles.divider}>
          <span>or</span>
        </div>

        <GoogleLogin
          onSuccess={handleGoogleSuccess}
          onError={() => setError("Google sign-in failed")}
          text="signin_with"
        />

        <p className={styles.footerText}>
          New here?{" "}
          <Link className={styles.link} to="/register">
            Create account
          </Link>
        </p>
      </form>
    </div>
  );
}
