'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import SearchBar from './SearchBar';

const LINKS = [
  { href: '/', label: 'Latest' },
  { href: '/about', label: 'About' },
];

function isActive(pathname, href) {
  return pathname === href || (href !== '/' && pathname.startsWith(`${href}/`));
}

/**
 * Desktop link row (unchanged position/markup) plus a mobile menu — the nav
 * links previously just vanished below 760px (display:none, no fallback),
 * leaving mobile visitors with no way to reach /about at all. Also wires up
 * the active-page state: .zp-nav__link--active already existed in
 * globals.css but nothing ever applied it.
 */
export default function NavLinks() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="zp-nav__links">
        {LINKS.map((link) => {
          const active = isActive(pathname, link.href);
          return (
            <a
              key={link.href}
              href={link.href}
              aria-current={active ? 'page' : undefined}
              className={`zp-nav__link${active ? ' zp-nav__link--active' : ''}`}
            >
              {link.label}
            </a>
          );
        })}
        <SearchBar />
      </div>

      <button
        type="button"
        className="zp-nav__toggle"
        aria-expanded={open}
        aria-controls="zp-mobile-nav"
        aria-label={open ? 'Close menu' : 'Open menu'}
        onClick={() => setOpen((v) => !v)}
      >
        <span className="zp-nav__toggle-bar" />
        <span className="zp-nav__toggle-bar" />
        <span className="zp-nav__toggle-bar" />
      </button>

      {open && (
        <div id="zp-mobile-nav" className="zp-mobile-nav" role="menu" aria-label="Main">
          {LINKS.map((link) => {
            const active = isActive(pathname, link.href);
            return (
              <a
                key={link.href}
                href={link.href}
                role="menuitem"
                aria-current={active ? 'page' : undefined}
                className={`zp-mobile-nav__link${active ? ' zp-mobile-nav__link--active' : ''}`}
                onClick={() => setOpen(false)}
              >
                {link.label}
              </a>
            );
          })}
        </div>
      )}
    </>
  );
}
