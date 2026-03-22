import './globals.css';
import AnimatedGradientText from '@/components/AnimatedGradientText';

export const metadata = {
  title: {
    default: process.env.NEXT_PUBLIC_SITE_NAME || 'AI Pulse',
    template: `%s | ${process.env.NEXT_PUBLIC_SITE_NAME || 'AI Pulse'}`,
  },
  description: process.env.NEXT_PUBLIC_SITE_DESCRIPTION || 'AI-generated insights on technology, machine learning, and the future.',
  icons: {
    icon: [{ url: '/favicon.svg', type: 'image/svg+xml' }],
    shortcut: '/favicon.svg',
  },
  openGraph: {
    type: 'website',
    siteName: process.env.NEXT_PUBLIC_SITE_NAME || 'AI Pulse',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="noise">
        <Nav />
        <main style={{ minHeight: '100vh', paddingTop: '72px' }}>
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}

function Nav() {
  const siteName = process.env.NEXT_PUBLIC_SITE_NAME || 'AI Pulse';
  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
      background: 'rgba(255, 255, 255, 0.85)', backdropFilter: 'blur(16px)',
      borderBottom: '1px solid var(--border)',
    }}>
      <div style={{
        maxWidth: 1100, margin: '0 auto', padding: '0 24px',
        height: 72, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <a href="/" style={{ display: 'flex', alignItems: 'center', gap: 2, textDecoration: 'none' }}>
          <img src="/logo.svg" alt="ZeroPress logo" style={{ width: 32, height: 32 }} />
          <span style={{
            fontWeight: 700, fontSize: '1.15rem', color: 'var(--text-primary)',
            letterSpacing: '-0.02em',
          }}>
            {siteName}
          </span>
        </a>
        <div style={{ display: 'flex', alignItems: 'center', gap: 28 }}>
          <a href="/" style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Home</a>
        </div>
      </div>
    </nav>
  );
}

function Footer() {
  return (
    <footer style={{
      borderTop: '1px solid var(--border)',
      padding: '20px 24px',
      color: 'var(--text-muted)',
      fontSize: '0.75rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
    }}>
      <p style={{ textAlign: 'center' }}>
        &copy; {new Date().getFullYear()} {process.env.NEXT_PUBLIC_SITE_NAME || 'AI Pulse'}
      </p>
      <div style={{
        position: 'absolute',
        right: 24,
        top: '50%',
        transform: 'translateY(-50%)',
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        fontSize: '0.7rem',
        fontWeight: 600,
        letterSpacing: '0.05em',
        background: 'var(--bg-secondary)',
        border: '1px solid var(--border)',
        borderRadius: 9999,
        padding: '4px 10px',
      }}>
        <div className="pulse-dot" style={{ width: 6, height: 6 }} />
        <AnimatedGradientText>AI-powered</AnimatedGradientText>
      </div>
    </footer>
  );
}
