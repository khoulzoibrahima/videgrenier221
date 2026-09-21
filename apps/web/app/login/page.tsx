"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { CheckCircle2, Leaf, LoaderCircle } from "lucide-react";
import { useState } from "react";
import { signInWithGoogle } from "../../lib/firebase";

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function connect() {
    setLoading(true);
    setError("");
    try {
      await signInWithGoogle();
      router.replace("/sell/room");
    } catch (caught) {
      setLoading(false);
      setError(caught instanceof Error ? caught.message : "La connexion n’a pas fonctionné.");
    }
  }

  return (
    <main className="login-page">
      <section className="login-card">
        <Link className="brand login-brand" href="/" aria-label="Vide Grenier 221, accueil">
          <span className="brand-mark"><Leaf size={20} /></span>
          <span>Vide Grenier</span> <strong>221</strong>
        </Link>
        <div className="login-copy">
          <p className="eyebrow">Bienvenue</p>
          <h1>Connectez-vous simplement</h1>
          <p>Utilisez votre compte Google pour acheter ou vendre.</p>
        </div>
        <button className="google-button" type="button" onClick={connect} disabled={loading} aria-label={loading ? "Connexion en cours" : "Continuer avec Google"}>
          {loading ? <LoaderCircle className="spin" aria-hidden="true" /> : <span className="google-letter" aria-hidden="true">G</span>}
          {loading ? "Connexion…" : "Continuer avec Google"}
        </button>
        {error && <p className="login-error" role="alert">{error}</p>}
        <p className="login-note"><CheckCircle2 /> Aucun mot de passe à retenir.</p>
        <Link className="back-home" href="/">Retour à l’accueil</Link>
      </section>
    </main>
  );
}
