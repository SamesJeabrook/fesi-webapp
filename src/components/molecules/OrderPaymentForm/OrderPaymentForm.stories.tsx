import React from 'react';
import OrderPaymentForm from './OrderPaymentForm';

export default {
  title: 'Molecules/OrderPaymentForm',
  component: OrderPaymentForm,
};

export const Default = () => (
  <OrderPaymentForm
    clientSecret="pi_test_secret_123"
    onPaymentSuccess={id => alert('Payment succeeded: ' + id)}
    onPaymentError={err => alert('Payment failed: ' + err.message)}
  />
);
