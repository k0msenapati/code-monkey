"use client"

import { SimpleCard_V7 } from "../ui/fancy-cta"

export function Cta() {
  return (
    <section id="cta" className="py-10 md:py-16 flex justify-center items-center text-center">
      <SimpleCard_V7
        title="Ready to become a CodeMonkey?"
        description="Join the revolution & start coding today!"
      />
    </section>
  )
}

