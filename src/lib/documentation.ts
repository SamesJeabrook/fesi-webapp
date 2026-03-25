import { documentationNavGroups, documentationPages } from '@/content/documentation/registry';

export type {
  DocumentationAssetItem,
  DocumentationBlock,
  DocumentationNavGroup,
  DocumentationPage,
  DocumentationRouteItem,
  DocumentationStep,
  DocumentationTone,
} from '@/content/documentation/types';

export { documentationNavGroups, documentationPages };

export const documentationIndex = new Map(
  documentationPages.map((entry) => [entry.slug.join('/'), entry])
);

export function getDocumentationEntry(slug: string[] = []) {
  return documentationIndex.get(slug.join('/'));
}

export function hrefForDocumentation(slug: string[]) {
  return slug.length === 0 ? '/documentation' : `/documentation/${slug.join('/')}`;
}