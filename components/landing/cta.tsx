"use client"

import { CardBody, MultilayerCardV_2 } from "../ui/fancy-cta"

export function Cta() {
  return (
    <section id="cta" className="py-10 md:py-20">
      <div className="container mx-auto px-4">
        <MultilayerCardV_2>
          <CardBody
            title="Ready to become a CodeMonkey?"
            description="Join the revolution & start coding today!"
          />
        </MultilayerCardV_2>
      </div>
    </section>
  )
}

