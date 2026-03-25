import styles from '@/app/documentation/[[...slug]]/page.module.scss';

interface DocsHeroProps {
  title: string;
  summary: string;
  audience: string;
}

export function DocsHero({ title, summary, audience }: DocsHeroProps) {
  return (
    <header className={styles.hero}>
      <div className={styles.eyebrow}>Documentation</div>
      <h1 className={styles.title}>{title}</h1>
      <p className={styles.summary}>{summary}</p>
      <div className={styles.audience}>Audience: {audience}</div>
    </header>
  );
}