import type React from "react"
import { Inter } from "next/font/google"
import type { Metadata } from "next"
import { ThemeProvider } from "@/components/theme-provider"
import { AuthProvider } from "@/contexts/auth-context"
import "./globals.css"
import { FeatureFlagProvider } from '@/providers/FeatureFlagProvider';
import { createFlagsmithInstance } from "flagsmith/isomorphic"
import getTraits from "@/lib/getTraits"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "CodeMonkey - Developer Dashboard",
  description: "AI-powered developer tools and resources",
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const flagsmith = createFlagsmithInstance()
  const data = await getTraits();
  await flagsmith.init({
    environmentID: process.env.FLAGSMITH_ENVIRONMENT_ID || '',
    identity: data.username,
    traits: {
      userId: data.userId,
      username: data.username,
      email: data.email,
      isPremium: data.isPremium || false,
    },
  })
  const serverState = flagsmith.getState()
  
  return (
    <html lang="en" suppressHydrationWarning>
      <FeatureFlagProvider serverState={serverState}>
        <body className={inter.className}>
          <AuthProvider>
            <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
              {children}
            </ThemeProvider>
          </AuthProvider>
        </body>
      </FeatureFlagProvider>
    </html>
  )
}
