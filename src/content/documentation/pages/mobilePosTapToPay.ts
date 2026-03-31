import type { DocumentationPage } from '../types';

export const mobilePosTapToPayDocumentationPage: DocumentationPage = {
  slug: ['mobile-pos', 'tap-to-pay'],
  title: 'Tap to Pay on iPhone',
  summary:
    'How to accept contactless payments with your iPhone using Tap to Pay, including card placement, digital wallets, verification, and what to do if a payment does not go through.',
  audience: 'Staff and merchants taking payments with Fesi POS.',
  category: 'mobile-pos',
  blocks: [
    {
      type: 'section',
      title: 'What is Tap to Pay?',
      paragraphs: [
        'Tap to Pay on iPhone lets you accept contactless card payments and digital wallets (like Apple Pay) directly on your phone — no separate card reader needed.',
        'Customers simply tap or hold their card near the top of your iPhone to pay. It is fast, easy, and secure.',
      ],
    },
    {
      type: 'callout',
      tone: 'info',
      title: 'Already Own a Card Reader?',
      paragraphs: [
        'Card readers purchased for another payment provider will usually not work with your Stripe setup in Fesi. Even if the hardware looks similar, it may be locked or provisioned for that provider.',
        'If you want to avoid separate hardware, use Tap to Pay on iPhone where available. If you want an external reader, use a Stripe-supported reader that is available for your region and account.',
      ],
    },
    {
      type: 'section',
      title: 'How Your Customer Pays',
      paragraphs: [
        '**Before they tap:** Tell the customer the amount they are paying and ask them to hold their card or phone near the top of your iPhone. They should wait for the tone and on-screen confirmation that the payment went through.',
        '**While you wait:** Your iPhone will flash and beep when it reads the card. This usually takes a second or two. Do not move your phone or theirs until you hear the confirmation tone.',
        '**If it succeeds:** You will see a success screen and your customer will be charged. A receipt is offered immediately.',
        '**If it does not work:** The app will tell you what happened. Usually it means the card needs to be held in a different spot or tried again. See below for next steps.',
      ],
    },
    {
      type: 'section',
      title: 'Payment Methods We Accept',
      paragraphs: [
        'Tap to Pay works with:',
      ],
    },
    {
      type: 'routes',
      title: 'Supported Payment Methods',
      routes: [
        {
          path: 'Contactless cards',
          description: 'Any debit or credit card with the contactless symbol.',
        },
        {
          path: 'Apple Pay',
          description: 'On customer iPhones, Apple Watches, or iPads.',
        },
        {
          path: 'Google Pay and Samsung Pay',
          description: 'On compatible Android devices.',
        },
      ],
    },
    {
      type: 'section',
      title: 'If the Payment Does Not Work',
      paragraphs: [
        'Sometimes a payment does not go through on the first try. Here is what to do:',
      ],
    },
    {
      type: 'steps',
      title: 'Troubleshooting Steps',
      steps: [
        {
          title: 'Try again',
          description: 'Ask the customer to hold their card or phone in a slightly different spot near the top of your iPhone and try again.',
        },
        {
          title: 'Try another card or wallet',
          description: 'If they have another card or payment method, ask them to try that instead.',
        },
        {
          title: 'Use cash as fallback',
          description: 'If Tap to Pay still does not work, you can fall back to cash or offer to take their details for a later payment.',
        },
      ],
    },
    {
      type: 'section',
      title: 'After Payment — Receipts',
      paragraphs: [
        'If the customer wants a digital receipt, their email address should be entered before payment is taken. Once the payment succeeds, the receipt is sent automatically.',
        'If they decline a digital receipt, the transaction is still complete and no receipt is sent.',
      ],
    },
    {
      type: 'callout',
      tone: 'info',
      title: 'UK Market Notes',
      paragraphs: [
        'Tap to Pay is currently available in the UK only. If you are trading outside the UK, other payment methods will be available.',
      ],
    },
    {
      type: 'routes',
      title: 'Related Topics',
      routes: [
        {
          path: '/documentation/mobile-pos/orders',
          description: 'Full guide to taking and managing orders.',
        },
        {
          path: '/documentation/mobile-pos/receipts',
          description: 'How digital receipts work.',
        },
      ],
    },
  ],
  related: [['mobile-pos', 'orders'], ['mobile-pos', 'receipts']],
};