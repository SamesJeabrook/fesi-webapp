// Sub-Items API Service
// Abstract API calls for sub-items management

import api from '@/utils/api';

export interface SubItem {
  id: string;
  name: string;
  additional_price: number;
  display_order: number;
  is_active: boolean;
  group_id: string;
  created_at: string;
}

export interface SubItemGroup {
  id: string;
  name: string;
  selection_type: 'single' | 'multiple';
  is_required: boolean;
  max_selections?: number;
  display_order: number;
  merchant_id: string;
  merchant_name?: string;
  item_count: number;
  menu_item_count: number;
  sub_items: SubItem[];
  created_at: string;
}

export interface CreateSubGroupData {
  name: string;
  selection_type: 'single' | 'multiple';
  is_required: boolean;
  max_selections?: number;
  display_order?: number;
  description?: string;
}

export interface UpdateSubGroupData extends Partial<CreateSubGroupData> {
  expected_version?: number;
}

export interface CreateSubItemData {
  name: string;
  additional_price: number;
  display_order?: number;
  is_active?: boolean;
}

export interface UpdateSubItemData extends Partial<CreateSubItemData> {
  expected_version?: number;
}

// Base API interface that both admin and merchant APIs will implement
export interface SubItemsAPIInterface {
  // Groups
  getGroups(filters?: { selection_type?: string; is_required?: boolean }): Promise<SubItemGroup[]>;
  getGroup(groupId: string): Promise<SubItemGroup>;
  createGroup(data: CreateSubGroupData): Promise<SubItemGroup>;
  updateGroup(groupId: string, data: UpdateSubGroupData): Promise<SubItemGroup>;
  deleteGroup(groupId: string): Promise<void>;
  
  // Items
  createItem(groupId: string, data: CreateSubItemData): Promise<SubItem>;
  updateItem(itemId: string, data: UpdateSubItemData): Promise<SubItem>;
  deleteItem(itemId: string): Promise<void>;
}

// Admin API implementation - requires merchant ID
export class AdminSubItemsAPI implements SubItemsAPIInterface {
  private merchantId: string;

  constructor(merchantId: string) {
    this.merchantId = merchantId;
  }

  async getGroups(filters?: { selection_type?: string; is_required?: boolean }): Promise<SubItemGroup[]> {
    const params = new URLSearchParams({
      merchant_id: this.merchantId,
      ...(filters?.selection_type && { selection_type: filters.selection_type }),
      ...(filters?.is_required !== undefined && { is_required: filters.is_required.toString() })
    });
    
    const result = await api.get(`/api/sub-groups?${params}`);
    return result.data || [];
  }

  async getGroup(groupId: string): Promise<SubItemGroup> {
    const result = await api.get(`/api/sub-groups/${groupId}`);
    return result.data;
  }

  async createGroup(data: CreateSubGroupData): Promise<SubItemGroup> {
    const result = await api.post(`/api/sub-groups`, {
      ...data,
      merchant_id: this.merchantId
    });
    return result.data;
  }

  async updateGroup(groupId: string, data: UpdateSubGroupData): Promise<SubItemGroup> {
    const result = await api.put(`/api/sub-groups/${groupId}`, data);
    return result.data;
  }

  async deleteGroup(groupId: string): Promise<void> {
    await api.delete(`/api/sub-groups/${groupId}`);
  }

  async createItem(groupId: string, data: CreateSubItemData): Promise<SubItem> {
    const result = await api.post(`/api/sub-groups/${groupId}/items`, data);
    return result.data;
  }

  async updateItem(itemId: string, data: UpdateSubItemData): Promise<SubItem> {
    const result = await api.put(`/api/sub-groups/items/${itemId}`, data);
    return result.data;
  }

  async deleteItem(itemId: string): Promise<void> {
    await api.delete(`/api/sub-groups/items/${itemId}`);
  }
}

// Merchant API implementation - automatically scoped to merchant
export class MerchantSubItemsAPI implements SubItemsAPIInterface {
  async getGroups(filters?: { selection_type?: string; is_required?: boolean }): Promise<SubItemGroup[]> {
    const queryParams: Record<string, string> = {};
    if (filters?.selection_type) queryParams.selection_type = filters.selection_type;
    if (filters?.is_required !== undefined) queryParams.is_required = filters.is_required.toString();
    
    const params = new URLSearchParams(queryParams);
    const queryString = params.toString() ? `?${params}` : '';
    
    const result = await api.get(`/api/sub-groups/merchant/groups${queryString}`);
    return result.data || [];
  }

  async getGroup(groupId: string): Promise<SubItemGroup> {
    // For merchant API, we get the group through the groups list and find it
    const groups = await this.getGroups();
    const group = groups.find(g => g.id === groupId);
    
    if (!group) {
      throw new Error('Group not found');
    }
    
    return group;
  }

  async createGroup(data: CreateSubGroupData): Promise<SubItemGroup> {
    const result = await api.post(`/api/sub-groups/merchant/groups`, data);
    return result.data;
  }

  async updateGroup(groupId: string, data: UpdateSubGroupData): Promise<SubItemGroup> {
    const result = await api.put(`/api/sub-groups/merchant/groups/${groupId}`, data);
    return result.data;
  }

  async deleteGroup(groupId: string): Promise<void> {
    await api.delete(`/api/sub-groups/merchant/groups/${groupId}`);
  }

  async createItem(groupId: string, data: CreateSubItemData): Promise<SubItem> {
    const result = await api.post(`/api/sub-groups/merchant/groups/${groupId}/items`, data);
    return result.data;
  }

  async updateItem(itemId: string, data: UpdateSubItemData): Promise<SubItem> {
    const result = await api.put(`/api/sub-groups/merchant/items/${itemId}`, data);
    return result.data;
  }

  async deleteItem(itemId: string): Promise<void> {
    await api.delete(`/api/sub-groups/merchant/items/${itemId}`);
  }
}

// Factory function to create the appropriate API instance
export const createSubItemsAPI = (context: 'admin' | 'merchant', merchantId?: string): SubItemsAPIInterface => {
  if (context === 'admin') {
    if (!merchantId) {
      throw new Error('Merchant ID is required for admin context');
    }
    return new AdminSubItemsAPI(merchantId);
  } else {
    return new MerchantSubItemsAPI();
  }
};