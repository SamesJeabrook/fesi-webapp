import React from 'react';
import CheckoutButtonWrapper from './CheckoutButtonWrapper';
import { Button } from '@/components/atoms';

export default {
  title: 'Atoms/CheckoutButtonWrapper',
  component: CheckoutButtonWrapper,
};

export const Default = () => (
  <div style={{ position: 'relative', height: 300, border: '1px solid #eee', background: '#fafafa' }}>
    <CheckoutButtonWrapper>
      <Button variant="primary">Checkout</Button>
    </CheckoutButtonWrapper>
  </div>
);
