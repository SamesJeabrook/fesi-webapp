'use client';

import React, { useState, useEffect } from 'react';
import stockAPI from '@/services/stockAPI';
import type { StockItem, StockAlert, StockSummary } from '@/types/stock.types';
import { 
  StockSummaryGrid, 
  StockAlertsList, 
  StockFilterToolbar,
  StockItemRow,
  StockItemFormModal,
  AdjustStockModal,
  StockSearchSortToolbar
} from '@/components/molecules';
import type { StockItemFormData, AdjustStockFormData } from '@/components/molecules';
import type { SortField, SortDirection } from '@/components/molecules/StockSearchSortToolbar';
import styles from './StockManagement.module.scss';
import type { StockManagementProps } from './StockManagement.types';
import type { FilterType } from '@/components/molecules/StockFilterToolbar';

export const StockManagement: React.FC<StockManagementProps> = ({ merchantId }) => {
  const [stockItems, setStockItems] = useState<StockItem[]>([]);
  const [alerts, setAlerts] = useState<StockAlert[]>([]);
  const [summary, setSummary] = useState<StockSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAdjustModal, setShowAdjustModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<StockItem | null>(null);
  const [filter, setFilter] = useState<FilterType>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState<SortField>('name');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, [merchantId]);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const [items, alertsList, summaryData] = await Promise.all([
        stockAPI.getStockItems(merchantId),
        stockAPI.getStockAlerts(merchantId),
        stockAPI.getLowStockSummary(merchantId)
      ]);
      setStockItems(items);
      setAlerts(alertsList);
      setSummary(summaryData);
    } catch (error) {
      console.error('Error loading stock data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDismissAlert = async (alertId: string) => {
    await stockAPI.acknowledgeAlert(alertId);
    loadData();
  };

  const handleFilterChange = (newFilter: FilterType) => {
    setFilter(newFilter);
  };

  const handleAddClick = () => {
    setShowCreateModal(true);
  };

  const handleAdjust = (item: StockItem) => {
    setSelectedItem(item);
    setShowAdjustModal(true);
  };

  const handleEdit = (item: StockItem) => {
    setSelectedItem(item);
    setShowEditModal(true);
  };

  const handleCreateStock = async (data: StockItemFormData) => {
    await stockAPI.createStockItem(merchantId, data);
    await loadData();
  };

  const handleUpdateStock = async (data: StockItemFormData) => {
    if (!selectedItem) return;
    await stockAPI.updateStockItem(selectedItem.id, data);
    await loadData();
  };

  const handleAdjustStock = async (data: AdjustStockFormData) => {
    if (!selectedItem) return;
    await stockAPI.adjustStock(selectedItem.id, data);
    await loadData();
  };

  // Get unique categories from stock items
  const uniqueCategories = Array.from(
    new Set(stockItems.filter(item => item.category).map(item => item.category!))
  ).sort();

  // Handle sort field changes (toggle direction if same field)
  const handleSortChange = (field: SortField) => {
    if (field === sortField) {
      setSortDirection((prev: SortDirection) => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Filter, search, and sort items
  const filteredItems = stockItems
    .filter(item => {
      // Status filter
      if (filter === 'low' && item.stock_status !== 'low_stock') return false;
      if (filter === 'out' && item.stock_status !== 'out_of_stock') return false;
      
      // Category filter
      if (selectedCategoryFilter && item.category !== selectedCategoryFilter) return false;
      
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesName = item.name.toLowerCase().includes(query);
        const matchesDescription = item.description?.toLowerCase().includes(query);
        const matchesCategory = item.category?.toLowerCase().includes(query);
        const matchesSupplier = item.supplier?.toLowerCase().includes(query);
        
        if (!matchesName && !matchesDescription && !matchesCategory && !matchesSupplier) {
          return false;
        }
      }
      
      return true;
    })
    .sort((a, b) => {
      let comparison = 0;
      
      switch (sortField) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'category':
          const catA = a.category || '';
          const catB = b.category || '';
          comparison = catA.localeCompare(catB);
          break;
        case 'quantity':
          comparison = a.current_quantity - b.current_quantity;
          break;
        case 'status':
          const statusOrder: Record<string, number> = { out_of_stock: 0, low_stock: 1, in_stock: 2 };
          const statusA = statusOrder[a.stock_status || 'in_stock'];
          const statusB = statusOrder[b.stock_status || 'in_stock'];
          comparison = statusA - statusB;
          break;
      }
      
      return sortDirection === 'asc' ? comparison : -comparison;
    });

  if (isLoading) {
    return (
      <div className={styles.loading}>
        <div className={styles.loading__spinner} />
        <p className={styles.loading__text}>Loading stock data...</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* Summary Grid */}
      {summary && <StockSummaryGrid summary={summary} />}

      {/* Alerts */}
      <StockAlertsList 
        alerts={alerts}
        onDismiss={handleDismissAlert}
      />

      {/* Filter Toolbar */}
      <StockFilterToolbar
        currentFilter={filter}
        onFilterChange={handleFilterChange}
        counts={{
          all: stockItems.length,
          low: summary?.low_stock_count || 0,
          out: summary?.out_of_stock_count || 0,
        }}
        onAddClick={handleAddClick}
      />

      {/* Search and Sort Toolbar */}
      <StockSearchSortToolbar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        sortField={sortField}
        sortDirection={sortDirection}
        onSortChange={handleSortChange}
        categories={uniqueCategories}
        selectedCategory={selectedCategoryFilter}
        onCategoryFilter={setSelectedCategoryFilter}
      />

      {/* Stock Items Table */}
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead className={styles.table__head}>
            <tr>
              <th className={styles.table__header}>Status</th>
              <th className={styles.table__header}>Item Name</th>
              <th className={styles.table__header}>Category</th>
              <th className={styles.table__header}>Current Stock</th>
              <th className={styles.table__header}>Threshold</th>
              <th className={styles.table__header}>Unit</th>
              <th className={styles.table__header}>Stock Level</th>
              <th className={`${styles.table__header} ${styles['table__header--actions']}`}>
                Actions
              </th>
            </tr>
          </thead>
          <tbody className={styles.table__body}>
            {filteredItems.length === 0 ? (
              <tr>
                <td colSpan={8} className={styles.table__empty}>
                  {searchQuery || selectedCategoryFilter
                    ? 'No items match your search or filters.'
                    : filter === 'all' 
                      ? 'No stock items yet. Add your first item to get started!' 
                      : 'No items match this filter.'}
                </td>
              </tr>
            ) : (
              filteredItems.map(item => (
                <StockItemRow
                  key={item.id}
                  item={item}
                  onAdjust={handleAdjust}
                  onEdit={handleEdit}
                />
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Info Banner */}
      <div className={styles.infoBanner}>
        <h4 className={styles.infoBanner__title}>💡 Pro Tip</h4>
        <p className={styles.infoBanner__text}>
          Stock automatically decrements when orders are placed and restores when orders are cancelled. 
          Set appropriate thresholds to get alerts before running out!
        </p>
      </div>

      {/* Modals */}
      <StockItemFormModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSubmit={handleCreateStock}
        mode="create"
        existingCategories={uniqueCategories}
      />

      {selectedItem && (
        <>
          <StockItemFormModal
            isOpen={showEditModal}
            onClose={() => {
              setShowEditModal(false);
              setSelectedItem(null);
            }}
            onSubmit={handleUpdateStock}
            initialData={selectedItem}
            mode="edit"
            existingCategories={uniqueCategories}
          />

          <AdjustStockModal
            isOpen={showAdjustModal}
            onClose={() => {
              setShowAdjustModal(false);
              setSelectedItem(null);
            }}
            onSubmit={handleAdjustStock}
            stockItem={selectedItem}
          />
        </>
      )}
    </div>
  );
};

export default StockManagement;
