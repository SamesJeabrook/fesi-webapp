// Mock Service Worker setup for API mocking in Storybook and development

import { http, HttpResponse } from 'msw';
import { setupWorker } from 'msw/browser';
import { mockMerchants, mockMenuItems, mockCategories } from './data';
import type { Merchant, MenuCategory, MenuItem, Order, ApiResponse, PaginatedResponse } from '@/types';

// API handlers
export const handlers = [
  // Get merchants
  http.get('/api/merchants', ({ request }) => {
    const url = new URL(request.url);
    const search = url.searchParams.get('search');
    const cuisine = url.searchParams.get('cuisine');
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '10');
    
    let filteredMerchants = [...mockMerchants];
    
    if (search) {
      filteredMerchants = filteredMerchants.filter(merchant =>
        merchant.businessName.toLowerCase().includes(search.toLowerCase()) ||
        merchant.cuisine?.some(c => c.toLowerCase().includes(search.toLowerCase()))
      );
    }
    
    if (cuisine) {
      filteredMerchants = filteredMerchants.filter(merchant =>
        merchant.cuisine?.includes(cuisine)
      );
    }
    
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedMerchants = filteredMerchants.slice(startIndex, endIndex);
    
    const response: PaginatedResponse<Merchant> = {
      data: paginatedMerchants,
      success: true,
      pagination: {
        page,
        limit,
        total: filteredMerchants.length,
        totalPages: Math.ceil(filteredMerchants.length / limit)
      }
    };
    
    return HttpResponse.json(response, { status: 200 });
  }),

  // Get single merchant
  http.get('/api/merchants/:id', ({ params }) => {
    const { id } = params;
    const merchant = mockMerchants.find(m => m.id === id);
    
    if (!merchant) {
      return HttpResponse.json(
        { message: 'Merchant not found', success: false },
        { status: 404 }
      );
    }
    
    const response: ApiResponse<Merchant> = {
      data: merchant,
      success: true
    };
    
    return HttpResponse.json(response, { status: 200 });
  }),

  // Get merchant menu categories
  http.get('/api/merchants/:merchantId/menu/categories', ({ params }) => {
    const { merchantId } = params;
    
    const categories = mockCategories.filter(cat => cat.merchantId === merchantId);
    
    const response: ApiResponse<MenuCategory[]> = {
      data: categories,
      success: true
    };
    
    return HttpResponse.json(response, { status: 200 });
  }),

  // Get menu items for a category
  http.get('/api/merchants/:merchantId/menu/categories/:categoryId/items', ({ params }) => {
    const { merchantId, categoryId } = params;
    
    const items = mockMenuItems.filter(item => 
      item.merchantId === merchantId && item.categoryId === categoryId
    );
    
    const response: ApiResponse<MenuItem[]> = {
      data: items,
      success: true
    };
    
    return HttpResponse.json(response, { status: 200 });
  }),

  // Get all menu items for a merchant
  http.get('/api/merchants/:merchantId/menu/items', ({ params }) => {
    const { merchantId } = params;
    
    const items = mockMenuItems.filter(item => item.merchantId === merchantId);
    
    const response: ApiResponse<MenuItem[]> = {
      data: items,
      success: true
    };
    
    return HttpResponse.json(response, { status: 200 });
  }),

  // Create order
  http.post('/api/orders', async ({ request }) => {
    const orderData = await request.json() as any;
    
    // Simulate order creation
    const order: Order = {
      id: `order_${Date.now()}`,
      customerId: orderData.customerId,
      merchantId: orderData.merchantId,
      orderNumber: `#${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`,
      status: 'pending',
      items: orderData.items,
      subtotal: orderData.subtotal,
      deliveryFee: orderData.deliveryFee || 0,
      platformFee: orderData.platformFee || 0,
      total: orderData.total,
      currency: 'GBP',
      paymentStatus: 'pending',
      orderType: orderData.orderType,
      deliveryAddress: orderData.deliveryAddress,
      specialInstructions: orderData.specialInstructions,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    const response: ApiResponse<Order> = {
      data: order,
      success: true,
      message: 'Order created successfully'
    };
    
    return HttpResponse.json(response, { status: 201 });
  }),

  // Search endpoints
  http.get('/api/search/merchants', ({ request }) => {
    const url = new URL(request.url);
    const query = url.searchParams.get('q') || '';
    const results = mockMerchants.filter(merchant =>
      merchant.businessName.toLowerCase().includes(query.toLowerCase()) ||
      merchant.description?.toLowerCase().includes(query.toLowerCase()) ||
      merchant.cuisine?.some(c => c.toLowerCase().includes(query.toLowerCase()))
    );
    
    const response: ApiResponse<Merchant[]> = {
      data: results.slice(0, 10), // Limit search results
      success: true
    };
    
    return HttpResponse.json(response, { status: 200 });
  }),

  // Error simulation endpoints for testing
  http.get('/api/test/error', () => {
    return HttpResponse.json(
      { message: 'Internal server error', success: false },
      { status: 500 }
    );
  }),

  http.get('/api/test/slow', async () => {
    // Simulate slow response
    await new Promise(resolve => setTimeout(resolve, 3000));
    return HttpResponse.json(
      { data: { message: 'This was slow' }, success: true },
      { status: 200 }
    );
  })
];

// Setup worker for browser
export const worker = setupWorker(...handlers);

// Setup for Storybook
export const setupMocks = () => {
  if (typeof window !== 'undefined') {
    worker.start({
      onUnhandledRequest: 'bypass',
      serviceWorker: {
        url: '/mockServiceWorker.js'
      }
    });
  }
};
