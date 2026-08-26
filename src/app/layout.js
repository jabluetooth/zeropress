import './globals.css';
import NavLinks from '@/components/NavLinks';

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

        {/* Links + search */}
        <NavLinks />
      </div>
    </nav>
  );
}

const FOOTER_SOCIAL_LINKS = [
  { label: 'GitHub', href: 'https://github.com/jabluetooth', Icon: GitHubIcon },
  { label: 'LinkedIn', href: 'https://ph.linkedin.com/in/filheinzrelatorre', Icon: LinkedInIcon },
  { label: 'Instagram', href: 'https://www.instagram.com/fil.tower', Icon: InstagramIcon },
  { label: 'Portfolio', href: 'https://www.filheinzrelatorre.com/', Icon: PortfolioIcon },
];

/**
 * Same two-panel format as this account's other projects (Insight, Bonny
 * AI, Mimo): an accent brand panel plus a surface links panel, both rounded
 * on the top corners only and flush at the bottom instead of floating as
 * closed rectangles — built against ZeroPress's own paper/ink/emerald
 * tokens rather than copied wholesale. The logo mark's stroke is hardcoded
 * black (not currentColor), so the brand panel uses a text-only wordmark
 * instead of risking low contrast against the accent-green background.
 */
function Footer() {
  const siteName = process.env.NEXT_PUBLIC_SITE_NAME || 'ZeroPress';
  const year = new Date().getFullYear();

  return (
    <footer className="zp-footer">
      <div className="zp-footer__inner">
        <div className="zp-footer__brand">
          <span className="zp-footer__wordmark">Zero<b>Press</b></span>

          <div className="zp-footer__brand-foot">
            <p className="zp-footer__tagline">
              Field notes on models, inference, and shipping AI products.
            </p>
            <span className="ai-badge zp-footer__badge">
              <span className="dot" />
              AI&nbsp;pipeline
            </span>
            <div className="zp-footer__icon-row">
              {FOOTER_SOCIAL_LINKS.map(({ label, href, Icon }) => (
                <a
                  key={href}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="zp-footer__icon-link"
                >
                  <Icon />
                </a>
              ))}
            </div>
            <p className="zp-footer__copyright">
              &copy; {year} {siteName} by Fil Heinz Re La Torre
            </p>
          </div>
        </div>

        <nav aria-label="Footer" className="zp-footer__links">
          <div className="zp-footer__col">
            <span className="zp-footer__col-title">Sections</span>
            <a href="/">Latest</a>
            <a href="/about">About</a>
          </div>

          <div className="zp-footer__col">
            <span className="zp-footer__col-title">Pipeline</span>
            <a href="/about">How posts are made</a>
            <a href="/about#editorial">Editorial policy</a>
            <a href="/rss.xml">RSS feed</a>
          </div>
        </nav>
      </div>
    </footer>
  );
}

function GitHubIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 16 16" width="18" height="18" fill="currentColor">
      <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8Z" />
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
      <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.94v5.67H9.34V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.38-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12ZM7.12 20.45H3.56V9h3.56v11.45Z" />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.6">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4.2" />
      <circle cx="17.4" cy="6.6" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function PortfolioIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.6">
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3c2.4 2.4 3.6 5.4 3.6 9s-1.2 6.6-3.6 9c-2.4-2.4-3.6-5.4-3.6-9s1.2-6.6 3.6-9Z" />
    </svg>
  );
}
