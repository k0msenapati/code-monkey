import { Card, CardContent } from "@/components/ui/card";
import { GithubIcon } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

interface TeamMemberProps {
  name: string;
  role: string;
  github: string;
  image: string;
}

const teamMembers: TeamMemberProps[] = [
  {
    name: "Rohith Singh",
    role: "Founder",
    github: "https://github.com/rohittcodes",
    image: "https://github.com/rohittcodes.png",
  },
  {
    name: "K Om Senapati",
    role: "Developer",
    github: "https://github.com/kom-senapati",
    image: "https://github.com/kom-senapati.png",
  },
];

export const TeamSection = () => {
  return (
    <section id="team" className="container py-24 sm:py-32 bg-background">
      <h2 className="text-lg text-primary text-center mb-2 tracking-wider">
        Our Team
      </h2>

      <h2 className="text-3xl md:text-4xl text-center font-bold mb-4">
        Meet the Developers
      </h2>

      <h3 className="md:w-1/2 mx-auto text-xl text-center text-muted-foreground mb-12">
        Passionate developers building tools to help you become a better
        programmer.
      </h3>

      <div className="grid sm:grid-cols-2 gap-8 max-w-4xl mx-auto">
        {teamMembers.map((member) => (
          <Card key={member.github} className="bg-muted/50 border-none">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center">
                <div className="relative w-32 h-32 mb-4">
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    className="rounded-full object-cover"
                  />
                </div>
                <h3 className="text-2xl font-bold mb-2">{member.name}</h3>
                <p className="text-muted-foreground mb-4">{member.role}</p>
                <Link
                  href={member.github}
                  target="_blank"
                  className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
                >
                  <GithubIcon size={20} />
                  <span>GitHub</span>
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
};
