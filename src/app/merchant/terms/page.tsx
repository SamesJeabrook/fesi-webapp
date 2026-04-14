import type { Metadata } from 'next';
import styles from './page.module.scss';

export const metadata: Metadata = {
  title: 'Fesi Merchant Terms & Conditions',
  description: 'Terms and conditions for merchants using the Fesi platform',
};

export default function MerchantTermsPage() {
  return (
    <div className={styles.termsPage}>
      <div className={styles.container}>
        <h1>Fesi Merchant Terms & Conditions</h1>
        <p className={styles.lastUpdated}>Last Updated: 10 February 2026</p>

        <section className={styles.section}>
          <h2>1. Introduction</h2>
          <p>Fesi provides software tools enabling independent vendors and restaurants to accept orders, process payments and operate POS systems. By using Fesi you agree to these Terms.</p>
        </section>

        <section className={styles.section}>
          <h2>2. Role of Fesi</h2>
          <p>Fesi provides software services only. Merchants are the merchant of record and responsible for all goods, services, refunds, disputes, licensing, tax and regulatory compliance. Payments are processed by Stripe.</p>
        </section>

        <section className={styles.section}>
          <h2>3. Merchant Accounts</h2>
          <ul>
            <li>Merchants must complete Stripe onboarding</li>
            <li>Provide accurate business information</li>
            <li>Maintain legal compliance</li>
            <li>Fesi may suspend accounts at its discretion</li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2>4. Fees</h2>
          
          <p><strong>POS/In-Person Transaction Fees (Merchant Pays):</strong></p>
          <ul>
            <li>Free Tier – 3.5% + £0.30 per transaction</li>
            <li>Professional – 3.0% + £0.40 per transaction</li>
            <li>Business – 2.9% + £0.50 per transaction</li>
          </ul>
          
          <p><strong>Online Order Transaction Fees (Customer Pays):</strong></p>
          <ul>
            <li>Free Tier – 10%</li>
            <li>Professional – 8%</li>
            <li>Business – 6%</li>
          </ul>
          
          <p><strong>Order Protection Fee:</strong></p>
          <p>Applied to online orders to cover payment processing and platform costs. A small order fee may be added to orders under £10 to ensure profitability.</p>
          
          <p><strong>Subscriptions:</strong> Recurring fees apply for premium features.</p>
        </section>

        <section className={styles.section}>
          <h2>5. Payments</h2>
          <p>All payments are processed through Stripe. Fesi collects application fees automatically. Stripe terms also apply.</p>
        </section>

        <section className={styles.section}>
          <h2>6. Refunds & Disputes</h2>
          <p>Merchants are responsible for all refunds, complaints and disputes. Fesi bears no financial liability.</p>
        </section>

        <section className={styles.section}>
          <h2>7. Menu & Pricing Control</h2>
          <p>Merchants are responsible for all menu content, pricing accuracy and product descriptions.</p>
        </section>

        <section className={styles.section}>
          <h2>8. Alcohol & Age Restricted Sales</h2>
          <p>Merchants are solely responsible for licensing and age verification. Merchants may refuse fulfilment if legal requirements are not met.</p>
        </section>

        <section className={styles.section}>
          <h2>9. Acceptable Use</h2>
          <p>Illegal goods, fraudulent activity and misleading listings are prohibited.</p>
        </section>

        <section className={styles.section}>
          <h2>10. Platform Availability</h2>
          <p>Fesi provides services on an &quot;as is&quot; basis and does not guarantee uninterrupted operation.</p>
        </section>

        <section className={styles.section}>
          <h2>11. Limitation of Liability</h2>
          <p>Fesi is not liable for indirect losses, merchant failures or third-party payment issues. Liability is limited to fees paid in the last 3 months.</p>
        </section>

        <section className={styles.section}>
          <h2>12. Suspension & Termination</h2>
          <p>Fesi may immediately suspend or terminate accounts where fraud, risk, legal concerns or breaches occur.</p>
        </section>

        <section className={styles.section}>
          <h2>13. Changes to Terms</h2>
          <p>Fesi may update these Terms at any time. Continued use of the platform constitutes acceptance of changes.</p>
        </section>

        <section className={styles.section}>
          <h2>14. Governing Law</h2>
          <p>These Terms are governed by the laws of England and Wales.</p>
        </section>

        <section className={styles.section}>
          <p style={{ textAlign: 'center', marginTop: '2rem', paddingTop: '2rem', borderTop: '1px solid var(--color-border)' }}>
            <a href="/privacy" target="_blank" rel="noopener noreferrer">Privacy &amp; Cookie Policy</a>
            {' | '}
            <a href="/terms" target="_blank" rel="noopener noreferrer">Customer Terms</a>
          </p>
        </section>
      </div>
    </div>
  );
}
