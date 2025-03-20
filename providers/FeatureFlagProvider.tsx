"use client"

import React, { createContext, useContext, ReactNode, useRef } from 'react';
import { useFlags } from 'flagsmith/react';
import { FlagsmithProvider } from 'flagsmith/react';
import { createFlagsmithInstance } from 'flagsmith/isomorphic';
import { IState } from 'flagsmith/types';

interface FeatureFlags {
  generateRoadmap: boolean;
  // todo: more feature flags
}

// Create the context with default values
const FeatureFlagContext = createContext<FeatureFlags>({
  generateRoadmap: false,
});

export const useFeatureFlags = () => useContext(FeatureFlagContext);

const InnerFeatureFlagProvider = ({ children }: { children: ReactNode }) => {
  let flagsData;
  try {
    flagsData = useFlags(['generate_roadmap']);
  } catch (error) {
    console.error('Error fetching flags:', error);
    flagsData = { generate_roadmap: { enabled: false } };
  }

  const value: FeatureFlags = {
    generateRoadmap: flagsData?.generate_roadmap?.enabled || false,
  };

  return (
    <FeatureFlagContext.Provider value={value}>
      {children}
    </FeatureFlagContext.Provider>
  );
};

export const FeatureFlagProvider = ({ 
  children,
  serverState 
}: { 
  children: ReactNode;
  serverState?: IState;
}) => {
  const flagsmithInstance = useRef(createFlagsmithInstance());

  return (
    <FlagsmithProvider
      flagsmith={flagsmithInstance.current}
      serverState={serverState}
      options={{
        environmentID: process.env.NEXT_PUBLIC_FLAGSMITH_ENVIRONMENT_ID || '',
      }}
    >
      <InnerFeatureFlagProvider>
        {children}
      </InnerFeatureFlagProvider>
    </FlagsmithProvider>
  );
};