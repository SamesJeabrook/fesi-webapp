import type { Metadata } from 'next';
import styles from './page.module.scss';

export const metadata: Metadata = {
  title: 'Fesi Customer Ordering Terms',
  description: 'Terms and conditions for customers ordering through the Fesi platform',
};

export default function CustomerTermsPage() {
  return (
    <div className={styles.termsPage}>
      <div className={styles.container}>
        <h1>Fesi Customer Ordering Terms</h1>
        <p className={styles.lastUpdated}>Last Updated: 10 February 2026</p>

        <section className={styles.section}>
          <h2>1. Introduction</h2>
          <p>Fesi provides software that allows customers to place orders with independent food vendors and restaurants (&quot;Merchants&quot;). When you place an order you are entering into a contract directly with the Merchant, not Fesi.</p>
        </section>

        <section className={styles.section}>
          <h2>2. Role of Fesi</h2>
          <p>Fesi acts solely as a technology platform. Fesi does not prepare food, provide goods, or operate restaurants. Each Merchant is responsible for fulfilling orders and providing customer service.</p>
        </section>

        <section className={styles.section}>
          <h2>3. Payments</h2>
          <p>Payments are processed securely through Stripe. By placing an order you agree to Stripe&apos;s payment processing terms. Fesi may collect platform and order protection fees as part of the checkout process.</p>
        </section>

        <section className={styles.section}>
          <h2>4. Order Protection Fee</h2>
          <p>An order protection fee may be applied at checkout. This fee contributes towards payment processing, fraud prevention and platform services. This fee is non-refundable unless required by law.</p>
        </section>

        <section className={styles.section}>
          <h2>5. Orders</h2>
          <ul>
            <li>All orders are accepted and fulfilled by the Merchant.</li>
            <li>Merchants are responsible for food preparation, quality and availability.</li>
            <li>Menu items and prices are set by Merchants.</li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2>6. Refunds & Cancellations</h2>
          <p>Refund requests must be directed to the Merchant. Each Merchant sets their own refund and cancellation policies. Fesi does not guarantee refunds.</p>
        </section>

        <section className={styles.section}>
          <h2>7. Alcohol & Age Restricted Products</h2>
          <p>Some products may require age verification. Merchants are responsible for verifying identification. If valid identification cannot be provided, the Merchant may refuse fulfilment.</p>
          <p>Refunds for refused age-restricted products are determined by the Merchant in accordance with applicable laws.</p>
        </section>

        <section className={styles.section}>
          <h2>8. Collection & Table Orders</h2>
          <p>Customers are responsible for collecting orders or being present at the table specified during ordering. Merchants are responsible for order fulfilment.</p>
        </section>

        <section className={styles.section}>
          <h2>9. Platform Availability</h2>
          <p>Fesi aims to provide reliable services but does not guarantee uninterrupted access or error-free operation.</p>
        </section>

        <section className={styles.section}>
          <h2>10. Limitation of Liability</h2>
          <p>Fesi is not responsible for food quality, preparation, delivery, order accuracy or Merchant conduct. Liability is limited to the extent permitted under UK law.</p>
        </section>

        <section className={styles.section}>
          <h2>11. Changes to Terms</h2>
          <p>Fesi may update these Terms at any time. Continued use of the platform constitutes acceptance of any updates.</p>
        </section>

        <section className={styles.section}>
          <h2>12. Governing Law</h2>
          <p>These Terms are governed by the laws of England and Wales.</p>
        </section>

        <section className={styles.section}>
          <p style={{ textAlign: 'center', marginTop: '2rem', paddingTop: '2rem', borderTop: '1px solid var(--color-border)' }}>
            <a href="/privacy" target="_blank" rel="noopener noreferrer">Privacy &amp; Cookie Policy</a>
            {' | '}
            <a href="/merchant/terms" target="_blank" rel="noopener noreferrer">Merchant Terms</a>
          </p>
        </section>
      </div>
    </div>
  );
}
