'use client';

import { useState } from 'react';
import Link from 'next/link';
import { documentationNavGroups, hrefForDocumentation, getDocumentationEntry } from '@/lib/documentation';
import styles from './DocsNavigation.module.scss';

type DocsNavigationProps = {
  currentSlug: string[];
};

export function DocsNavigation({ currentSlug }: DocsNavigationProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleLinkClick = () => {
    setIsOpen(false);
  };

  return (
    <>
      {/* Burger button - only visible on mobile */}
      <button
        className={styles.burgerButton}
        onClick={() => setIsOpen(!isOpen)}
        aria-label={isOpen ? 'Close menu' : 'Open menu'}
        aria-expanded={isOpen}
      >
        <span className={styles.burgerLine} />
        <span className={styles.burgerLine} />
        <span className={styles.burgerLine} />
      </button>

      {/* Mobile overlay backdrop */}
      {isOpen && (
        <div
          className={styles.backdrop}
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar nav */}
      <aside className={`${styles.sidebar} ${isOpen ? styles.sidebarOpen : ''}`.trim()}>
        <div className={styles.brand}>Fesi</div>
        <h2 className={styles.sidebarTitle}>Documentation</h2>

        {documentationNavGroups.map((group) => (
          <section key={group.title} className={styles.navSection}>
            <div className={styles.navHeading}>{group.title}</div>
            <ul className={styles.navList}>
              {group.slugs.map((groupSlug) => {
                const navEntry = getDocumentationEntry(groupSlug);
                if (!navEntry) {
                  return null;
                }

                const active = navEntry.slug.join('/') === currentSlug.join('/');

                return (
                  <li key={groupSlug.join('/') || 'root'}>
                    <Link
                      href={hrefForDocumentation(navEntry.slug)}
                      className={`${styles.navLink} ${active ? styles.navLinkActive : ''}`.trim()}
                      onClick={handleLinkClick}
                    >
                      {navEntry.title}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </section>
        ))}
      </aside>
    </>
  );
}
