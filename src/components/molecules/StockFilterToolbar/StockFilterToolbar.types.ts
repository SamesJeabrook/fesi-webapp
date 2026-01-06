export type FilterType = 'all' | 'low' | 'out';

export interface StockFilterToolbarProps {
  currentFilter: FilterType;
  onFilterChange: (filter: FilterType) => void;
  counts: {
    all: number;
    low: number;
    out: number;
  };
  onAddClick: () => void;
  className?: string;
}
