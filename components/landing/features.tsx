"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import { MessageSquare, BookOpen, Map, Code, FileCode, BrainCircuit, Sparkles, Zap, Lock } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const features = [
  {
    icon: MessageSquare,
    title: "AI Chat Assistant",
    description:
      "Get instant help with coding problems, explanations of complex concepts, and personalized guidance from our AI assistant.",
  },
  {
    icon: BookOpen,
    title: "Interactive Quizzes",
    description: "Test your knowledge with AI-generated quizzes tailored to your learning goals and skill level.",
  },
  {
    icon: Map,
    title: "Learning Roadmaps",
    description:
      "Follow structured learning paths designed to take you from beginner to expert in any programming domain.",
  },
  {
    icon: Code,
    title: "Code Editor",
    description:
      "Write, run, and debug code directly in your browser with our powerful integrated development environment.",
  },
  {
    icon: FileCode,
    title: "Snippet Manager",
    description: "Save and organize your code snippets for easy access and reuse across your projects.",
  },
  {
    icon: BrainCircuit,
    title: "Personalized Learning",
    description:
      "Our AI analyzes your progress and adapts content to focus on areas where you need the most improvement.",
  },
]

const whyUs = [
  {
    icon: Sparkles,
    title: "AI-Powered Learning",
    description: "Our advanced AI understands your learning style and adapts content to help you learn faster.",
  },
  {
    icon: Zap,
    title: "All-in-One Platform",
    description: "No need to switch between different tools – everything you need is integrated in one place.",
  },
  {
    icon: Lock,
    title: "Privacy Focused",
    description: "Your code and learning data stay private and secure. We prioritize your privacy with end-to-end encryption.",
  },
]

export function Features() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <section id="features" className="py-20 md:py-32 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true, margin: "-100px" }}
          >
            <h2 className="text-3xl md:text-4xl font-bold">Powerful Tools for Modern Developers</h2>
            <p className="mt-4 text-lg text-muted-foreground">
              CodeMonkey combines everything you need to learn, practice, and excel in programming.
            </p>
          </motion.div>
        </div>

        <div ref={ref} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="h-full border-muted-foreground/20 hover:border-primary/50 transition-colors">
                <CardHeader>
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">{feature.description}</CardDescription>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <section id="why-us" className="pt-20 md:pt-32">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true, margin: "-100px" }}
            >
              <h2 className="text-3xl md:text-4xl font-bold">Why Choose CodeMonkey?</h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Our platform is designed with developers in mind, offering unique advantages that set us apart.
              </p>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {whyUs.map((reason, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 * index }}
                viewport={{ once: true, margin: "-100px" }}
                className="bg-card border rounded-xl p-6 text-center"
              >
                <div className="mx-auto h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <reason.icon className="h-7 w-7 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{reason.title}</h3>
                <p className="text-muted-foreground">
                  {reason.description}
                </p>
              </motion.div>
            ))}
          </div>
        </section>
      </div>
    </section>
  )
}

