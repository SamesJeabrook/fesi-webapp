// Development authentication helpers
// These are added to window object for easy testing in browser console

declare global {
  interface Window {
    setDemoToken: () => void;
    clearDemoToken: () => void;
    setMerchantToken: (merchantId: string, userId?: string) => void;
    getCurrentToken: () => string | null;
  }
}

if (typeof window !== 'undefined') {
  window.setDemoToken = () => {
    // Use the development bypass token
    const token = 'dev-bypass-token';
    localStorage.setItem('auth-token', token);
    console.log('✅ Development bypass token set!');
    console.log('Token:', token);
    console.log('Refresh the page to test authentication.');
  };

  window.setMerchantToken = (merchantId: string, userId: string = 'demo-user') => {
    // Use merchant-specific bypass token format that the API recognizes
    const token = `dev-merchant-${merchantId}`;
    localStorage.setItem('auth-token', token);
    console.log(`✅ Merchant bypass token set for ID: ${merchantId}`);
    console.log('Token:', token);
    console.log('This bypasses Auth0 authentication for development.');
    console.log('Refresh the page to test authentication.');
  };

  window.clearDemoToken = () => {
    localStorage.removeItem('auth-token');
    console.log('🗑️  Auth token cleared!');
  };

  window.getCurrentToken = () => {
    const token = localStorage.getItem('auth-token');
    if (token) {
      if (token.startsWith('dev-')) {
        console.log('🔧 Development bypass token found:', token);
        if (token.startsWith('dev-merchant-')) {
          const merchantId = token.replace('dev-merchant-', '');
          console.log('👤 Merchant ID:', merchantId);
        }
      } else {
        console.log('🔑 Auth token found:', token);
      }
      return token;
    } else {
      console.log('❌ No token found');
      return null;
    }
  };

  console.log('🔧 Development Auth helpers loaded!');
  console.log('📋 Available commands:');
  console.log('   • window.setDemoToken() - Set basic bypass token');
  console.log('   • window.setMerchantToken("merchant-id") - Set merchant-specific bypass token');
  console.log('   • window.clearDemoToken() - Clear the token');
  console.log('   • window.getCurrentToken() - View current token');
  console.log('');
  console.log('⚠️  These bypass Auth0 authentication for development only!');
}

export {};