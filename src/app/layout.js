import './globals.css';
import SearchModal from '@/components/SearchModal';

export const metadata = {
  title: {
    default: process.env.NEXT_PUBLIC_SITE_NAME || 'ZeroPress',
    template: `%s | ${process.env.NEXT_PUBLIC_SITE_NAME || 'ZeroPress'}`,
  },
  description: process.env.NEXT_PUBLIC_SITE_DESCRIPTION || 'Deep dives, field notes, and honest analysis on models, inference, and the craft of building with AI.',
  icons: {
    icon: [{ url: '/favicon.svg', type: 'image/svg+xml' }],
    shortcut: '/favicon.svg',
  },
  openGraph: {
    type: 'website',
    siteName: process.env.NEXT_PUBLIC_SITE_NAME || 'ZeroPress',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Nav />
        <main style={{ paddingTop: 66 }}>
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}

function Nav() {
  return (
    <nav className="zp-nav">
      <div className="zp-nav__inner">
        {/* Logo */}
        <a className="zp-logo" href="/">
          <img src="/logo.svg" alt="ZeroPress" className="zp-logo__img" />
          <span className="zp-logo__word">Zero<b>Press</b></span>
        </a>

        {/* Links */}
        <div className="zp-nav__links">
          <a className="zp-nav__link" href="/">Latest</a>
          <a className="zp-nav__link" href="/about">About</a>
        </div>

        {/* Right side */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span className="ai-badge">
            <span className="dot" />
            AI&nbsp;pipeline
          </span>
          <SearchModal />
        </div>
      </div>
    </nav>
  );
}

function Footer() {
  const siteName = process.env.NEXT_PUBLIC_SITE_NAME || 'ZeroPress';
  return (
    <footer className="zp-footer">
      <div className="zp-footer__inner">
        {/* About col */}
        <div className="zp-footer__col" style={{ maxWidth: 300 }}>
          <a className="zp-logo" href="/" style={{ marginBottom: 4 }}>
            <img src="/logo.svg" alt="ZeroPress" className="zp-logo__img" />
            <span className="zp-logo__word">Zero<b>Press</b></span>
          </a>
          <p style={{ color: 'var(--ink-2)', fontSize: '0.86rem', lineHeight: 1.6 }}>
            Notes on machine learning, inference, and the craft of shipping AI products.
            Researched, drafted, and published by an automated pipeline — edited for taste.
          </p>
          <span className="ai-badge" style={{ marginTop: 6, alignSelf: 'flex-start' }}>
            <span className="dot" />
            Published by an AI pipeline
          </span>
        </div>

        {/* Sections */}
        <div className="zp-footer__col">
          <span className="eyebrow" style={{ marginBottom: 4 }}>Sections</span>
          <a href="/">Latest</a>
          <a href="/about">About</a>
        </div>

        {/* Pipeline */}
        <div className="zp-footer__col">
          <span className="eyebrow" style={{ marginBottom: 4 }}>Pipeline</span>
          <a href="/about">How posts are made</a>
          <a href="/about#editorial">Editorial policy</a>
          <a href="/rss.xml">RSS feed</a>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="wrap" style={{
        paddingTop: 18, paddingBottom: 26,
        borderTop: '1px solid var(--line)',
        display: 'flex', justifyContent: 'space-between',
        gap: 12, flexWrap: 'wrap',
      }}>
        <span style={{ fontSize: '0.78rem', color: 'var(--ink-3)' }}>
          © {new Date().getFullYear()} {siteName}
        </span>
        <span style={{ fontSize: '0.78rem', color: 'var(--ink-3)' }}>
          Built on Next.js · Supabase · Vercel
        </span>
      </div>
    </footer>
  );
}
