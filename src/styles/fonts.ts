import { Poppins, Quicksand } from 'next/font/google';

// Configure Poppins for headings
export const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-poppins',
  display: 'swap',
});

// Configure Quicksand for body text
export const quicksand = Quicksand({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-quicksand',
  display: 'swap',
});

// Export combined class names for easy usage
export const fontVariables = `${poppins.variable} ${quicksand.variable}`;
