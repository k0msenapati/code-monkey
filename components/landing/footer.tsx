"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { BrainCircuit, Github, Twitter, Linkedin } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-background text-foreground py-10">
      <div className="container mx-auto px-6 flex flex-col items-center text-center space-y-6">
        
        <div className='rounded-full w-full h-[1px] bg-zinc-300 dark:bg-zinc-800' />
        
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <BrainCircuit className="w-12 h-12 text-primary" />
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-muted-foreground text-sm"
        >
          © {new Date().getFullYear()} Codemonkey. Built for hackers, by hackers.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex space-x-4"
        >
          <Link href="https://github.com" target="_blank" rel="noopener noreferrer">
            <Github className="w-6 h-6 text-muted-foreground hover:text-primary transition-colors" />
          </Link>
          <Link href="https://twitter.com" target="_blank" rel="noopener noreferrer">
            <Twitter className="w-6 h-6 text-muted-foreground hover:text-primary transition-colors" />
          </Link>
          <Link href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
            <Linkedin className="w-6 h-6 text-muted-foreground hover:text-primary transition-colors" />
          </Link>
        </motion.div>
      </div>
    </footer>
  );
}
