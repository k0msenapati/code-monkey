import { Navbar } from "@/components/landing/navbar"
import { Hero } from "@/components/landing/hero"
import { Features } from "@/components/landing/features"
import { Cta } from "@/components/landing/cta"
import { Faq } from "@/components/landing/faq"
import { Footer } from "@/components/landing/footer"
import { TeamSection } from "@/components/landing/team"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <Hero />
      <Features />
      <TeamSection />
      <Cta />
      <Faq />
      <Footer />
    </div>
  )
}

