"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { BrainCircuit, Github, Twitter, Linkedin } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-background text-foreground py-16 md:py-24">
      <div className="container mx-auto px-6 flex flex-col items-center text-center space-y-8 md:space-y-12">

        <div className="w-full max-w-lg md:max-w-2xl border-t border-muted-foreground opacity-25"></div>

        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <BrainCircuit className="w-24 h-24 text-primary" />
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-muted-foreground text-xl font-semibold"
        >
          Codemonkey - Built for hackers, by hackers.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex space-x-8"
        >
          <Link href="https://github.com/kom-senapati/code-monkey" target="_blank" rel="noopener noreferrer">
            <Github className="w-8 h-8 text-muted-foreground hover:text-primary transition-colors" />
          </Link>
          <Link href="https://x.com/kom_senapati" target="_blank" rel="noopener noreferrer">
            <Twitter className="w-8 h-8 text-muted-foreground hover:text-primary transition-colors" />
          </Link>
          <Link href="https://www.linkedin.com/in/kom-senapati/" target="_blank" rel="noopener noreferrer">
            <Linkedin className="w-8 h-8 text-muted-foreground hover:text-primary transition-colors" />
          </Link>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-muted-foreground text-base"
        >
          © {new Date().getFullYear()} Codemonkey. All rights reserved.
        </motion.p>
      </div>
    </footer>
  );
}