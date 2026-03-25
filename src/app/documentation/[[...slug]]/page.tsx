import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  documentationNavGroups,
  documentationPages,
  hrefForDocumentation,
  getDocumentationEntry,
} from '@/lib/documentation';
import { DocsBlockRenderer } from '@/components/documentation/DocsBlockRenderer';
import { DocsHero } from '@/components/documentation/DocsHero';
import styles from './page.module.scss';

export function generateStaticParams() {
  return documentationPages.map((entry) => ({
    slug: entry.slug,
  }));
}

type PageProps = {
  params: Promise<{ slug?: string[] }>;
};

export default async function DocumentationPage({ params }: PageProps) {
  const { slug = [] } = await params;
  const entry = getDocumentationEntry(slug);

  if (!entry) {
    notFound();
  }

  return (
    <main className={styles.page}>
      <div className={styles.shell}>
        <aside className={styles.sidebar}>
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

                  const active = navEntry.slug.join('/') === entry.slug.join('/');

                  return (
                    <li key={groupSlug.join('/') || 'root'}>
                      <Link
                        href={hrefForDocumentation(navEntry.slug)}
                        className={`${styles.navLink} ${active ? styles.navLinkActive : ''}`.trim()}
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

        <section className={styles.content}>
          <DocsHero title={entry.title} summary={entry.summary} audience={entry.audience} />

          {entry.blocks.map((block) => (
            <DocsBlockRenderer key={`${entry.slug.join('/')}-${block.title}`} block={block} />
          ))}

          {entry.related.length > 0 ? (
            <section className={styles.card}>
              <h2 className={styles.sectionTitle}>Related Pages</h2>
              <div className={styles.relatedGrid}>
                {entry.related.map((relatedSlug) => {
                  const relatedEntry = getDocumentationEntry(relatedSlug);
                  if (!relatedEntry) {
                    return null;
                  }

                  return (
                    <Link
                      key={relatedSlug.join('/')}
                      href={hrefForDocumentation(relatedEntry.slug)}
                      className={styles.relatedCard}
                    >
                      <div className={styles.relatedTitle}>{relatedEntry.title}</div>
                      <div className={styles.relatedSummary}>{relatedEntry.summary}</div>
                    </Link>
                  );
                })}
              </div>
            </section>
          ) : null}
        </section>
      </div>
    </main>
  );
}