import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight, Baby, BookOpen, Heart, Home, Leaf, MapPin, Menu,
  MoreHorizontal, Search, Shirt, Smartphone, Store,
  UserRound, UsersRound, Wrench,
} from "lucide-react";

const categories = [
  { name: "Maison", slug: "maison", icon: Home },
  { name: "Électronique", slug: "electronique", icon: Smartphone },
  { name: "Enfants", slug: "enfants", icon: Baby },
  { name: "Vêtements", slug: "vetements", icon: Shirt },
  { name: "Outils", slug: "outils", icon: Wrench },
  { name: "Livres", slug: "livres", icon: BookOpen },
  { name: "Autres", slug: "autres", icon: MoreHorizontal },
];

const listings = [
  { name: "iPhone 11 – 64 Go", price: "75 000 FCFA", city: "Dakar · Liberté 6", seller: "Amadou K.", tag: "Occasion", position: "7% 64%" },
  { name: "Table à manger + 4 chaises", price: "35 000 FCFA", city: "Pikine", seller: "Aïssatou D.", tag: "Petit prix", position: "82% 39%" },
  { name: "PlayStation 4 + manettes", price: "90 000 FCFA", city: "Dakar · Ouakam", seller: "M. Diagne", tag: "Occasion", position: "20% 82%" },
  { name: "Poussette bébé", price: "25 000 FCFA", city: "Rufisque", seller: "Fatou S.", tag: "À débattre", position: "72% 34%" },
  { name: "Lot de livres variés", price: "5 000 FCFA", city: "Dakar · Médina", seller: "Cheikh M.", tag: "Petit prix", position: "42% 48%" },
  { name: "Machine à laver LG", price: "120 000 FCFA", city: "Thiès", seller: "Ndeye A.", tag: "Occasion", position: "92% 72%" },
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
          <Link className="active" href="/browse">Explorer</Link>
          <Link href="/shops">Vide-greniers</Link>
          <a href="#comment">Comment ça marche</a>
        </nav>
        <div className="header-actions">
          <Link className="button button-sun header-sell" href="/sell/room">+ Vendre mes objets</Link>
          <Link className="profile-link" href="/login" aria-label="Connexion"><UserRound /></Link>
          <button className="mobile-menu" type="button" aria-label="Ouvrir le menu"><Menu /></button>
        </div>
      </header>

      <main>
        <section className="hero-market section-wrap">
          <div className="hero-content">
            <p className="location-line">Dakar · Thiès · Saint-Louis · Tout le Sénégal</p>
            <h1>Le vide-grenier en ligne<br />près de chez vous</h1>
            <p className="hero-lead">Achetez et vendez facilement les objets qui dorment dans vos maisons.</p>
            <div className="hero-actions">
              <Link className="button button-forest" href="/browse"><Search /> Explorer les bonnes affaires <ArrowRight /></Link>
              <Link className="button button-cream" href="/sell/room"><Store /> Créer mon vide-grenier</Link>
            </div>
            <div className="hero-benefits">
              <span><Leaf /> Objets de<br />seconde main</span>
              <span><UsersRound /> Des particuliers<br />près de chez vous</span>
              <span><Heart /> Une consommation<br />plus responsable</span>
            </div>
          </div>
          <div className="hero-visual">
            <Image className="hero-photo" src="/images/hero-vide-grenier-senegal.png" alt="Objets de seconde main présentés dans une cour sénégalaise" fill priority sizes="(max-width: 760px) 100vw, 62vw" />
            <p className="hero-caption">Des objets d’hier<br />pour un meilleur demain</p>
          </div>
        </section>

        <div className="discovery-row section-wrap">
          <nav className="category-strip" aria-label="Catégories populaires">
            {categories.map(({ name, slug, icon: Icon }) => (
              <Link data-testid="market-category" href={`/browse?category=${slug}`} key={slug}><span><Icon /></span>{name}</Link>
            ))}
          </nav>
          <aside className="room-promo">
            <span className="promo-box"><Store /></span>
            <div><strong>Videz une pièce en quelques minutes</strong><p>Prenez vos photos, nous préparons vos annonces.</p><Link href="/sell/room">Essayer maintenant <ArrowRight /></Link></div>
          </aside>
        </div>

        <section className="listings-section section-wrap">
          <div className="section-heading market-heading">
            <div><h2>Les bonnes affaires du moment</h2></div>
            <Link className="text-link" href="/browse">Voir toutes les annonces <ArrowRight /></Link>
          </div>
          <div className="listing-grid">
            {listings.map((item) => (
              <article className="listing-card" data-testid="listing-card" key={item.name}>
                <div className="listing-photo" role="img" aria-label={item.name} style={{ backgroundPosition: item.position }}>
                  <span>{item.tag}</span>
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
        <span id="comment" />
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
