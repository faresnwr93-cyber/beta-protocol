import Link from "next/link";
import Image from "next/image";
import { getPublicLinks } from "@/lib/config";

function DiscordGlyph() {
  return (
    <svg className="discord-glyph" viewBox="0 0 24 24" aria-hidden="true" fill="currentColor">
      <path d="M19.73 5.1a19.8 19.8 0 0 0-4.88-1.5.08.08 0 0 0-.08.04c-.21.38-.45.88-.62 1.28a18.3 18.3 0 0 0-5.48 0c-.17-.4-.42-.9-.63-1.28a.08.08 0 0 0-.08-.04A19.7 19.7 0 0 0 3.08 5.1a.07.07 0 0 0-.03.03C-.05 9.73-.9 14.2-.48 18.62c0 .02.02.04.04.06a20 20 0 0 0 6 3.03.08.08 0 0 0 .08-.03c.46-.63.87-1.3 1.22-2.02a.08.08 0 0 0-.04-.11 13.2 13.2 0 0 1-1.88-.9.08.08 0 0 1-.01-.13l.38-.3a.08.08 0 0 1 .08-.01c3.95 1.8 8.22 1.8 12.13 0a.08.08 0 0 1 .08.01l.38.3a.08.08 0 0 1-.01.13c-.6.36-1.23.66-1.89.9a.08.08 0 0 0-.04.11c.36.71.77 1.39 1.22 2.02a.08.08 0 0 0 .08.03 20 20 0 0 0 6-3.03.08.08 0 0 0 .04-.06c.5-5.1-.83-9.52-3.58-13.5a.06.06 0 0 0-.03-.03ZM8.02 14.8c-1.19 0-2.17-1.1-2.17-2.44s.96-2.44 2.17-2.44c1.22 0 2.2 1.11 2.18 2.44 0 1.34-.96 2.44-2.18 2.44Zm8 0c-1.19 0-2.17-1.1-2.17-2.44s.96-2.44 2.17-2.44c1.22 0 2.2 1.11 2.18 2.44 0 1.34-.95 2.44-2.18 2.44Z" />
    </svg>
  );
}

export default function HomePage() {
  const { invite, rules } = getPublicLinks();

  return (
    <div className="site-shell landing-shell">
      <header className="site-header landing-header">
        <Link className="brand" href="/" aria-label="PROTOCOLE Z : ORIGINS — accueil">
          <Image className="brand-logo" src="/logo-pz.png" alt="" width={48} height={48} priority />
          <span>PROTOCOLE Z : ORIGINS</span>
        </Link>
        {rules ? <a className="landing-nav-link" href={rules} target="_blank" rel="noreferrer">Règlement</a> : null}
      </header>

      <main className="landing-main">
        <div className="ambient-scene" aria-hidden="true">
          <span className="ambient-glow" />
          <span className="ambient-mist ambient-mist-one" />
          <span className="ambient-mist ambient-mist-two" />
        </div>
        <section className="claim-hero" aria-labelledby="hero-title">
          <p className="landing-kicker"><span className="live-dot" /> PORTAIL D'ACCÈS</p>
          <h1 className="landing-title" id="hero-title">BÊTA FERMÉ</h1>
          <p className="landing-copy">
            Identifie-toi avec Discord. Si ton compte est autorisé,
            le rôle te sera attribué automatiquement.
          </p>
          <a className="discord-button landing-button" href="/api/auth/discord">
            <DiscordGlyph />
            S'identifier avec Discord
            <span className="button-arrow" aria-hidden="true">↗</span>
          </a>
          <p className="landing-note">
            Connexion sécurisée · Vérification automatique
            {" · "}
            <Link href="/confidentialite">Confidentialité</Link>
          </p>
        </section>
      </main>

      <footer className="site-footer landing-footer">
        <span className="footer-note">PROTOCOLE Z : ORIGINS · FIVE M RP</span>
        <nav className="footer-links" aria-label="Liens utiles">
          {invite ? <a href={invite} target="_blank" rel="noreferrer">Discord</a> : null}
          {rules ? <a href={rules} target="_blank" rel="noreferrer">Règlement</a> : null}
        </nav>
      </footer>
    </div>
  );
}
