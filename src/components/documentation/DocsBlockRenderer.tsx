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

  if (block.type === 'embed') {
    const getYouTubeVideoId = (url: string): string | null => {
      try {
        const parsed = new URL(url);
        const hostname = parsed.hostname.replace(/^www\./, '');
        if (hostname === 'youtu.be') {
          return parsed.pathname.slice(1);
        }

        if (
          hostname === 'youtube.com' ||
          hostname === 'm.youtube.com' ||
          hostname === 'youtube-nocookie.com'
        ) {
          if (parsed.pathname === '/watch') {
            return parsed.searchParams.get('v');
          }
          if (parsed.pathname.startsWith('/embed/') || parsed.pathname.startsWith('/shorts/')) {
            return parsed.pathname.split('/')[2];
          }
        }
      } catch {
        const legacyMatch = url.match(
          /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
        );
        return legacyMatch?.[1] ?? null;
      }
      return null;
    };

    const videoId = getYouTubeVideoId(block.embed.url);
    if (!videoId) {
      return (
        <article className={contentStyles.block}>
          <p className={contentStyles.paragraph}>Invalid YouTube URL: {block.embed.url}</p>
        </article>
      );
    }

    return (
      <article className={contentStyles.block}>
        {block.embed.title && (
          <h2 className={contentStyles.sectionTitle}>{block.embed.title}</h2>
        )}
        {block.embed.description && (
          <p className={contentStyles.paragraph}>{block.embed.description}</p>
        )}
        <div className={contentStyles.embedContainer}>
          <iframe
            width="560"
            height="315"
            src={`https://www.youtube.com/embed/${videoId}`}
            title={block.embed.title || 'YouTube video'}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
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