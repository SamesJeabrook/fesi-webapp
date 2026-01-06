// Stock API Service
// Frontend service for stock management operations

import api from '@/utils/api';
import type {
  StockItem,
  StockTransaction,
  MenuItemStockRequirement,
  SubItemStockRequirement,
  StockAlert,
  StockSummary,
  MenuItemAvailability,
  CreateStockItemDTO,
  UpdateStockItemDTO,
  AdjustStockDTO,
  SetStockRequirementsDTO,
  BatchRestockDTO
} from '@/types/stock.types';

const stockAPI = {
  // Get all stock items for merchant
  async getStockItems(merchantId: string, includeInactive = false) {
    const response = await api.get<{
      success: boolean;
      stockItems: StockItem[];
      count: number;
    }>(`/api/stock/merchant/${merchantId}`, {
      params: { includeInactive }
    });
    return response.stockItems;
  },

  // Get single stock item
  async getStockItem(stockItemId: string) {
    const response = await api.get<{
      success: boolean;
      stockItem: StockItem;
    }>(`/api/stock/${stockItemId}`);
    return response.stockItem;
  },

  // Create new stock item
  async createStockItem(merchantId: string, data: CreateStockItemDTO) {
    const response = await api.post<{
      success: boolean;
      stockItem: StockItem;
      message: string;
    }>(`/api/stock/merchant/${merchantId}`, data);
    return response.stockItem;
  },

  // Update stock item
  async updateStockItem(stockItemId: string, data: UpdateStockItemDTO) {
    const response = await api.put<{
      success: boolean;
      stockItem: StockItem;
      message: string;
    }>(`/api/stock/${stockItemId}`, data);
    return response.stockItem;
  },

  // Adjust stock quantity
  async adjustStock(stockItemId: string, data: AdjustStockDTO) {
    const response = await api.post<{
      success: boolean;
      previousQuantity: number;
      newQuantity: number;
      quantityChange: number;
      message: string;
    }>(`/api/stock/${stockItemId}/adjust`, data);
    return response;
  },

  // Get transaction history
  async getTransactionHistory(stockItemId: string, limit = 50) {
    const response = await api.get<{
      success: boolean;
      transactions: StockTransaction[];
      count: number;
    }>(`/api/stock/${stockItemId}/transactions`, {
      params: { limit }
    });
    return response.transactions;
  },

  // Set menu item stock requirements
  async setMenuItemStockRequirements(menuItemId: string, data: SetStockRequirementsDTO) {
    const response = await api.post<{
      success: boolean;
      requirements: MenuItemStockRequirement[];
      message: string;
    }>(`/api/stock/menu-item/${menuItemId}/requirements`, data);
    return response.requirements;
  },

  // Get menu item stock requirements
  async getMenuItemStockRequirements(menuItemId: string) {
    const response = await api.get<{
      success: boolean;
      requirements: MenuItemStockRequirement[];
      count: number;
    }>(`/api/stock/menu-item/${menuItemId}/requirements`);
    return response.requirements;
  },

  // Set sub item stock requirements
  async setSubItemStockRequirements(subItemId: string, data: SetStockRequirementsDTO) {
    const response = await api.post<{
      success: boolean;
      requirements: SubItemStockRequirement[];
      message: string;
    }>(`/api/stock/sub-item/${subItemId}/requirements`, data);
    return response.requirements;
  },

  // Get sub item stock requirements
  async getSubItemStockRequirements(subItemId: string) {
    const response = await api.get<{
      success: boolean;
      requirements: SubItemStockRequirement[];
      count: number;
    }>(`/api/stock/sub-item/${subItemId}/requirements`);
    return response.requirements;
  },

  // Check menu item availability
  async checkMenuItemAvailability(menuItemId: string) {
    const response = await api.get<{
      success: boolean;
    } & MenuItemAvailability>(`/api/stock/menu-item/${menuItemId}/availability`);
    return {
      menu_item_id: response.menu_item_id,
      menu_item_name: response.menu_item_name,
      merchant_id: response.merchant_id,
      is_available: response.is_available,
      stock_requirements: response.stock_requirements || []
    };
  },

  // Get stock alerts
  async getStockAlerts(merchantId: string, includeAcknowledged = false) {
    const response = await api.get<{
      success: boolean;
      alerts: StockAlert[];
      count: number;
    }>(`/api/stock/merchant/${merchantId}/alerts`, {
      params: { includeAcknowledged }
    });
    return response.alerts;
  },

  // Acknowledge alert
  async acknowledgeAlert(alertId: string) {
    const response = await api.put<{
      success: boolean;
      alert: StockAlert;
      message: string;
    }>(`/api/stock/alerts/${alertId}/acknowledge`);
    return response.alert;
  },

  // Get low stock summary
  async getLowStockSummary(merchantId: string) {
    const response = await api.get<{
      success: boolean;
      summary: StockSummary;
    }>(`/api/stock/merchant/${merchantId}/summary`);
    return response.summary;
  },

  // Batch restock
  async batchRestock(merchantId: string, data: BatchRestockDTO) {
    const response = await api.post<{
      success: boolean;
      results: Array<{
        stockItemId: string;
        success: boolean;
        error?: string;
        previousQuantity?: number;
        newQuantity?: number;
        quantityChange?: number;
      }>;
      message: string;
    }>(`/api/stock/merchant/${merchantId}/batch-restock`, data);
    return response.results;
  }
};

export default stockAPI;
