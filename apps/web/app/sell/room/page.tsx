import { Camera, Leaf } from "lucide-react";
import Link from "next/link";
import { RequireCompleteProfile } from "../../../components/require-complete-profile";

export default function SellRoomPage() {
  return (
    <RequireCompleteProfile>
      <main className="room-page">
        <section className="room-shell">
          <Link className="brand" href="/" aria-label="Vide Grenier 221, accueil">
            <span className="brand-mark"><Leaf size={20} /></span>
            <span>Vide Grenier</span> <strong>221</strong>
          </Link>
          <span className="room-icon"><Camera aria-hidden="true" /></span>
          <p className="eyebrow">Vendre plusieurs objets</p>
          <h1>Photographier une pièce</h1>
          <p>La prise de photos arrive dans la prochaine étape. Votre profil est maintenant prêt.</p>
          <Link className="button button-forest" href="/">Retour à l’accueil</Link>
        </section>
      </main>
    </RequireCompleteProfile>
  );
}
