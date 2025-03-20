"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { BrainCircuit, Menu, X, User, Github } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-transparent py-3",
      )}
    >
      <div className="container mx-auto px-4 flex items-center justify-center">
        {!isScrolled && (
          <Link href="/" className="flex items-center gap-2">
            <BrainCircuit className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold text-primary">CodeMonkey</span>
          </Link>
        )}

        <nav className="hidden md:flex items-center gap-6  bg-muted px-6 py-2 rounded-xl shadow-md mx-80">
          <Link href="#features" className="text-foreground/80 hover:text-primary transition-colors cursor-pointer hover:underline">
            Features
          </Link>
          <Link href="#why-us" className="text-foreground/80 hover:text-primary transition-colors cursor-pointer hover:underline">
            Why Us
          </Link>
          <Link href="#faq" className="text-foreground/80 hover:text-primary transition-colors cursor-pointer hover:underline">
            FAQ
          </Link>
        </nav>

        {!isScrolled && (
          <div className="hidden md:flex items-center gap-4">
            <Link href="/sign-in">
              <Button variant="ghost" size="icon">
                <User className="h-5 w-5" />
              </Button>
            </Link>
            <Link href="https://github.com" target="_blank" rel="noopener noreferrer">
              <Button variant="ghost" size="icon">
                <Github className="h-5 w-5" />
              </Button>
            </Link>
          </div>
        )}
      </div>
    </header>
  )
}

