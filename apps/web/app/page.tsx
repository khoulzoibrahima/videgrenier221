import Link from "next/link";
import {
  ArrowRight,
  Camera,
  CheckCircle2,
  Heart,
  Leaf,
  MapPin,
  Menu,
  MessageCircle,
  PencilLine,
  Share2,
  ShoppingBag,
  Store,
} from "lucide-react";

const steps = [
  { icon: Camera, title: "Prenez des photos", text: "Photographiez les objets que vous voulez vendre." },
  { icon: PencilLine, title: "Vérifiez vos annonces", text: "Regardez les prix et changez ce que vous voulez." },
  { icon: MessageCircle, title: "Partagez sur WhatsApp", text: "Envoyez votre boutique à vos proches en un clic." },
];

const listings = [
  { name: "Canapé 3 places", price: "125 000 FCFA", city: "Dakar", tone: "sofa" },
  { name: "Table basse", price: "45 000 FCFA", city: "Thiès", tone: "table" },
  { name: "Lampe sur pied", price: "25 000 FCFA", city: "Rufisque", tone: "lamp" },
  { name: "Tapis", price: "30 000 FCFA", city: "Mbour", tone: "rug" },
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
        <nav className="desktop-nav" aria-label="Navigation principale">
          <Link href="/browse">Acheter</Link>
          <Link href="/sell/room">Vendre</Link>
          <a href="#comment">Comment ça marche</a>
        </nav>
        <div className="header-actions">
          <Link className="login-link" href="/login">Se connecter</Link>
          <Link className="button button-sun header-sell" href="/sell/room">Vendre</Link>
          <button className="mobile-menu" type="button" aria-label="Ouvrir le menu"><Menu /></button>
        </div>
      </header>

      <main>
        <section className="hero section-wrap">
          <div className="hero-copy">
            <p className="eyebrow">Achetez et vendez près de chez vous</p>
            <h1>Vendez facilement ce que vous n’utilisez plus</h1>
            <p className="hero-lead">Prenez quelques photos. Vérifiez vos prix. Partagez votre boutique sur WhatsApp.</p>
            <div className="hero-actions">
              <Link className="button button-forest" href="/sell/room"><Store /> Créer ma boutique</Link>
              <Link className="button button-light" href="/browse"><ShoppingBag /> Voir les bonnes affaires</Link>
            </div>
            <p className="free-note"><CheckCircle2 /> C’est gratuit pour commencer</p>
          </div>

          <div className="shop-demo" aria-label="Exemple d’une boutique Vide Grenier 221">
            <div className="demo-top">
              <div className="avatar">A</div>
              <div><strong>Boutique de Awa</strong><span><MapPin /> Dakar</span></div>
              <span className="open-badge">Ouvert</span>
            </div>
            <div className="demo-items">
              {listings.slice(0, 3).map((item) => (
                <div className="demo-item" key={item.name}>
                  <div className={`mini-art ${item.tone}`}><span /></div>
                  <strong>{item.name}</strong><span>{item.price}</span>
                </div>
              ))}
            </div>
            <div className="demo-share"><MessageCircle /> Partager ma boutique sur WhatsApp</div>
          </div>
        </section>

        <section className="steps-section section-wrap" id="comment">
          <div className="simple-heading"><span>3 étapes</span><h2>C’est simple</h2></div>
          <div className="steps-grid">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return <article className="step-card" key={step.title}><b>{index + 1}</b><Icon /><div><h3>{step.title}</h3><p>{step.text}</p></div></article>;
            })}
          </div>
        </section>

        <section className="listings-section section-wrap">
          <div className="section-heading">
            <div><p className="eyebrow">Au Sénégal</p><h2>Dernières trouvailles</h2></div>
            <Link className="text-link" href="/browse">Tout voir <ArrowRight /></Link>
          </div>
          <div className="listing-grid">
            {listings.map((item) => (
              <article className="listing-card" key={item.name}>
                <div className={`listing-art ${item.tone}`} role="img" aria-label={item.name}>
                  <span className="furniture-shape" />
                  <button type="button" aria-label={`Ajouter ${item.name} aux favoris`}><Heart /></button>
                </div>
                <div className="listing-body"><h3>{item.name}</h3><p><MapPin /> {item.city}</p><strong>{item.price}</strong></div>
              </article>
            ))}
          </div>
        </section>

        <section className="share-section section-wrap">
          <div className="share-icon"><Share2 /></div>
          <div><h2>Une seule boutique à partager</h2><p>Vos objets sont regroupés au même endroit. Envoyez le lien sur WhatsApp et discutez directement avec les acheteurs.</p></div>
          <Link className="button button-sun" href="/sell/room">Commencer maintenant</Link>
        </section>
      </main>

      <footer className="site-footer">
        <div className="section-wrap footer-inner">
          <div><Brand /><p>Achetez. Vendez. Près de chez vous.</p></div>
          <div className="footer-links"><Link href="/browse">Acheter</Link><Link href="/sell/room">Vendre</Link><Link href="/safety">Sécurité</Link></div>
          <p className="copyright">© 2026 VideGrenier221 · Sénégal</p>
        </div>
      </footer>
    </div>
  );
}

