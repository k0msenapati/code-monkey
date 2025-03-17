"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { BrainCircuit, Menu, X, User, Github } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ThemeSwitch } from "@/components/theme-switch"
import { cn } from "@/lib/utils"

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

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
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled ? "bg-background/80 backdrop-blur-md border-b shadow-sm py-3" : "bg-transparent py-5",
      )}
    >
      <div className="container mx-auto px-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <BrainCircuit className="h-8 w-8 text-primary" />
          <span className="text-xl font-bold text-primary">CodeMonkey</span>
        </Link>

        <nav className="hidden md:flex items-center gap-6">
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

        <div className="hidden md:flex items-center gap-4">
          <ThemeSwitch />
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

        <div className="flex md:hidden items-center gap-2">
          <ThemeSwitch />
          <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="md:hidden bg-background border-b shadow-md">
          <div className="container mx-auto px-4 py-4 flex flex-col gap-4">
            <Link
              href="#features"
              className="py-2 text-foreground/80 hover:text-primary transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Features
            </Link>
            <Link
              href="#why-us"
              className="py-2 text-foreground/80 hover:text-primary transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Why Us
            </Link>
            <Link
              href="#faq"
              className="py-2 text-foreground/80 hover:text-primary transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              FAQ
            </Link>
            <div className="flex flex-col gap-2 pt-2 border-t">
              <Link href="/sign-in">
                <Button variant="ghost" className="w-full flex items-center gap-2" onClick={() => setIsMobileMenuOpen(false)}>
                  <User className="h-5 w-5" />
                  <span>Sign In</span>
                </Button>
              </Link>
              <Link href="https://github.com" target="_blank" rel="noopener noreferrer">
                <Button variant="ghost" className="w-full flex items-center gap-2" onClick={() => setIsMobileMenuOpen(false)}>
                  <Github className="h-5 w-5" />
                  <span>GitHub</span>
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}

