import type { DocumentationPage } from '../types';

export const merchantAdminOnboardingDocumentationPage: DocumentationPage = {
  slug: ['merchant-admin', 'onboarding'],
  title: 'Merchant Onboarding',
  summary:
    'How to create a Fesi merchant account, complete compliance setup, and access the merchant dashboard.',
  audience: 'New merchants setting up a Fesi account for the first time.',
  category: 'merchant-admin',
  blocks: [
    {
      type: 'section',
      title: 'Overview',
      paragraphs: [
        'Joining Fesi as a merchant takes place entirely through the web dashboard. The process covers account creation, business profile setup, document verification, and payment configuration — after which you gain full access to the merchant dashboard.',
        'The whole flow typically takes around 10–15 minutes, depending on how quickly your compliance documents are to hand.',
      ],
    },
    {
      type: 'steps',
      title: 'Onboarding Steps',
      steps: [
        {
          title: 'Create an account',
          description:
            'Account creation and authentication is handled via Auth0, a market-leading identity platform. This means your credentials are never stored directly by Fesi — your login is managed securely by Auth0 on our behalf. You can sign up with an email address or use a supported social login.',
        },
        {
          title: 'Add your business information',
          description:
            'Once your account is created, you will complete your business profile. This includes your trading name, contact details, and how your business will appear to customers on Fesi. A complete, accurate profile is both a platform requirement and how customers will find and recognise you.',
        },
        {
          title: 'Submit compliance documents',
          description:
            'To trade on Fesi, we are required to verify your business. You will be asked to upload relevant documents (such as proof of identity and business registration). These are stored securely on our cloud servers and reviewed by the Fesi compliance team. Submitting false or fraudulent documents is a serious breach of our Terms of Service and will result in immediate removal from the platform.',
        },
        {
          title: 'Configure payments',
          description:
            'Set up how you want to accept payments, including connecting your bank account for payouts. This step is powered by Stripe and must be completed before you can take live orders.',
        },
        {
          title: 'Access the merchant dashboard',
          description:
            'Once all steps are complete, you will be taken to the merchant dashboard — your central hub for managing how your business operates on Fesi. From here you can manage your menu, view orders, configure your POS, and more. See the Merchant Dashboard guide for a full breakdown.',
        },
      ],
    },
    {
      type: 'callout',
      tone: 'warning',
      title: 'Document Accuracy',
      paragraphs: [
        'All documents submitted during onboarding must be accurate and genuine. Providing false, misleading, or fraudulent information — including falsified business documents — is a breach of our Terms of Service.',
        'Merchants found to have submitted inaccurate documentation may be suspended or permanently removed from the platform, and the matter may be referred to the relevant authorities where applicable.',
      ],
    },
    {
      type: 'routes',
      title: 'Relevant Routes',
      routes: [
        {
          path: '/merchant/onboarding',
          description: 'The main onboarding flow for new merchants.',
        },
        {
          path: '/merchant/login',
          description: 'Login path for returning merchants.',
        },
        {
          path: '/merchant/admin',
          description: 'The merchant dashboard, accessible once onboarding is complete.',
        },
      ],
    },
  ],
  related: [['merchant-admin'], ['mobile-pos', 'getting-started']],
};