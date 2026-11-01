import Link from "next/link";

export default function NotFound() {
  return (
    <div className="site-shell">
      <header className="site-header">
        <Link className="brand" href="/" aria-label="PROTOCOLE Z : ORIGINS — accueil">
          <span className="brand-mark" aria-hidden="true">☣</span>
          <span>PROTOCOLE Z : ORIGINS<small>ARCHIVES DE SURVIE // RP</small></span>
        </Link>
        <span className="header-nav"><span className="header-index">SIGNAL PERDU</span></span>
      </header>
      <main className="site-main centered-main">
        <section className="state-card error">
          <p className="not-found-code">ERREUR 404 // SECTEUR INCONNU</p>
          <h1 className="result-title">Cette archive n'existe plus.</h1>
          <p className="state-copy">Le document a été déplacé, ou le signal s'est éteint en chemin.</p>
          <div className="policy-return"><Link className="outline-button" href="/">Retour aux archives</Link></div>
        </section>
      </main>
      <footer className="site-footer">
        <span className="footer-note">PROTOCOLE Z : ORIGINS // ARCHIVES</span>
        <span className="footer-note">FIN DE TRANSMISSION</span>
      </footer>
    </div>
  );
}
