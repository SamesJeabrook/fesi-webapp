export type DocumentationTone = 'info' | 'warning' | 'success';

export interface DocumentationStep {
  title: string;
  description: string;
}

export interface DocumentationRouteItem {
  path: string;
  description: string;
}

export interface DocumentationAssetItem {
  name: string;
  description: string;
}

export type DocumentationBlock =
  | {
      type: 'section';
      title: string;
      paragraphs?: string[];
      bullets?: string[];
    }
  | {
      type: 'steps';
      title: string;
      steps: DocumentationStep[];
    }
  | {
      type: 'routes';
      title: string;
      routes: DocumentationRouteItem[];
    }
  | {
      type: 'callout';
      tone: DocumentationTone;
      title: string;
      paragraphs: string[];
    }
  | {
      type: 'assets';
      title: string;
      assets: DocumentationAssetItem[];
    };

export interface DocumentationPage {
  slug: string[];
  title: string;
  summary: string;
  audience: string;
  category: 'overview' | 'merchant-admin' | 'mobile-pos' | 'quick-start';
  blocks: DocumentationBlock[];
  related: string[][];
}

export interface DocumentationNavGroup {
  title: string;
  slugs: string[][];
}