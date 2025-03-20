"use client"

import { useFeatureFlags } from '@/providers/FeatureFlagProvider';
import { useRouter } from 'next/navigation';
import { useEffect, ReactNode, useState } from 'react';

interface FeatureGuardProps {
  children: ReactNode;
  featureName: keyof ReturnType<typeof useFeatureFlags>;
  redirectTo?: string;
  refreshInterval?: number | null;
}

export const FeatureGuard = ({ 
  children, 
  featureName, 
  redirectTo = '/dashboard',
  refreshInterval = null
}: FeatureGuardProps) => {
  const featureFlags = useFeatureFlags();
  const router = useRouter();
  const isEnabled = featureFlags[featureName];
  const [isInitialCheck, setIsInitialCheck] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  // Initial check for feature flag
  useEffect(() => {
    if (isInitialCheck) {
      // Only refresh flags once during initial check if feature isn't enabled
      if (!isEnabled) {
        setIsRefreshing(true);
        featureFlags.refreshFlags()
          .then(() => {
            setIsRefreshing(false);
            setIsInitialCheck(false);
          })
          .catch(error => {
            console.error('Error refreshing flags:', error);
            setIsRefreshing(false);
            setIsInitialCheck(false);
          });
      } else {
        // If feature is already enabled, no need to refresh
        setIsInitialCheck(false);
      }
    }
  }, [isEnabled, featureFlags, isInitialCheck]);
  
  // Redirect if feature is not enabled after initial check
  useEffect(() => {
    if (!isEnabled && !isInitialCheck && !isRefreshing) {
      router.push(redirectTo);
    }
  }, [isEnabled, router, redirectTo, isInitialCheck, isRefreshing]);
  
  // Set up periodic refreshing if requested
  useEffect(() => {
    if (refreshInterval) {
      const interval = setInterval(() => {
        // Don't trigger another refresh if already refreshing
        if (!isRefreshing) {
          setIsRefreshing(true);
          featureFlags.refreshFlags()
            .then(() => {
              setIsRefreshing(false);
            })
            .catch(error => {
              console.error('Error refreshing flags:', error);
              setIsRefreshing(false);
            });
        }
      }, refreshInterval);
      
      return () => clearInterval(interval);
    }
  }, [featureFlags, refreshInterval, isRefreshing]);
  
  // Show loading state during initial check or refreshing
  if (isInitialCheck || isRefreshing) {
    // You might want to return a loading indicator here instead of null
    return null;
  }
  
  // If feature is disabled after checks, hide content and redirect
  if (!isEnabled) {
    return null;
  }
  
  // Feature is enabled, show the content
  return <>{children}</>;
};