import React, { useEffect, useState } from 'react';
import { loadStripe, PaymentRequest } from '@stripe/stripe-js';
import { Elements, useStripe, useElements, CardElement, PaymentRequestButtonElement } from '@stripe/react-stripe-js';
import { useAuth0 } from '@auth0/auth0-react';
import { Event } from '@/types';
import { Typography, Input } from '@/components/atoms';
import PaymentHoldingNotice from '@/components/molecules/PaymentHoldingNotice/PaymentHoldingNotice';
import { getAuthToken } from '@/utils/devAuth';
import { OrderListItem } from '@/components/molecules/OrderList/OrderList';
import api from '@/utils/api';
import styles from './OrderPaymentForm.module.scss';

export interface OrderPaymentFormProps {
  basketItems: any[];
  costBreakdown: any;
  onPaymentSuccess: (paymentIntentId: string) => void;
  onPaymentError?: (error: any) => void;
  eventData: Event;
  onOrderAccepted?: (order: OrderListItem) => void;
  tableId?: string;
  tableNumber?: string;
}

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '');

const PaymentFormInner: React.FC<OrderPaymentFormProps> = ({ basketItems, costBreakdown, onPaymentSuccess, onPaymentError, eventData, onOrderAccepted, tableId, tableNumber }) => {
  const stripe = useStripe();
  const elements = useElements();
  const { user, isAuthenticated, getAccessTokenSilently } = useAuth0();
  const [paymentRequest, setPaymentRequest] = useState<PaymentRequest | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [holding, setHolding] = useState(false);
  const [pollingStatus, setPollingStatus] = useState<string>('');
  const [restoredBasketItems, setRestoredBasketItems] = useState<any[] | null>(null);
  const [restoredCostBreakdown, setRestoredCostBreakdown] = useState<any | null>(null);
  const [customerProfile, setCustomerProfile] = useState<any>(null);
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [acknowledgedRestrictions, setAcknowledgedRestrictions] = useState(false);
  // Guest info state
  const [guestInfo, setGuestInfo] = useState({
    email: '',
    first_name: '',
    last_name: '',
    phone: ''
  });
  const event_id = costBreakdown.event_id || '';
  const notes = '';

  // Check if order contains any age-restricted items
  const restrictedItems = basketItems.filter((item: any) => item.is_age_restricted === true);
  const hasRestrictedItems = restrictedItems.length > 0;

  useEffect(() => {
    const savedOrderId = localStorage.getItem('orderId');
    const savedClientSecret = localStorage.getItem('clientSecret');
    const savedHolding = localStorage.getItem('holding');
    const savedBasketItems = localStorage.getItem('basketItems');
    const savedCostBreakdown = localStorage.getItem('costBreakdown');
    
    // Only restore if we have holding state AND no current basketItems (meaning we're resuming after refresh)
    // If basketItems are passed in, this is a NEW order and we should clear old data
    if (basketItems && basketItems.length > 0) {
      // This is a new order, clear any stale localStorage data
      console.log('🆕 New order detected, clearing stale localStorage');
      localStorage.removeItem('orderId');
      localStorage.removeItem('clientSecret');
      localStorage.removeItem('holding');
      localStorage.removeItem('basketItems');
      localStorage.removeItem('costBreakdown');
    } else if (savedOrderId && savedClientSecret && savedHolding === 'true' && savedBasketItems && savedCostBreakdown) {
      // Restoring a payment in progress after page refresh
      console.log('🔄 Restoring payment in progress from localStorage');
      setOrderId(savedOrderId);
      setClientSecret(savedClientSecret);
      setHolding(true);
      setRestoredBasketItems(JSON.parse(savedBasketItems));
      setRestoredCostBreakdown(JSON.parse(savedCostBreakdown));
    }
  }, []);

  // Load customer profile if authenticated
  useEffect(() => {
    const loadCustomerProfile = async () => {
      console.log('👤 loadCustomerProfile - isAuthenticated:', isAuthenticated, 'user:', user);
      if (!isAuthenticated || !user) {
        console.log('❌ Not authenticated or no user, skipping profile load');
        return;
      }
      
      try {
        setLoadingProfile(true);
        
        try {
          const data = await api.get('/api/customers/me');
          console.log('✅ Customer profile loaded:', data.data);
          setCustomerProfile(data.data);
          // Pre-populate guest info with customer data
          setGuestInfo({
            email: data.data.email || user.email || '',
            first_name: data.data.first_name || '',
            last_name: data.data.last_name || '',
            phone: data.data.phone || ''
          });
        } catch (error: any) {
          // If 404, customer profile doesn't exist yet, create one
          if (error.message?.includes('404') || error.message?.includes('not found')) {
            const newProfile = await api.post('/api/customers', {
              auth0_id: user.sub,
              email: user.email || '',
              first_name: user.name?.split(' ')[0] || user.given_name || '',
              last_name: user.name?.split(' ').slice(1).join(' ') || user.family_name || '',
            });
            
            setCustomerProfile(newProfile.data);
            setGuestInfo({
              email: newProfile.data.email || user.email || '',
              first_name: newProfile.data.first_name || '',
              last_name: newProfile.data.last_name || '',
              phone: newProfile.data.phone || ''
            });
          } else {
            // Failed to create profile, use Auth0 user data
            setGuestInfo({
              email: user.email || '',
              first_name: user.name?.split(' ')[0] || '',
              last_name: user.name?.split(' ').slice(1).join(' ') || '',
              phone: ''
            });
          }
        }
      } catch (error) {
        console.error('Error loading customer profile:', error);
        // Fallback to Auth0 user data
        setGuestInfo({
          email: user.email || '',
          first_name: user.name?.split(' ')[0] || '',
          last_name: user.name?.split(' ').slice(1).join(' ') || '',
          phone: ''
        });
      } finally {
        setLoadingProfile(false);
      }
    };
    
    loadCustomerProfile();
  }, [isAuthenticated, user, getAccessTokenSilently]);

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
          const data = await api.get(`/api/orders/${orderId}`);
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
            // Redirect to confirmation page
            window.location.href = `/orders/confirmation/${data.id}`;
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
      console.log(basketItems);

      // If authenticated, update customer profile with any new info
      if (isAuthenticated && user) {
        try {
          const token = await getAuthToken(getAccessTokenSilently);
          
          // Check if profile info has changed
          const profileChanged = !customerProfile || 
            customerProfile.first_name !== guestInfo.first_name ||
            customerProfile.last_name !== guestInfo.last_name ||
            customerProfile.phone !== guestInfo.phone;
          
          if (profileChanged && (guestInfo.first_name || guestInfo.last_name)) {
            await api.put('/api/customers/me', {
              first_name: guestInfo.first_name.trim(),
              last_name: guestInfo.last_name.trim(),
              phone: guestInfo.phone.trim() || null,
            });
          }
        } catch (profileError) {
          console.error('Error updating customer profile:', profileError);
          // Continue with order even if profile update fails
        }
      }

      // 1. Create order - strip price fields for security (server calculates prices)
      const sanitizedItems = basketItems.map(item => ({
        menu_item_id: item.menu_item_id,
        quantity: item.quantity,
        customizations: item.customizations?.map((c: any) => ({
          sub_item_id: c.sub_item_id,
          quantity: c.quantity || 1
        })) || []
      }));

      const orderPayload: any = {
        event_id: eventData.id,
        items: sanitizedItems,
        notes
      };
      
      // Add table info if ordering from a table QR code
      if (tableId) {
        orderPayload.table_id = tableId;
        console.log('🪑 Table service order - table_id:', tableId, 'table_number:', tableNumber);
      }
      
      console.log('🔍 Order submission - isAuthenticated:', isAuthenticated);
      console.log('🔍 Order submission - customerProfile:', customerProfile);
      console.log('🔍 Order submission - user:', user);
      
      if (isAuthenticated && customerProfile?.id) {
        console.log('✅ Using customer_id:', customerProfile.id);
        orderPayload.customer_id = customerProfile.id;
      } else {
        console.log('⚠️ Creating guest order with guest_info:', guestInfo);
        orderPayload.guest_info = guestInfo;
      }
      
      console.log('📦 Final order payload:', orderPayload);
      const orderData = await api.post('/api/orders', orderPayload, { skipAuth: !isAuthenticated });
      if (!orderData.id) throw new Error(orderData.error || 'Order creation failed');
      setOrderId(orderData.id);

      // 2. Create payment intent
      const paymentData = await api.post(`/api/orders/${orderData.id}/payment-intent`, {}, { skipAuth: !isAuthenticated });
      if (!paymentData.clientSecret) throw new Error(paymentData.error || 'Payment intent creation failed');
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
        {/* Customer info fields - shown for all users, pre-populated if logged in */}
        {!loadingProfile && (
          <div className={styles.guestFields}>
            <Input
              id="customer-email"
              type="email"
              label="Email Address"
              placeholder="Enter your email"
              value={guestInfo.email}
              onChange={e => setGuestInfo({ ...guestInfo, email: e.target.value })}
              isRequired={true}
              autoComplete="email"
              fullWidth
              isDisabled={isAuthenticated && !!customerProfile?.email}
            />
            <Input
              id="customer-first-name"
              type="text"
              label="First Name"
              placeholder="Enter your first name"
              value={guestInfo.first_name}
              onChange={e => setGuestInfo({ ...guestInfo, first_name: e.target.value })}
              isRequired={!isAuthenticated}
              autoComplete="given-name"
              fullWidth
            />
            <Input
              id="customer-last-name"
              type="text"
              label="Last Name"
              placeholder="Enter your last name"
              value={guestInfo.last_name}
              onChange={e => setGuestInfo({ ...guestInfo, last_name: e.target.value })}
              autoComplete="family-name"
              fullWidth
            />
            <Input
              id="customer-phone"
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
        
        {/* Age restriction warning if order contains restricted items */}
        {hasRestrictedItems && (
          <div className={styles.restrictionWarning}>
            <div className={styles.warningHeader}>
              <span className={styles.warningIcon}>⚠️</span>
              <Typography variant="body-medium"><strong>Age-Restricted Items in Order</strong></Typography>
            </div>
            <Typography variant="body-small">
              Your order contains the following age-restricted items:
            </Typography>
            <ul className={styles.restrictedItemsList}>
              {restrictedItems.map((item: any, index: number) => (
                <li key={index}>
                  <strong>{item.title}</strong>
                  {item.restriction_warning && <span> - {item.restriction_warning}</span>}
                  {!item.restriction_warning && item.minimum_age && (
                    <span> - Restricted to ages {item.minimum_age}+</span>
                  )}
                </li>
              ))}
            </ul>
            <Typography variant="body-small">
              <strong>You must be of legal age to purchase these items. Valid ID may be required at pickup or delivery. Orders may be refused if age verification cannot be completed.</strong>
            </Typography>
          </div>
        )}
        
        {/* Restricted items acknowledgment checkbox */}
        {hasRestrictedItems && (
          <div className={styles.termsCheckbox}>
            <input
              id="acknowledgeRestrictions"
              type="checkbox"
              checked={acknowledgedRestrictions}
              onChange={(e) => setAcknowledgedRestrictions(e.target.checked)}
            />
            <label htmlFor="acknowledgeRestrictions">
              <strong>I confirm that I am of legal age to purchase age-restricted items and understand that valid ID may be required. I acknowledge that my order may be refused if age verification cannot be completed.</strong>
            </label>
          </div>
        )}
        
        <div className={styles.termsCheckbox}>
          <input
            id="acceptCustomerTerms"
            type="checkbox"
            checked={acceptedTerms}
            onChange={(e) => setAcceptedTerms(e.target.checked)}
          />
          <label htmlFor="acceptCustomerTerms">
            I accept the <a href="/terms" target="_blank" rel="noopener noreferrer"><strong>Fesi Customer Terms and Conditions</strong></a>
          </label>
        </div>
        
        <button type="submit" className={styles.payBtn} disabled={loading || !acceptedTerms || (hasRestrictedItems && !acknowledgedRestrictions)}>
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
