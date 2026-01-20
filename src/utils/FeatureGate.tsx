import React, { useState } from 'react';
import { useSubscription } from '../hooks/useSubscription';
import UpgradePrompt from '../components/molecules/UpgradePrompt/UpgradePrompt';

/**
 * Example: How to protect a feature with subscription check
 * 
 * Usage in any component:
 * 
 * import { withFeatureGate } from './FeatureGate';
 * 
 * function MyProtectedComponent() {
 *   return <div>Protected content here</div>;
 * }
 * 
 * export default withFeatureGate(MyProtectedComponent, 'table_service', 'Table Service');
 */

interface FeatureGateProps {
  feature: keyof ReturnType<typeof useSubscription>['subscription']['features'];
  featureName: string;
  children: React.ReactNode;
  fallback?: React.ReactNode;
  showUpgradePrompt?: boolean;
}

export function FeatureGate({ 
  feature, 
  featureName, 
  children, 
  fallback,
  showUpgradePrompt = true 
}: FeatureGateProps) {
  const { hasFeature, loading } = useSubscription();
  const [showPrompt, setShowPrompt] = useState(false);

  if (loading) {
    return <div>Loading...</div>;
  }

  const hasAccess = hasFeature(feature as any);

  if (!hasAccess) {
    if (showUpgradePrompt && showPrompt) {
      return (
        <UpgradePrompt
          feature={feature}
          featureName={featureName}
          onClose={() => setShowPrompt(false)}
        />
      );
    }

    if (fallback) {
      return <>{fallback}</>;
    }

    return (
      <div style={{ padding: '2rem', textAlign: 'center', background: '#f9fafb', borderRadius: '8px' }}>
        <h3 style={{ marginBottom: '1rem' }}>🔒 {featureName} Not Available</h3>
        <p style={{ color: '#6b7280', marginBottom: '1.5rem' }}>
          Upgrade your plan to access {featureName.toLowerCase()}.
        </p>
        <button
          onClick={() => setShowPrompt(true)}
          style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            border: 'none',
            padding: '0.75rem 2rem',
            borderRadius: '6px',
            fontWeight: 600,
            cursor: 'pointer'
          }}
        >
          View Upgrade Options
        </button>
      </div>
    );
  }

  return <>{children}</>;
}

/**
 * HOC to wrap a component with feature gating
 */
export function withFeatureGate<P extends object>(
  Component: React.ComponentType<P>,
  feature: string,
  featureName: string
) {
  return function FeatureGatedComponent(props: P) {
    return (
      <FeatureGate feature={feature as any} featureName={featureName}>
        <Component {...props} />
      </FeatureGate>
    );
  };
}

/**
 * Hook to check feature access and trigger upgrade prompt
 */
export function useFeatureGate() {
  const { hasFeature, requiresUpgrade } = useSubscription();
  const [promptFeature, setPromptFeature] = useState<{
    feature: string;
    name: string;
  } | null>(null);

  const checkFeature = (feature: string, featureName: string): boolean => {
    const hasAccess = hasFeature(feature as any);
    if (!hasAccess) {
      setPromptFeature({ feature, name: featureName });
    }
    return hasAccess;
  };

  const UpgradePromptComponent = promptFeature ? (
    <UpgradePrompt
      feature={promptFeature.feature}
      featureName={promptFeature.name}
      onClose={() => setPromptFeature(null)}
    />
  ) : null;

  return {
    checkFeature,
    UpgradePromptComponent
  };
}
