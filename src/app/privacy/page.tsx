import type { Metadata } from 'next';
import styles from './page.module.scss';

export const metadata: Metadata = {
  title: 'Fesi Privacy & Cookie Policy',
  description: 'Privacy and cookie policy for the Fesi platform',
};

export default function PrivacyPolicyPage() {
  return (
    <div className={styles.privacyPage}>
      <div className={styles.container}>
        <h1>Fesi Privacy &amp; Cookie Policy</h1>
        <p className={styles.lastUpdated}>Last Updated: 10 February 2026</p>

        <section className={styles.section}>
          <h2>1. Introduction</h2>
          <p>Fesi (&quot;we&quot;, &quot;us&quot;, &quot;our&quot;) respects your privacy and is committed to protecting your personal data. This Privacy &amp; Cookie Policy explains how we collect, use and store information when you use our platform, website and services.</p>
        </section>

        <section className={styles.section}>
          <h2>2. Personal Data We Collect</h2>
          <p>We may collect the following information:</p>
          <ul>
            <li>Contact information: name, email address, phone number</li>
            <li>Order information: items ordered, delivery/pickup details, transaction history</li>
            <li>Payment information: handled securely via Stripe</li>
            <li>Camera: used solely for QR code scanning to process orders; no images are stored or transmitted</li>
            <li>Device information: IP address, browser type, operating system</li>
            <li>Other information you provide when contacting support or creating an account</li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2>3. How We Use Personal Data</h2>
          <p>We use your information to:</p>
          <ul>
            <li>Provide and operate our platform and services</li>
            <li>Process payments via Stripe</li>
            <li>Respond to inquiries or complaints</li>
            <li>Send updates related to your account or orders</li>
            <li>Improve platform performance and user experience</li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2>4. Sharing Data with Third Parties</h2>
          <p>We do not sell your personal data. We may share information with:</p>
          <ul>
            <li>Stripe, for payment processing</li>
            <li>Vendors/Merchants, to fulfill your orders</li>
            <li>Third-party service providers supporting our platform (hosting, analytics, email providers)</li>
            <li>Legal authorities if required by law</li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2>5. Cookies</h2>
          <p>Fesi uses cookies and similar technologies to improve functionality and user experience.</p>

          <h3>Types of cookies:</h3>
          <ul>
            <li><strong>Essential cookies:</strong> required for platform operation (e.g., login sessions)</li>
            <li><strong>Performance cookies:</strong> may collect anonymous usage data to improve the site</li>
            <li><strong>Functional cookies:</strong> remember preferences, settings, or feature usage</li>
            <li><strong>Third-party cookies:</strong> set by external services, such as analytics or embedded content</li>
          </ul>

          <p>You may manage or block cookies using your browser settings. Some features of the platform may not function if cookies are disabled.</p>
        </section>

        <section className={styles.section}>
          <h2>6. Data Retention</h2>
          <p>We retain personal data only for as long as necessary to provide services, comply with legal obligations, resolve disputes, and enforce agreements.</p>
        </section>

        <section className={styles.section}>
          <h2>7. Your Rights</h2>
          <p>Under UK GDPR, you have the right to:</p>
          <ul>
            <li>Access your personal data</li>
            <li>Request correction or deletion</li>
            <li>Object to processing or restrict usage</li>
            <li>Receive your data in a portable format</li>
            <li>Lodge a complaint with the Information Commissioner&apos;s Office (ICO)</li>
          </ul>
          <p>Requests can be made by contacting us at <a href="mailto:privacy@fesi.co.uk">privacy@fesi.co.uk</a>.</p>
        </section>

        <section className={styles.section}>
          <h2>8. Security</h2>
          <p>We implement reasonable technical and organisational measures to protect your personal data against accidental or unlawful loss, access, or disclosure.</p>
        </section>

        <section className={styles.section}>
          <h2>9. Changes to This Policy</h2>
          <p>We may update this Privacy &amp; Cookie Policy from time to time. Material changes will be notified via our platform or email. Continued use of Fesi constitutes acceptance of any updates.</p>
        </section>

        <section className={styles.section}>
          <h2>10. Contact</h2>
          <p>If you have questions about this policy or how your data is used, please contact us at: <a href="mailto:privacy@fesi.co.uk">privacy@fesi.co.uk</a></p>
        </section>

        <section className={styles.section}>
          <p style={{ textAlign: 'center', marginTop: '2rem', paddingTop: '2rem', borderTop: '1px solid var(--color-border)' }}>
            <a href="/terms" target="_blank" rel="noopener noreferrer">Customer Terms</a>
            {' | '}
            <a href="/merchant/terms" target="_blank" rel="noopener noreferrer">Merchant Terms</a>
          </p>
        </section>
      </div>
    </div>
  );
}
