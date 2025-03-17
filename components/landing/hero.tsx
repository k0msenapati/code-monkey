"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowRight, Code, MessageSquare, BookOpen, Map, Home, Star, Github } from "lucide-react"
import { Button } from "@/components/ui/button"

export function Hero() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <section className="relative pt-32 pb-20 md:pt-40 md:pb-32 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.02] pointer-events-none" />
      <div className="absolute top-0 left-0 right-0 h-[500px] bg-gradient-to-br from-primary/20 via-background to-background pointer-events-none" />

      <div className="container mx-auto px-4 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-4xl mx-auto my-0 md:my-32"
        >
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-4xl md:text-6xl font-bold tracking-tight"
          >
            Supercharge Your Coding Journey with <span className="text-primary">AI-Powered</span> Tools
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mt-6 text-xl text-muted-foreground max-w-2xl mx-auto"
          >
            CodeMonkey combines AI chat, interactive quizzes, personalized learning roadmaps, and coding tools in one
            powerful platform.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="mt-10 flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link href="/sign-in">
              <Button size="lg" className="gap-2" effect="ringHover">
                Get Started Free
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <a href="https://github.com/kom-senapati/code-monkey" target="_blank" rel="noopener noreferrer">
              <Button size="lg" variant="outline" effect="shineHover" className="group gap-2">
                <Github className="h-6 w-6" />
                <span>Star on GitHub</span>
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 transition-colors group-hover:text-yellow-500" />
                  <span className="tabular-nums">2</span>
                </div>
              </Button>
            </a>
          </motion.div>
        </motion.div>

        {/* Animated dashboard preview */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.8 }}
          className="mt-16 relative"
        >
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent z-10 pointer-events-none h-[20%] bottom-0 top-auto" />

          <div className="bg-background/50 backdrop-blur border rounded-xl shadow-2xl overflow-hidden">
            <div className="border-b p-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-red-500" />
                  <div className="h-3 w-3 rounded-full bg-yellow-500" />
                  <div className="h-3 w-3 rounded-full bg-green-500" />
                </div>
                <div className="bg-muted px-4 py-1 rounded-full text-xs text-muted-foreground">
                  codemonkey.dev/dashboard
                </div>
              </div>
            </div>
            <div className="grid grid-cols-5 h-[400px] md:h-[500px]">
              {/* Sidebar */}
              <div className="col-span-1 border-r p-4 hidden md:block">
                <div className="flex items-center gap-2 mb-6">
                  <div className="h-6 w-6 rounded-md bg-primary" />
                  <div className="h-4 w-24 bg-muted rounded" />
                </div>
                <div className="space-y-4">
                  {[Home, MessageSquare, BookOpen, Map, Code].map((Icon, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: 1 + i * 0.1 }}
                      className="flex items-center gap-2"
                    >
                      <Icon className="h-4 w-4 text-primary" />
                      <div className="h-3 w-20 bg-muted rounded" />
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Main content */}
              <div className="col-span-5 md:col-span-4 p-6 overflow-hidden">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.6, delay: 1.2 }}
                >
                  <div className="h-8 w-48 bg-muted rounded mb-6" />
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    {[1, 2, 3].map((i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 1.4 + i * 0.1 }}
                        className="bg-card border rounded-lg p-4"
                      >
                        <div className="flex justify-between items-start mb-4">
                          <div className="h-4 w-24 bg-muted rounded" />
                          <div className="h-6 w-6 rounded-full bg-primary/20" />
                        </div>
                        <div className="h-8 w-16 bg-muted rounded-lg" />
                        <div className="h-3 w-32 bg-muted rounded mt-2" />
                      </motion.div>
                    ))}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: 1.8 }}
                      className="bg-card border rounded-lg p-4"
                    >
                      <div className="h-5 w-32 bg-muted rounded mb-4" />
                      <div className="space-y-3">
                        {[1, 2, 3].map((i) => (
                          <div key={i} className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded-full bg-muted" />
                            <div className="space-y-1 flex-1">
                              <div className="h-3 w-24 bg-muted rounded" />
                              <div className="h-2 w-full bg-muted rounded" />
                            </div>
                          </div>
                        ))}
                      </div>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: 2 }}
                      className="bg-card border rounded-lg p-4"
                    >
                      <div className="h-5 w-32 bg-muted rounded mb-4" />
                      <div className="grid grid-cols-2 gap-2">
                        {[1, 2, 3, 4].map((i) => (
                          <div key={i} className="bg-muted h-12 rounded-md flex items-center justify-center">
                            <div className="h-4 w-4 rounded-full bg-primary/20" />
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

