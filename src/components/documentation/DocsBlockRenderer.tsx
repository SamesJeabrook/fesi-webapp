import type { DocumentationBlock } from '@/content/documentation/types';
import contentStyles from './DocsContent.module.scss';

interface DocsBlockRendererProps {
  block: DocumentationBlock;
}

export function DocsBlockRenderer({ block }: DocsBlockRendererProps) {
  if (block.type === 'section') {
    return (
      <article className={contentStyles.block}>
        <h2 className={contentStyles.sectionTitle}>{block.title}</h2>
        {block.paragraphs?.map((paragraph) => (
          <p key={paragraph} className={contentStyles.paragraph}>
            {paragraph}
          </p>
        ))}
        {block.bullets?.length ? (
          <ul className={contentStyles.list}>
            {block.bullets.map((bullet) => (
              <li key={bullet}>{bullet}</li>
            ))}
          </ul>
        ) : null}
      </article>
    );
  }

  if (block.type === 'steps') {
    return (
      <article className={contentStyles.block}>
        <h2 className={contentStyles.sectionTitle}>{block.title}</h2>
        <div className={contentStyles.steps}>
          {block.steps.map((step) => (
            <div key={step.title} className={contentStyles.step}>
              <div className={contentStyles.stepTitle}>{step.title}</div>
              <div className={contentStyles.routeDescription}>{step.description}</div>
            </div>
          ))}
        </div>
      </article>
    );
  }

  if (block.type === 'routes') {
    return (
      <article className={contentStyles.block}>
        <h2 className={contentStyles.sectionTitle}>{block.title}</h2>
        <div className={contentStyles.routeGrid}>
          {block.routes.map((route) => (
            <div key={route.path} className={contentStyles.routeItem}>
              <div className={contentStyles.routePath}>{route.path}</div>
              <div className={contentStyles.routeDescription}>{route.description}</div>
            </div>
          ))}
        </div>
      </article>
    );
  }

  if (block.type === 'assets') {
    return (
      <article className={contentStyles.block}>
        <h2 className={contentStyles.sectionTitle}>{block.title}</h2>
        <div className={contentStyles.assetGrid}>
          {block.assets.map((asset) => (
            <div key={asset.name} className={contentStyles.assetItem}>
              <div className={contentStyles.assetName}>{asset.name}</div>
              <div className={contentStyles.assetDescription}>{asset.description}</div>
            </div>
          ))}
        </div>
      </article>
    );
  }

  const toneClass =
    block.tone === 'warning'
      ? contentStyles.calloutWarning
      : block.tone === 'success'
        ? contentStyles.calloutSuccess
        : contentStyles.calloutInfo;

  return (
    <article className={contentStyles.block}>
      <div className={`${contentStyles.callout} ${toneClass}`.trim()}>
        <h2 className={contentStyles.sectionTitle}>{block.title}</h2>
        {block.paragraphs.map((paragraph) => (
          <p key={paragraph} className={contentStyles.paragraph}>
            {paragraph}
          </p>
        ))}
      </div>
    </article>
  );
}