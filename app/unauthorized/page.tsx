"use client"

import Link from "next/link"
import { ArrowLeft, ShieldAlert } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/auth-context"

export default function UnauthorizedPage() {
  const { user } = useAuth()

  console.log("UnauthorizedPage", user)

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4">
      <div className="text-center max-w-md">
        <ShieldAlert className="h-16 w-16 text-destructive mx-auto mb-4" />
        <h1 className="text-3xl font-bold mb-2">Access Denied</h1>
        <p className="text-muted-foreground mb-6">
          {user
            ? "Sorry, you don't have permission to access this page."
            : "You need to be logged in to access this page."}
        </p>
        <div className="flex flex-col gap-2">
          <Link href="/dashboard">
            <Button variant="outline" className="gap-2 w-full">
              <ArrowLeft className="h-4 w-4" />
              Go to Dashboard
            </Button>
          </Link>
          {!user && (
            <Link href="/sign-in">
              <Button className="w-full">Sign In</Button>
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}