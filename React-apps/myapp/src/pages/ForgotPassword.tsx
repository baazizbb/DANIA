import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import "./AuthPages.css";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { requestPasswordReset } = useAuth();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);
    setIsSubmitting(true);

    try {
      await requestPasswordReset(email);
      setSuccessMessage("Si cet email existe, un lien de reinitialisation a ete envoye.");
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Impossible d'envoyer le mail de reinitialisation.";
      setErrorMessage(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="auth-page">
      <form className="auth-card" onSubmit={handleSubmit}>
        <h1>Mot de passe oublie</h1>
        <p>Saisissez votre email pour recevoir un lien de reinitialisation.</p>

        <label htmlFor="forgot-email">Email</label>
        <input
          id="forgot-email"
          type="email"
          required
          autoComplete="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="vous@email.com"
        />

        {errorMessage ? <p className="auth-error">{errorMessage}</p> : null}
        {successMessage ? <p className="auth-success">{successMessage}</p> : null}

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Envoi..." : "Envoyer le lien"}
        </button>

        <div className="auth-links-row">
          <Link to="/login" className="auth-link">
            Retour a la connexion
          </Link>
          <Link to="/register" className="auth-link">
            Creer un compte
          </Link>
        </div>
      </form>
    </section>
  );
}
