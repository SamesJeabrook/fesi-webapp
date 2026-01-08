export interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  sessionId: string;
  totalAmount: number;
  paidAmount?: number;
  onPaymentSuccess?: () => void;
  className?: string;
}

export type PaymentMethod = 'card_reader' | 'cash' | 'online';

export interface PaymentRequest {
  amount: number;
  payment_method: PaymentMethod;
  stripe_payment_intent_id?: string;
}
