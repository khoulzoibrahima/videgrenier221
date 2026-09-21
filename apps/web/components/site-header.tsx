"use client";

import Link from "next/link";
import { Leaf, Menu, Search, UserRound } from "lucide-react";
import { useSession } from "../lib/session";

export function SiteHeader() {
  const { status, profile, signOut } = useSession();
  const firstName = profile?.displayName.trim().split(/\s+/)[0];

  return (
    <header className="site-header">
      <Link className="brand" href="/" aria-label="Vide Grenier 221, accueil">
        <span className="brand-mark"><Leaf size={20} /></span>
        <span>Vide Grenier</span> <strong>221</strong>
      </Link>
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
        {status === "loading" && <span className="profile-skeleton" aria-label="Chargement du compte" />}
        {status === "unauthenticated" && (
          <Link className="profile-link" href="/login" aria-label="Connexion"><UserRound /></Link>
        )}
        {status === "authenticated" && profile && (
          <div className="connected-profile">
            <Link className="connected-summary" href="/profile" aria-label="Mon profil">
              <span
                className="connected-avatar"
                style={profile.avatarUrl ? { backgroundImage: `url("${profile.avatarUrl}")` } : undefined}
              >{!profile.avatarUrl && firstName?.charAt(0)}</span>
              <span>{firstName}</span>
            </Link>
            <button type="button" onClick={() => void signOut()}>Déconnexion</button>
          </div>
        )}
        <button className="mobile-menu" type="button" aria-label="Ouvrir le menu"><Menu /></button>
      </div>
    </header>
  );
}
