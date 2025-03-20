"use client"

import React, { createContext, useContext, ReactNode, useRef, useState, useCallback } from 'react';
import { useFlags, useFlagsmith } from 'flagsmith/react';
import { FlagsmithProvider } from 'flagsmith/react';
import { createFlagsmithInstance } from 'flagsmith/isomorphic';
import { IState } from 'flagsmith/types';

interface FeatureFlags {
  generateRoadmap: boolean;
  chatCodeImport: boolean;
  createQuiz: boolean;
  generateQuiz: boolean;
  importQuiz: boolean;
  importSnippetFromClipboard: boolean;
  saveSnippetsInEditor: boolean;
  toggleTheme: boolean;
  refreshFlags: () => Promise<void>; // Add refresh function
}

const defaultFlags = {
  generateRoadmap: false,
  chatCodeImport: false,
  createQuiz: false,
  generateQuiz: false,
  importQuiz: false,
  importSnippetFromClipboard: false,
  saveSnippetsInEditor: false,
  toggleTheme: false,
  refreshFlags: async () => {}, // Default empty function
};

const FeatureFlagContext = createContext<FeatureFlags>(defaultFlags);

export const useFeatureFlags = () => useContext(FeatureFlagContext);

const InnerFeatureFlagProvider = ({ children }: { children: ReactNode }) => {
  const [refreshCounter, setRefreshCounter] = useState(0);
  const flagsmith = useFlagsmith();
  
  let flagsData;
  try {
    flagsData = useFlags([
      'generate_roadmap',
      'chat_code_import',
      'create_quiz',
      'generate_quiz',
      'import_quiz',
      'import_snippet_from_clipboard',
      'save_snippets_in_editor',
      'toggle_theme',
    ]);
  } catch (error) {
    console.error('Error fetching flags:', error);
    flagsData = {
      generate_roadmap: { enabled: false },
      chat_code_import: { enabled: false },
      create_quiz: { enabled: false },
      generate_quiz: { enabled: false },
      import_quiz: { enabled: false },
      import_snippet_from_clipboard: { enabled: false },
      save_snippets_in_editor: { enabled: false },
      toggle_theme: { enabled: false },
    };
  }

  const refreshFlags = useCallback(async () => {
    try {
      const identity = typeof flagsmith.identity === 'object' ? flagsmith.identity : { id: '', traits: {} };
      await flagsmith.identify(identity.id, identity.traits);
      setRefreshCounter(prev => prev + 1);
    } catch (error) {
      console.error('Error refreshing flags:', error);
    }
  }, [flagsmith]);

  const value: FeatureFlags = {
    generateRoadmap: flagsData?.generate_roadmap?.enabled || false,
    chatCodeImport: flagsData?.chat_code_import?.enabled || false,
    createQuiz: flagsData?.create_quiz?.enabled || false,
    generateQuiz: flagsData?.generate_quiz?.enabled || false,
    importQuiz: flagsData?.import_quiz?.enabled || false,
    importSnippetFromClipboard: flagsData?.import_snippet_from_clipboard?.enabled || false,
    saveSnippetsInEditor: flagsData?.save_snippets_in_editor?.enabled || false,
    toggleTheme: flagsData?.toggle_theme?.enabled || false,
    refreshFlags,
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