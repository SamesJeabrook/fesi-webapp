import type { Preview } from '@storybook/nextjs-vite';
// import { initialize, mswLoader } from 'msw-storybook-addon';

// Import global styles - includes all CSS custom properties, design tokens, and base styles
import '../src/styles/globals.scss';

// Initialize MSW for Storybook with quiet mode to reduce console noise
// initialize({
//   onUnhandledRequest: 'bypass',
//   quiet: true
// });

const preview: Preview = {
  // loaders: [mswLoader],
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    docs: {
      toc: true,
    },
    backgrounds: {
      default: 'light',
      values: [
        {
          name: 'light',
          value: '#ffffff',
        },
        {
          name: 'dark',
          value: '#333333',
        },
        {
          name: 'brand',
          value: 'var(--color-brand-50)',
        },
      ],
    },
    viewport: {
      viewports: {
        // Extra small - below sm breakpoint
        xs: {
          name: 'Extra Small (xs)',
          styles: {
            width: '375px',
            height: '667px',
          },
        },
        // Small - matches your sm breakpoint (640px)
        sm: {
          name: 'Small (sm)',
          styles: {
            width: '640px',
            height: '800px',
          },
        },
        // Medium - matches your md breakpoint (768px)
        md: {
          name: 'Medium (md)',
          styles: {
            width: '768px',
            height: '1024px',
          },
        },
        // Large - matches your lg breakpoint (1024px)
        lg: {
          name: 'Large (lg)',
          styles: {
            width: '1024px',
            height: '768px',
          },
        },
        // Extra Large - matches your xl breakpoint (1280px)
        xl: {
          name: 'Extra Large (xl)',
          styles: {
            width: '1280px',
            height: '800px',
          },
        },
        // 2XL - matches your 2xl breakpoint (1536px)
        '2xl': {
          name: '2X Large (2xl)',
          styles: {
            width: '1536px',
            height: '900px',
          },
        },
      },
    },
    a11y: {
      // 'todo' - show a11y violations in the test UI only
      // 'error' - fail CI on a11y violations
      // 'off' - skip a11y checks entirely
      test: 'todo',
      config: {
        rules: [
          {
            id: 'color-contrast',
            enabled: true,
          },
          {
            id: 'focus-trap',
            enabled: true,
          },
        ],
      },
    },
  },
  tags: ['autodocs'],
};

export default preview;