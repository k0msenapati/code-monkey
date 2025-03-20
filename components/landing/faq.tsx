"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

const faqs = [
  {
    question: "What is CodeMonkey?",
    answer:
      "CodeMonkey is an AI-powered platform designed to help developers learn, practice, and improve their coding skills. It combines AI chat assistance, interactive quizzes, personalized learning roadmaps, and coding tools in one integrated environment.",
  },
  {
    question: "Do I need to be an experienced programmer to use CodeMonkey?",
    answer:
      "Not at all! CodeMonkey is designed for developers of all skill levels, from beginners to experts. Our AI adapts to your knowledge level and provides appropriate guidance and challenges.",
  },
  {
    question: "How does the AI chat assistant work?",
    answer:
      "Our AI chat assistant uses advanced language models to understand your coding questions and provide helpful, contextual responses. You can ask about specific programming concepts, get help debugging code, or receive guidance on best practices.",
  },
  {
    question: "How are the learning roadmaps created?",
    answer:
      "Our learning roadmaps are designed by experienced developers and educators, then personalized by our AI based on your goals and current skill level. Each roadmap provides a structured path to master specific technologies or concepts.",
  },
  {
    question: "Is my code secure on CodeMonkey?",
    answer:
      "Absolutely. We take security seriously and use encryption to protect your code and personal data. Your code is private by default and only shared when you explicitly choose to do so.",
  },
]

export function Faq() {
  const [openItems, setOpenItems] = useState<string[]>([])

  const toggleItem = (value: string) => {
    setOpenItems((prev) => (prev.includes(value) ? prev.filter((item) => item !== value) : [...prev, value]))
  }

  return (
    <section id="faq" className="py-20 md:py-32 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true, margin: "-100px" }}
          >
            <h2 className="text-3xl md:text-4xl font-bold">Frequently Asked Questions</h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Got questions? We've got answers. If you don't see what you're looking for, feel free to contact us.
            </p>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true, margin: "-100px" }}
          className="max-w-3xl mx-auto"
        >
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left">{faq.question}</AccordionTrigger>
                <AccordionContent>{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true, margin: "-100px" }}
          className="mt-16 text-center"
        >
          <p className="text-muted-foreground">
            Still have questions?{" "}
            <a href="#team" className="text-primary hover:underline">
              Contact our team
            </a>
          </p>
        </motion.div>
      </div>
    </section>
  )
}
