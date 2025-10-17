// Sub-Items API Service
// Abstract API calls for sub-items management

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

// Utility function to get auth headers
const getAuthHeaders = async () => {
  // This will be injected by the component using Auth0
  const token = localStorage.getItem('auth_token') || '';
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };
};

// Admin API implementation - requires merchant ID
export class AdminSubItemsAPI implements SubItemsAPIInterface {
  private merchantId: string;
  private baseUrl: string;

  constructor(merchantId: string, baseUrl: string = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/sub-groups`) {
    this.merchantId = merchantId;
    this.baseUrl = baseUrl;
  }

  async getGroups(filters?: { selection_type?: string; is_required?: boolean }): Promise<SubItemGroup[]> {
    const params = new URLSearchParams({
      merchant_id: this.merchantId,
      ...(filters?.selection_type && { selection_type: filters.selection_type }),
      ...(filters?.is_required !== undefined && { is_required: filters.is_required.toString() })
    });
    
    const response = await fetch(`${this.baseUrl}?${params}`, {
      headers: await getAuthHeaders()
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch groups: ${response.statusText}`);
    }
    
    const result = await response.json();
    return result.data || [];
  }

  async getGroup(groupId: string): Promise<SubItemGroup> {
    const response = await fetch(`${this.baseUrl}/${groupId}`, {
      headers: await getAuthHeaders()
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch group: ${response.statusText}`);
    }
    
    const result = await response.json();
    return result.data;
  }

  async createGroup(data: CreateSubGroupData): Promise<SubItemGroup> {
    const response = await fetch(this.baseUrl, {
      method: 'POST',
      headers: await getAuthHeaders(),
      body: JSON.stringify({
        ...data,
        merchant_id: this.merchantId
      })
    });
    
    if (!response.ok) {
      throw new Error(`Failed to create group: ${response.statusText}`);
    }
    
    const result = await response.json();
    return result.data;
  }

  async updateGroup(groupId: string, data: UpdateSubGroupData): Promise<SubItemGroup> {
    const response = await fetch(`${this.baseUrl}/${groupId}`, {
      method: 'PUT',
      headers: await getAuthHeaders(),
      body: JSON.stringify(data)
    });
    
    if (!response.ok) {
      throw new Error(`Failed to update group: ${response.statusText}`);
    }
    
    const result = await response.json();
    return result.data;
  }

  async deleteGroup(groupId: string): Promise<void> {
    const response = await fetch(`${this.baseUrl}/${groupId}`, {
      method: 'DELETE',
      headers: await getAuthHeaders()
    });
    
    if (!response.ok) {
      throw new Error(`Failed to delete group: ${response.statusText}`);
    }
  }

  async createItem(groupId: string, data: CreateSubItemData): Promise<SubItem> {
    const response = await fetch(`${this.baseUrl}/${groupId}/items`, {
      method: 'POST',
      headers: await getAuthHeaders(),
      body: JSON.stringify(data)
    });
    
    if (!response.ok) {
      throw new Error(`Failed to create item: ${response.statusText}`);
    }
    
    const result = await response.json();
    return result.data;
  }

  async updateItem(itemId: string, data: UpdateSubItemData): Promise<SubItem> {
    const response = await fetch(`${this.baseUrl}/items/${itemId}`, {
      method: 'PUT',
      headers: await getAuthHeaders(),
      body: JSON.stringify(data)
    });
    
    if (!response.ok) {
      throw new Error(`Failed to update item: ${response.statusText}`);
    }
    
    const result = await response.json();
    return result.data;
  }

  async deleteItem(itemId: string): Promise<void> {
    const response = await fetch(`${this.baseUrl}/items/${itemId}`, {
      method: 'DELETE',
      headers: await getAuthHeaders()
    });
    
    if (!response.ok) {
      throw new Error(`Failed to delete item: ${response.statusText}`);
    }
  }
}

// Merchant API implementation - automatically scoped to merchant
export class MerchantSubItemsAPI implements SubItemsAPIInterface {
  private baseUrl: string;

  constructor(baseUrl: string = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/sub-groups/merchant`) {
    this.baseUrl = baseUrl;
  }

  async getGroups(filters?: { selection_type?: string; is_required?: boolean }): Promise<SubItemGroup[]> {
    const queryParams: Record<string, string> = {};
    if (filters?.selection_type) queryParams.selection_type = filters.selection_type;
    if (filters?.is_required !== undefined) queryParams.is_required = filters.is_required.toString();
    
    const params = new URLSearchParams(queryParams);
    const queryString = params.toString() ? `?${params}` : '';
    
    const response = await fetch(`${this.baseUrl}/groups${queryString}`, {
      headers: await getAuthHeaders()
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch groups: ${response.statusText}`);
    }
    
    const result = await response.json();
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
    const response = await fetch(`${this.baseUrl}/groups`, {
      method: 'POST',
      headers: await getAuthHeaders(),
      body: JSON.stringify(data)
    });
    
    if (!response.ok) {
      throw new Error(`Failed to create group: ${response.statusText}`);
    }
    
    const result = await response.json();
    return result.data;
  }

  async updateGroup(groupId: string, data: UpdateSubGroupData): Promise<SubItemGroup> {
    const response = await fetch(`${this.baseUrl}/groups/${groupId}`, {
      method: 'PUT',
      headers: await getAuthHeaders(),
      body: JSON.stringify(data)
    });
    
    if (!response.ok) {
      throw new Error(`Failed to update group: ${response.statusText}`);
    }
    
    const result = await response.json();
    return result.data;
  }

  async deleteGroup(groupId: string): Promise<void> {
    const response = await fetch(`${this.baseUrl}/groups/${groupId}`, {
      method: 'DELETE',
      headers: await getAuthHeaders()
    });
    
    if (!response.ok) {
      throw new Error(`Failed to delete group: ${response.statusText}`);
    }
  }

  async createItem(groupId: string, data: CreateSubItemData): Promise<SubItem> {
    const response = await fetch(`${this.baseUrl}/groups/${groupId}/items`, {
      method: 'POST',
      headers: await getAuthHeaders(),
      body: JSON.stringify(data)
    });
    
    if (!response.ok) {
      throw new Error(`Failed to create item: ${response.statusText}`);
    }
    
    const result = await response.json();
    return result.data;
  }

  async updateItem(itemId: string, data: UpdateSubItemData): Promise<SubItem> {
    const response = await fetch(`${this.baseUrl}/items/${itemId}`, {
      method: 'PUT',
      headers: await getAuthHeaders(),
      body: JSON.stringify(data)
    });
    
    if (!response.ok) {
      throw new Error(`Failed to update item: ${response.statusText}`);
    }
    
    const result = await response.json();
    return result.data;
  }

  async deleteItem(itemId: string): Promise<void> {
    const response = await fetch(`${this.baseUrl}/items/${itemId}`, {
      method: 'DELETE',
      headers: await getAuthHeaders()
    });
    
    if (!response.ok) {
      throw new Error(`Failed to delete item: ${response.statusText}`);
    }
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