'use client'

import * as React from 'react'
import {
  ThemeProvider as NextThemesProvider,
  type ThemeProviderProps,
} from 'next-themes'
import { useFeatureFlags } from '@/providers/FeatureFlagProvider'

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  const toggleTheme = useFeatureFlags().toggleTheme

  const modifiedProps = {
    ...props,
    forcedTheme: toggleTheme ? undefined : 'light'
  }

  return <NextThemesProvider {...modifiedProps}>{children}</NextThemesProvider>
}
