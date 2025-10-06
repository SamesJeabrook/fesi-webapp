'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { useAuth0 } from '@auth0/auth0-react';

interface Merchant {
  id: string;
  business_name: string;
  name: string;
  email: string;
  phone: string;
  status: string;
  created_at: string;
}

interface AdminContextType {
  selectedMerchant: Merchant | null;
  setSelectedMerchant: (merchant: Merchant | null) => void;
  isImpersonating: boolean;
  isAdmin: boolean;
  clearImpersonation: () => void;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

interface AdminProviderProps {
  children: ReactNode;
}

export function AdminProvider({ children }: AdminProviderProps) {
  const { user } = useAuth0();
  const [selectedMerchant, setSelectedMerchant] = useState<Merchant | null>(null);

  // Check if user is admin (you might want to also check database role here)
  const userRoles = user?.['https://fesi.app/roles'] || [];
  const isAdmin = userRoles.includes('admin');

  const isImpersonating = isAdmin && selectedMerchant !== null;

  const clearImpersonation = () => {
    setSelectedMerchant(null);
  };

  return (
    <AdminContext.Provider
      value={{
        selectedMerchant,
        setSelectedMerchant,
        isImpersonating,
        isAdmin,
        clearImpersonation,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
}

export default AdminContext;