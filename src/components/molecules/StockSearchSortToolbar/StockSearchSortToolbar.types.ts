export type SortField = 'name' | 'category' | 'quantity' | 'status';
export type SortDirection = 'asc' | 'desc';

export interface StockSearchSortToolbarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  sortField: SortField;
  sortDirection: SortDirection;
  onSortChange: (field: SortField) => void;
  categories: string[];
  selectedCategory: string | null;
  onCategoryFilter: (category: string | null) => void;
}
