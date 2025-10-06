import { NextRequest } from 'next/server';

const afterCallback = async (req: NextRequest, session: any) => {
  // Add custom claims to the session
  if (session.user) {
    // Add merchant_id from Auth0 user metadata
    const merchantId = session.user['https://fesi.app/merchant_id'];
    if (merchantId) {
      session.user.merchant_id = merchantId;
    }
    
    // Add roles
    const roles = session.user['https://fesi.app/roles'] || [];
    session.user.roles = roles;
  }
  
  return session;
};

export default afterCallback;