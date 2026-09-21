"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { CheckCircle2, Leaf, LoaderCircle } from "lucide-react";
import { FormEvent, Suspense, useState } from "react";
import { AvatarEditor } from "../../../components/avatar-editor";
import { authenticatedFetch } from "../../../lib/api";
import { requestAvatarSignature, uploadAvatar } from "../../../lib/profile";
import { useSession } from "../../../lib/session";

function safeDestination(value: string | null) {
  return value?.startsWith("/") && !value.startsWith("//") ? value : "/";
}

function ProfileSetupForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { firebaseUser, profile, refreshProfile } = useSession();
  const [displayName, setDisplayName] = useState(profile?.displayName ?? "");
  const [whatsappNumber, setWhatsappNumber] = useState(
    profile?.whatsappNumber?.replace(/^\+221/, "") ?? "",
  );
  const [city, setCity] = useState(profile?.city ?? "");
  const [avatar, setAvatar] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!displayName.trim() || !whatsappNumber.trim() || !city.trim()) {
      setError("Remplissez le nom, WhatsApp et la ville.");
      return;
    }
    if (!firebaseUser) {
      setError("Reconnectez-vous pour enregistrer votre profil.");
      return;
    }

    setSaving(true);
    setError("");
    try {
      let uploadedAvatar: { secureUrl: string; publicId: string } | null = null;
      if (avatar) {
        const signature = await requestAvatarSignature(firebaseUser);
        uploadedAvatar = await uploadAvatar(avatar, signature);
      }
      const response = await authenticatedFetch(firebaseUser, "/api/v1/me/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          displayName: displayName.trim(),
          whatsappNumber: whatsappNumber.trim(),
          city: city.trim(),
          avatarUrl: uploadedAvatar?.secureUrl,
          avatarPublicId: uploadedAvatar?.publicId,
        }),
      });
      if (!response.ok) throw new Error("Impossible d’enregistrer. Réessayez.");
      await refreshProfile(firebaseUser);
      router.replace(safeDestination(searchParams.get("next")));
    } catch (caught) {
      setSaving(false);
      setError(caught instanceof Error ? caught.message : "Impossible d’enregistrer. Réessayez.");
    }
  }

  return (
    <main className="profile-page">
      <section className="profile-card">
        <Link className="brand profile-brand" href="/" aria-label="Vide Grenier 221, accueil">
          <span className="brand-mark"><Leaf size={20} /></span>
          <span>Vide Grenier</span> <strong>221</strong>
        </Link>
        <div className="profile-heading">
          <p className="eyebrow">Une dernière étape</p>
          <h1>Complétez votre profil</h1>
          <p>Ces informations permettront aux acheteurs et vendeurs de vous contacter facilement.</p>
        </div>

        <form className="profile-form" onSubmit={submit} noValidate>
          <AvatarEditor avatarUrl={profile?.avatarUrl ?? null} onChange={setAvatar} />
          <label>
            <span>Prénom et nom</span>
            <input value={displayName} onChange={(event) => setDisplayName(event.target.value)} autoComplete="name" />
          </label>
          <label htmlFor="whatsapp-number">
            <span>Numéro WhatsApp</span>
            <span className="phone-field"><b>+221</b><input id="whatsapp-number" aria-label="Numéro WhatsApp" value={whatsappNumber} onChange={(event) => setWhatsappNumber(event.target.value)} inputMode="tel" autoComplete="tel" placeholder="77 123 45 67" /></span>
          </label>
          <label>
            <span>Ville ou commune</span>
            <input value={city} onChange={(event) => setCity(event.target.value)} autoComplete="address-level2" placeholder="Dakar, Thiès, Saint-Louis…" />
          </label>
          {error && <p className="form-error form-error-box" role="alert">{error}</p>}
          <button className="profile-submit" type="submit" disabled={saving}>
            {saving ? <LoaderCircle className="spin" aria-hidden="true" /> : <CheckCircle2 aria-hidden="true" />}
            {saving ? "Enregistrement…" : "Enregistrer et continuer"}
          </button>
        </form>
      </section>
    </main>
  );
}

export default function ProfileSetupPage() {
  return <Suspense fallback={<main className="profile-page" aria-label="Chargement du profil" />}><ProfileSetupForm /></Suspense>;
}
