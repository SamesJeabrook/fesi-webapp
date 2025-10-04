import React, { useEffect, useState } from 'react';
import { loadStripe, PaymentRequest } from '@stripe/stripe-js';
import { Elements, useStripe, useElements, CardElement, PaymentRequestButtonElement } from '@stripe/react-stripe-js';
import { Event } from '@/types';
import { Typography, Input } from '@/components/atoms';
import PaymentHoldingNotice from '@/components/molecules/PaymentHoldingNotice/PaymentHoldingNotice';
import styles from './OrderPaymentForm.module.scss';

export interface OrderPaymentFormProps {
  basketItems: any[];
  costBreakdown: any;
  onPaymentSuccess: (paymentIntentId: string) => void;
  onPaymentError?: (error: any) => void;
  eventData: Event;
  onOrderAccepted?: (order: {
    id: string;
    status: string;
    items: any[];
    total: number;
    order_number: number;
    longitude: number;
    latitude: number;
    merchant_name: string;
  }) => void;
}

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '');

const PaymentFormInner: React.FC<OrderPaymentFormProps> = ({ basketItems, costBreakdown, onPaymentSuccess, onPaymentError, eventData, onOrderAccepted }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [paymentRequest, setPaymentRequest] = useState<PaymentRequest | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [holding, setHolding] = useState(false);
  const [pollingStatus, setPollingStatus] = useState<string>('');
  const [restoredBasketItems, setRestoredBasketItems] = useState<any[] | null>(null);
  const [restoredCostBreakdown, setRestoredCostBreakdown] = useState<any | null>(null);
  // Guest info state
  const [guestInfo, setGuestInfo] = useState({
    email: '',
    first_name: '',
    last_name: '',
    phone: ''
  });
  // Simulate auth state (replace with your actual auth logic)
  const isLoggedIn = false; // TODO: Replace with real auth check
  const customer_id = undefined; // TODO: Replace with real customer id if logged in
  const event_id = costBreakdown.event_id || '';
  const notes = '';

  useEffect(() => {
    const savedOrderId = localStorage.getItem('orderId');
    const savedClientSecret = localStorage.getItem('clientSecret');
    const savedHolding = localStorage.getItem('holding');
    const savedBasketItems = localStorage.getItem('basketItems');
    const savedCostBreakdown = localStorage.getItem('costBreakdown');
    if (savedOrderId && savedClientSecret && savedHolding === 'true' && savedBasketItems && savedCostBreakdown) {
      setOrderId(savedOrderId);
      setClientSecret(savedClientSecret);
      setHolding(true);
      setRestoredBasketItems(JSON.parse(savedBasketItems));
      setRestoredCostBreakdown(JSON.parse(savedCostBreakdown));
    }
  }, []);

  useEffect(() => {
    if (stripe && clientSecret) {
      const pr = stripe.paymentRequest({
        country: 'GB',
        currency: 'gbp',
        total: {
          label: 'Order Total',
          amount: costBreakdown.totalOrderAmount,
        },
        requestPayerName: true,
        requestPayerEmail: true,
      });
      pr.canMakePayment().then((result: null | { applePay?: object; googlePay?: object; samsungPay?: object; }) => {
        if (result) setPaymentRequest(pr);
      });
    }
  }, [stripe, clientSecret, costBreakdown.totalOrderAmount]);

  // Poll for order status after payment details are submitted
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (holding && orderId) {
      interval = setInterval(async () => {
        try {
          const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/orders/${orderId}`);
          const data = await res.json();
          setPollingStatus(data.status);
          if (data.status === 'accepted') {
            setHolding(false);
            onPaymentSuccess(data.payment_intent_id);
            if (typeof onOrderAccepted === 'function') {
              onOrderAccepted({
                id: data.id,
                order_number: data.order_number,
                status: data.status,
                items: data.items,
                total: data.total_amount,
                latitude: data.latitude,
                longitude: data.longitude,
                merchant_name: data.merchant_name
              });
            }
            resetLocalStorage();
            clearInterval(interval);
          } else if (data.status === 'cancelled' || data.status === 'rejected') {
            setHolding(false);
            setError('Order was not accepted. You have not been charged.');
            resetLocalStorage();
            clearInterval(interval);
          }
        } catch (err) {
          // ignore polling errors
        }
      }, 2000);
    }
    return () => clearInterval(interval);
  }, [holding, orderId, onPaymentSuccess]);

  const resetLocalStorage = () => {
    localStorage.removeItem('orderId');
    localStorage.removeItem('clientSecret');
    localStorage.removeItem('holding');
    localStorage.removeItem('basketItems');
    localStorage.removeItem('costBreakdown');
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
        console.log(basketItems)

      // 1. Create order
      const orderPayload: any = {
        event_id: eventData.id,
        items: basketItems,
        notes
      };
      if (isLoggedIn && customer_id) {
        orderPayload.customer_id = customer_id;
      } else {
        orderPayload.guest_info = guestInfo;
      }
      const orderRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload),
      });
      const orderData = await orderRes.json();
      if (!orderRes.ok || !orderData.id) throw new Error(orderData.error || 'Order creation failed');
      setOrderId(orderData.id);

      // 2. Create payment intent
      const paymentRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/orders/${orderData.id}/payment-intent`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      const paymentData = await paymentRes.json();
      if (!paymentRes.ok || !paymentData.clientSecret) throw new Error(paymentData.error || 'Payment intent creation failed');
      setClientSecret(paymentData.clientSecret);

      // 3. Collect payment details
      if (!stripe || !elements) throw new Error('Stripe not loaded');
      const cardElement = elements.getElement(CardElement);
      if (!cardElement) throw new Error('Card element not found');
      const { error, paymentIntent } = await stripe.confirmCardPayment(paymentData.clientSecret, {
        payment_method: { card: cardElement },
      });
      if (error) throw error;
      // 4. Show holding screen and start polling
      setHolding(true);
      setLoading(false);
      localStorage.setItem('orderId', orderData.id);
      localStorage.setItem('basketItems', JSON.stringify(basketItems));
      localStorage.setItem('costBreakdown', JSON.stringify(costBreakdown));
      localStorage.setItem('clientSecret', paymentData.clientSecret);
      localStorage.setItem('holding', 'true');
    } catch (err: any) {
      setLoading(false);
      setError(err.message || 'Payment failed');
      onPaymentError && onPaymentError(err);
    }
  };

  if (holding) {
    return <PaymentHoldingNotice />;
  }

  return (
    <div className={styles.formWrapper}>
      <Typography variant="heading-5">Payment Details</Typography>
      <form onSubmit={handleSubmit} className={styles.form}>
        {/* Guest info fields for anonymous checkout */}
        {!isLoggedIn && (
          <div className={styles.guestFields}>
            <Input
              id="guest-email"
              type="email"
              label="Email Address"
              placeholder="Enter your email"
              value={guestInfo.email}
              onChange={e => setGuestInfo({ ...guestInfo, email: e.target.value })}
              isRequired
              autoComplete="email"
              fullWidth
            />
            <Input
              id="guest-first-name"
              type="text"
              label="First Name"
              placeholder="Enter your first name"
              value={guestInfo.first_name}
              onChange={e => setGuestInfo({ ...guestInfo, first_name: e.target.value })}
              isRequired
              autoComplete="given-name"
              fullWidth
            />
            <Input
              id="guest-last-name"
              type="text"
              label="Last Name"
              placeholder="Enter your last name"
              value={guestInfo.last_name}
              onChange={e => setGuestInfo({ ...guestInfo, last_name: e.target.value })}
              autoComplete="family-name"
              fullWidth
            />
            <Input
              id="guest-phone"
              type="tel"
              label="Phone Number (Optional)"
              placeholder="Enter your phone number"
              value={guestInfo.phone}
              onChange={e => setGuestInfo({ ...guestInfo, phone: e.target.value })}
              autoComplete="tel"
              fullWidth
            />
          </div>
        )}
        <CardElement options={{ style: { base: { fontSize: '18px' } } }} />
        <button type="submit" className={styles.payBtn} disabled={loading}>
          {loading ? 'Processing...' : 'Pay Now'}
        </button>
      </form>
      {paymentRequest && (
        <div className={styles.prButton}>
          <PaymentRequestButtonElement options={{ paymentRequest }} />
        </div>
      )}
      {error && <Typography variant="body-small">{error}</Typography>}
    </div>
  );
};

const OrderPaymentForm: React.FC<OrderPaymentFormProps> = (props) => (
  <Elements stripe={stripePromise}>
    <PaymentFormInner {...props} />
  </Elements>
);

export default OrderPaymentForm;
