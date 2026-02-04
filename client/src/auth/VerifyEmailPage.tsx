import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";
import styles from "./VerifyEmailPage.module.css";

export default function VerifyEmailPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading"
  );
  const [message, setMessage] = useState("");

  useEffect(() => {
    const verifyToken = async () => {
      try {
        const token = searchParams.get("token");

        if (!token) {
          setStatus("error");
          setMessage("No verification token provided");
          return;
        }

        const response = await axios.post(
          `http://localhost:3000/auth/verify-email`,
          { token }
        );

        setStatus("success");
        setMessage(response.data.message);

        // Redirect to login after 3 seconds
        setTimeout(() => {
          navigate("/login");
        }, 3000);
      } catch (err) {
        setStatus("error");
        if (axios.isAxiosError(err)) {
          setMessage(
            err.response?.data?.message || "Email verification failed"
          );
        } else {
          setMessage("An unexpected error occurred");
        }
      }
    };

    verifyToken();
  }, [searchParams, navigate]);

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        {status === "loading" && (
          <>
            <div className={styles.spinner}></div>
            <h2>Verifying your email...</h2>
            <p>Please wait while we verify your email address.</p>
          </>
        )}

        {status === "success" && (
          <>
            <div className={styles.successIcon}>✓</div>
            <h2>Email Verified!</h2>
            <p>{message}</p>
            <p className={styles.redirect}>
              Redirecting to login in 3 seconds...
            </p>
          </>
        )}

        {status === "error" && (
          <>
            <div className={styles.errorIcon}>✕</div>
            <h2>Verification Failed</h2>
            <p>{message}</p>
            <button
              onClick={() => navigate("/register")}
              className={styles.button}
            >
              Back to Register
            </button>
          </>
        )}
      </div>
    </div>
  );
}
