import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight, Camera, Check, Heart, Leaf, MapPin, Menu, ScanSearch,
  ShieldCheck, ShoppingBag, Sparkles, Store, Users,
} from "lucide-react";

const steps = [
  { icon: Camera, title: "Prenez une photo", text: "Une pièce entière ou un seul objet, directement depuis votre téléphone." },
  { icon: ScanSearch, title: "L’IA identifie les objets", text: "Elle prépare une fiche et un prix indicatif pour chaque objet détecté." },
  { icon: Store, title: "Créez votre boutique", text: "Vous corrigez, validez et partagez votre boutique avec vos proches." },
];

const listings = [
  { name: "Canapé 3 places", price: "125 000 FCFA", city: "Dakar", tone: "sofa" },
  { name: "Table basse", price: "45 000 FCFA", city: "Thiès", tone: "table" },
  { name: "Lampe sur pied", price: "25 000 FCFA", city: "Rufisque", tone: "lamp" },
  { name: "Tapis berbère", price: "30 000 FCFA", city: "Mbour", tone: "rug" },
];

function Brand() {
  return (
    <Link className="brand" href="/" aria-label="Vide Grenier 221, accueil">
      <span className="brand-mark" aria-hidden="true"><Leaf size={21} strokeWidth={2.5} /></span>
      <span>Vide Grenier</span> <strong>221</strong>
    </Link>
  );
}

export default function HomePage() {
  return (
    <div className="site-shell">
      <header className="site-header">
        <Brand />
        <nav className="desktop-nav" aria-label="Navigation principale">
          <Link className="active" href="/browse">Acheter</Link>
          <Link href="/sell/item">Vendre</Link>
          <a href="#fonctionnement">Comment ça marche</a>
          <a href="#confiance">À propos</a>
        </nav>
        <div className="header-actions">
          <Link className="button button-ghost login-link" href="/login">Connexion</Link>
          <Link className="button button-sun" href="/sell/room"><Store size={18} /> Créer une boutique</Link>
          <button className="mobile-menu" type="button" aria-label="Ouvrir le menu"><Menu /></button>
        </div>
      </header>

      <main>
        <section className="hero section-wrap">
          <div className="hero-copy">
            <p className="eyebrow">Des objets. Des rencontres. Un Sénégal plus durable.</p>
            <h1>Transformez vos objets en boutique en <em>quelques minutes</em></h1>
            <p className="hero-lead">Photographiez une pièce, laissez notre IA préparer les fiches, puis choisissez ce que vous publiez. Votre boutique est prête à être partagée.</p>
            <div className="hero-actions">
              <Link className="button button-forest" href="/sell/room"><Camera size={20} /> Photographier une pièce</Link>
              <Link className="button button-sun" href="/sell/item"><ShoppingBag size={20} /> Vendre un objet</Link>
            </div>
            <ul className="trust-list" aria-label="Avantages">
              <li><Leaf /> Une seconde vie pour vos objets</li>
              <li><Users /> Une communauté au Sénégal</li>
              <li><ShieldCheck /> Vous validez avant publication</li>
            </ul>
          </div>

          <div className="hero-visual">
            <div className="image-glow" />
            <Image src="/images/hero-marketplace.png" alt="Aperçu de VideGrenier221 avec une pièce analysée et ses objets détectés" width={1672} height={1024} priority sizes="(max-width: 900px) 100vw, 52vw" />
            <div className="floating-note"><Sparkles size={18} /><span><strong>Une photo.</strong> Votre boutique prend vie.</span></div>
          </div>
        </section>

        <section className="steps-section section-wrap" id="fonctionnement">
          <div className="section-heading">
            <div><p className="eyebrow">Simple comme une photo</p><h2>Comment ça marche ?</h2></div>
            <p>Vous gardez le dernier mot sur chaque objet, chaque description et chaque prix.</p>
          </div>
          <div className="steps-grid">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <article className="step-card" key={step.title}>
                  <span className="step-number">{index + 1}</span><span className="step-icon"><Icon /></span>
                  <div><h3>{step.title}</h3><p>{step.text}</p></div>
                </article>
              );
            })}
          </div>
        </section>

        <section className="listings-section section-wrap">
          <div className="section-heading compact">
            <div><p className="eyebrow">Près de chez vous</p><h2>Dernières trouvailles</h2></div>
            <Link className="text-link" href="/browse">Voir toutes les annonces <ArrowRight /></Link>
          </div>
          <div className="listing-grid">
            {listings.map((listing) => (
              <article className="listing-card" key={listing.name}>
                <div className={`listing-art ${listing.tone}`} role="img" aria-label={listing.name}>
                  <span className="furniture-shape" />
                  <button aria-label={`Ajouter ${listing.name} aux favoris`} type="button"><Heart /></button>
                </div>
                <div className="listing-body"><h3>{listing.name}</h3><p className="location"><MapPin /> {listing.city}</p><p className="price">{listing.price}</p></div>
              </article>
            ))}
          </div>
        </section>

        <section className="ai-section section-wrap">
          <div className="ai-visual"><Image src="/images/ai-detection.png" alt="Interface de détection de plusieurs objets dans une pièce" width={1672} height={1024} sizes="(max-width: 900px) 100vw, 52vw" /></div>
          <div className="ai-copy">
            <p className="eyebrow">Votre temps compte</p><h2>L’IA prépare. Vous décidez.</h2>
            <p>VideGrenier221 repère les objets vendables et propose des fiches claires. Rien n’est publié avant votre validation.</p>
            <ul className="check-list">
              <li><Check /> Une fiche distincte par objet</li><li><Check /> Des prix indicatifs en FCFA</li>
              <li><Check /> Titres et descriptions modifiables</li><li><Check /> Aucun détail inventé sans confirmation</li>
            </ul>
            <Link className="button button-forest" href="/sell/room">Essayer avec une pièce <ArrowRight /></Link>
          </div>
        </section>

        <section className="trust-section" id="confiance">
          <div className="section-wrap trust-inner">
            <div><p className="eyebrow light">Une vente plus humaine</p><h2>Votre boutique. Vos règles.</h2><p>Partagez un seul lien sur WhatsApp et échangez directement avec les acheteurs.</p></div>
            <div className="trust-points"><span><ShieldCheck /> Validation vendeur</span><span><MapPin /> Localisation approximative</span><span><Store /> Boutique partageable</span></div>
          </div>
        </section>

        <section className="cta-section section-wrap">
          <div><p className="eyebrow">Prêt à faire de la place ?</p><h2>Ce qui dort chez vous peut servir à quelqu’un près de chez vous.</h2></div>
          <Link className="button button-sun" href="/sell/room"><Camera /> Créer ma boutique</Link>
        </section>
      </main>

      <footer className="site-footer">
        <div className="section-wrap footer-inner">
          <div><Brand /><p>Des objets d’aujourd’hui pour un meilleur demain.</p></div>
          <div className="footer-links"><a href="#fonctionnement">Comment ça marche</a><Link href="/browse">Explorer</Link><Link href="/safety">Conseils de sécurité</Link><Link href="/legal">Mentions légales</Link></div>
          <p className="copyright">© 2026 VideGrenier221 · Fait avec soin au Sénégal</p>
        </div>
      </footer>
    </div>
  );
}

