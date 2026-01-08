export interface BillSummaryProps {
  subtotal: number;
  taxRate?: number;
  serviceCharge?: number;
  discount?: number;
  total: number;
  paidAmount?: number;
  remainingAmount?: number;
  showSplitOptions?: boolean;
  guestCount?: number;
  onSplitEvenly?: (guests: number) => void;
  className?: string;
}
