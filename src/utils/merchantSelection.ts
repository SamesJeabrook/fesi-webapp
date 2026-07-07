/**
 * Merchant Selection Utilities
 * Helper functions for multi-outlet merchant management
 */

/**
 * Get the currently selected merchant ID from localStorage
 * Falls back to first merchant ID from user's merchant_ids array
 * 
 * @param user - Auth0 user object
 * @returns Current merchant ID or null
 */
export function getCurrentMerchantId(user: any): string | null {
  // Check localStorage for selected merchant
  const storedMerchantId = localStorage.getItem('currentMerchantId');
  
  // Get merchant IDs from user token
  const merchantIds = user?.['https://fesi.app/merchant_ids'] || [];
  
  // If stored merchant ID is valid (exists in user's merchant_ids), use it
  if (storedMerchantId && merchantIds.includes(storedMerchantId)) {
    return storedMerchantId;
  }
  
  // Otherwise, use first merchant ID and store it
  if (merchantIds.length > 0) {
    const firstMerchantId = merchantIds[0];
    localStorage.setItem('currentMerchantId', firstMerchantId);
    return firstMerchantId;
  }
  
  return null;
}

/**
 * Set the currently selected merchant ID in localStorage
 * 
 * @param merchantId - Merchant ID to set as current
 */
export function setCurrentMerchantId(merchantId: string): void {
  localStorage.setItem('currentMerchantId', merchantId);
}

/**
 * Clear the currently selected merchant ID from localStorage
 */
export function clearCurrentMerchantId(): void {
  localStorage.removeItem('currentMerchantId');
}

/**
 * Get all merchant IDs for the current user
 * 
 * @param user - Auth0 user object
 * @returns Array of merchant IDs
 */
export function getAllMerchantIds(user: any): string[] {
  return user?.['https://fesi.app/merchant_ids'] || [];
}

/**
 * Check if user has multiple merchants
 * 
 * @param user - Auth0 user object
 * @returns Boolean indicating if user has multiple outlets
 */
export function hasMultipleOutlets(user: any): boolean {
  const merchantIds = getAllMerchantIds(user);
  return merchantIds.length > 1;
}
