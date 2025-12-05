import { OrderConfirmationTemplate } from '@/components/templates/OrderConfirmationTemplate';

export default async function OrderConfirmationPage({
  params,
}: {
  params: Promise<{ orderId: string }>;
}) {
  const { orderId } = await params;
  
  return <OrderConfirmationTemplate orderId={orderId} />;
}
