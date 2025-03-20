"use client"

import { useFeatureFlags } from '@/providers/FeatureFlagProvider';
import { useRouter } from 'next/navigation';
import { useEffect, ReactNode } from 'react';

interface FeatureGuardProps {
  children: ReactNode;
  featureName: keyof ReturnType<typeof useFeatureFlags>;
  redirectTo?: string;
}

export const FeatureGuard = ({ 
  children, 
  featureName, 
  redirectTo = '/dashboard' 
}: FeatureGuardProps) => {
  const featureFlags = useFeatureFlags();
  const router = useRouter();
  const isEnabled = featureFlags[featureName];
  
  useEffect(() => {
    if (!isEnabled) {
      router.push(redirectTo);
    }
  }, [isEnabled, router, redirectTo]);
  
  if (!isEnabled) {
    return null;
  }
  
  return <>{children}</>;
};