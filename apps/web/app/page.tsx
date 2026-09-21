import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight, Baby, BookOpen, Camera, CheckCircle2, Heart, Home,
  Leaf, MapPin, Menu, MessageCircle, Search, Shirt, ShoppingBag,
  Smartphone, Store, Wrench,
} from "lucide-react";

const categories = [
  { name: "Maison", slug: "maison", icon: Home },
  { name: "Électronique", slug: "electronique", icon: Smartphone },
  { name: "Enfants", slug: "enfants", icon: Baby },
  { name: "Vêtements", slug: "vetements", icon: Shirt },
  { name: "Outils", slug: "outils", icon: Wrench },
  { name: "Livres", slug: "livres", icon: BookOpen },
];

const listings = [
  { name: "Canapé 3 places", price: "125 000 FCFA", city: "Dakar · Liberté 6", seller: "Awa N.", position: "16% 48%" },
  { name: "Table basse", price: "45 000 FCFA", city: "Thiès", seller: "Aïssatou D.", position: "55% 58%" },
  { name: "Lampe sur pied", price: "25 000 FCFA", city: "Rufisque", seller: "Fatou S.", position: "66% 30%" },
  { name: "Tapis tissé", price: "30 000 FCFA", city: "Saint-Louis", seller: "Cheikh M.", position: "72% 84%" },
];

function Brand() {
  return (
    <Link className="brand" href="/" aria-label="Vide Grenier 221, accueil">
      <span className="brand-mark"><Leaf size={20} /></span>
      <span>Vide Grenier</span> <strong>221</strong>
    </Link>
  );
}

export default function HomePage() {
  return (
    <div className="site-shell">
      <header className="site-header">
        <Brand />
        <form className="header-search" action="/browse">
          <Search aria-hidden="true" />
          <input name="q" type="search" placeholder="Que cherchez-vous ?" aria-label="Rechercher un objet" />
        </form>
        <nav className="desktop-nav" aria-label="Navigation principale">
          <Link href="/browse">Explorer</Link>
          <a href="#comment">Comment ça marche</a>
        </nav>
        <div className="header-actions">
          <Link className="login-link" href="/login">Connexion</Link>
          <Link className="button button-sun header-sell" href="/sell/room">Vendre</Link>
          <button className="mobile-menu" type="button" aria-label="Ouvrir le menu"><Menu /></button>
        </div>
      </header>

      <main>
        <section className="hero-market">
          <Image className="hero-photo" src="/images/hero-vide-grenier-senegal.png" alt="Objets de seconde main présentés dans une cour sénégalaise" fill priority sizes="100vw" />
          <div className="hero-shade" />
          <div className="hero-content section-wrap">
            <p className="location-line">Dakar · Thiès · Saint-Louis · Tout le Sénégal</p>
            <h1>Achetez local.<br />Vendez ce qui ne vous sert plus.</h1>
            <p className="hero-lead">Des objets utiles, près de chez vous. Discutez directement avec le vendeur sur WhatsApp.</p>
            <div className="hero-actions">
              <Link className="button button-forest" href="/browse"><ShoppingBag /> Voir les bonnes affaires</Link>
              <Link className="button button-cream" href="/sell/room"><Store /> Vendre mes objets</Link>
            </div>
            <p className="hero-trust"><CheckCircle2 /> Gratuit pour commencer · Prix en FCFA</p>
          </div>
          <p className="hero-caption">Une seconde vie pour les objets. Une bonne affaire pour le voisin.</p>
        </section>

        <nav className="category-strip section-wrap" aria-label="Catégories populaires">
          {categories.map(({ name, slug, icon: Icon }) => (
            <Link href={`/browse?category=${slug}`} key={slug}><span><Icon /></span>{name}</Link>
          ))}
        </nav>

        <section className="listings-section section-wrap">
          <div className="section-heading market-heading">
            <div><p className="eyebrow">À saisir maintenant</p><h2>Les bonnes affaires du moment</h2></div>
            <Link className="text-link" href="/browse">Voir toutes les annonces <ArrowRight /></Link>
          </div>
          <div className="listing-grid">
            {listings.map((item) => (
              <article className="listing-card" key={item.name}>
                <div className="listing-photo" role="img" aria-label={item.name} style={{ backgroundPosition: item.position }}>
                  <span>Occasion</span>
                  <button type="button" aria-label={`Ajouter ${item.name} aux favoris`}><Heart /></button>
                </div>
                <div className="listing-body">
                  <h3>{item.name}</h3><strong>{item.price}</strong>
                  <p><span className="seller-dot">{item.seller.charAt(0)}</span>{item.seller}<MapPin /> {item.city}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="local-note section-wrap">
          <span className="note-number">221</span>
          <div><p className="eyebrow">Notre idée est simple</p><h2>Acheter local, c’est garder l’argent près de chez nous.</h2></div>
          <p>Moins de gaspillage, plus de bonnes histoires. Chaque objet vendu peut servir à une autre famille au Sénégal.</p>
        </section>

        <section className="steps-section section-wrap" id="comment">
          <div className="simple-heading"><span>Pour vendre</span><h2>Trois gestes, c’est tout</h2></div>
          <div className="steps-grid">
            <article className="step-card"><b>1</b><Camera /><div><h3>Prenez vos photos</h3><p>Un objet ou toute une pièce.</p></div></article>
            <article className="step-card"><b>2</b><CheckCircle2 /><div><h3>Vérifiez le prix</h3><p>Vous décidez avant de publier.</p></div></article>
            <article className="step-card"><b>3</b><MessageCircle /><div><h3>Partagez sur WhatsApp</h3><p>Votre boutique tient dans un lien.</p></div></article>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="section-wrap footer-inner">
          <div><Brand /><p>Acheter local. Vendre utile. Partager mieux.</p></div>
          <div className="footer-links"><Link href="/browse">Acheter</Link><Link href="/sell/room">Vendre</Link><Link href="/safety">Sécurité</Link></div>
          <p className="copyright">© 2026 VideGrenier221 · Fait pour le Sénégal</p>
        </div>
      </footer>
    </div>
  );
}
