import React, { useEffect, useState } from 'react';
import { loadStripe, PaymentRequest } from '@stripe/stripe-js';
import { Elements, useStripe, useElements, CardElement, PaymentRequestButtonElement } from '@stripe/react-stripe-js';
import { Typography } from '@/components/atoms';
import styles from './OrderPaymentForm.module.scss';

export interface OrderPaymentFormProps {
  clientSecret: string;
  onPaymentSuccess: (paymentIntentId: string) => void;
  onPaymentError?: (error: any) => void;
}

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '');

const PaymentFormInner: React.FC<OrderPaymentFormProps> = ({ clientSecret, onPaymentSuccess, onPaymentError }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [paymentRequest, setPaymentRequest] = useState<PaymentRequest | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (stripe) {
      const pr = stripe.paymentRequest({
        country: 'GB',
        currency: 'gbp',
        total: {
          label: 'Order Total',
          amount: 1000, // Replace with actual amount in pence
        },
        requestPayerName: true,
        requestPayerEmail: true,
      });
      pr.canMakePayment().then((result: null | { applePay?: object; googlePay?: object; samsungPay?: object; }) => {
        if (result) setPaymentRequest(pr);
      });
    }
  }, [stripe]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    if (!stripe || !elements) return;
    const cardElement = elements.getElement(CardElement);
    if (!cardElement) return;
    const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: cardElement,
      },
    });
    setLoading(false);
    if (error) {
      setError(error.message || 'Payment failed');
      onPaymentError && onPaymentError(error);
    } else if (paymentIntent && paymentIntent.status === 'succeeded') {
      onPaymentSuccess(paymentIntent.id);
    }
  };

  return (
    <div className={styles.formWrapper}>
      <Typography variant="heading-5">Payment Details</Typography>
      {paymentRequest && (
        <div className={styles.prButton}>
          <PaymentRequestButtonElement options={{ paymentRequest }} />
        </div>
      )}
      <form onSubmit={handleSubmit} className={styles.form}>
        <CardElement options={{ style: { base: { fontSize: '18px' } } }} />
        <button type="submit" className={styles.payBtn} disabled={loading}>
          {loading ? 'Processing...' : 'Pay Now'}
        </button>
      </form>
  {error && <Typography variant="body-small">{error}</Typography>}
    </div>
  );
};

const OrderPaymentForm: React.FC<OrderPaymentFormProps> = (props) => (
  <Elements stripe={stripePromise} options={{ clientSecret: props.clientSecret }}>
    <PaymentFormInner {...props} />
  </Elements>
);

export default OrderPaymentForm;
