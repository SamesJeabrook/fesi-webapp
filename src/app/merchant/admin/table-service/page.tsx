'use client';

import { useState, useEffect } from 'react';
import { useMerchant } from '@/hooks/useMerchant';
import { TableServiceTemplate } from '@/components/templates';
import { StaffPinLogin } from '@/components/organisms';
import { type StaffMember } from '@/components/organisms/StaffPinLogin/StaffPinLogin.component';
import ProtectedRoute from '@/components/auth/ProtectedRoute';

export default function TableServicePage() {
  const { merchant } = useMerchant();
  const [currentStaff, setCurrentStaff] = useState<StaffMember | null>(null);

  // Check session storage for existing staff login
  useEffect(() => {
    const savedStaff = sessionStorage.getItem('currentStaff');
    if (savedStaff) {
      setCurrentStaff(JSON.parse(savedStaff));
    }
  }, []);

  const handleStaffLogin = (staff: StaffMember) => {
    setCurrentStaff(staff);
    sessionStorage.setItem('currentStaff', JSON.stringify(staff));
  };

  const handleStaffLogout = () => {
    setCurrentStaff(null);
    sessionStorage.removeItem('currentStaff');
  };

  if (!merchant) {
    return (
      <ProtectedRoute requireRole={['merchant']}>
        <div style={{ padding: 'var(--spacing-8)', textAlign: 'center' }}>
          Loading merchant data...
        </div>
      </ProtectedRoute>
    );
  }

  // Show PIN login if staff login is required and no staff logged in
  if (merchant.require_staff_login && !currentStaff) {
    return (
      <ProtectedRoute requireRole={['merchant']}>
        <StaffPinLogin
          merchantId={merchant.id}
          onSuccess={handleStaffLogin}
          title="Table Service Login"
          subtitle="Enter your PIN to access table service"
        />
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute requireRole={['merchant']}>
      <TableServiceTemplate 
        merchantId={merchant.id}
        currentStaff={currentStaff}
        onStaffLogout={handleStaffLogout}
      />
    </ProtectedRoute>
  );
}
