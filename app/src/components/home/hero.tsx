import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Users, Scale, Vote } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-labor-navy to-labor-navy/90 py-20 text-white md:py-32">
      {/* Background pattern */}
      <div className="absolute inset-0 bg-[url('/images/grid-pattern.svg')] opacity-10" />
      
      <div className="container relative mx-auto px-4">
        <div className="mx-auto max-w-4xl text-center">
          {/* Badge */}
          <div className="mb-6 inline-flex items-center rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-sm backdrop-blur">
            <span className="mr-2">✊</span>
            <span>Fighting for workers&apos; rights</span>
          </div>

          {/* Main headline */}
          <h1 className="mb-6 text-4xl font-bold tracking-tight md:text-6xl lg:text-7xl">
            Know Where Your{" "}
            <span className="text-labor-red">Representatives</span>{" "}
            Really Stand
          </h1>

          {/* Subheadline */}
          <p className="mx-auto mb-10 max-w-2xl text-lg text-gray-300 md:text-xl">
            We grade politicians on their labor record, expose their corporate
            donors, and provide resources to help workers organize for better
            conditions.
          </p>

          {/* CTA buttons */}
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button variant="labor" size="xl" asChild>
              <Link href="/find-your-rep">
                Find Your Rep
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button
              variant="outline"
              size="xl"
              className="border-white/30 bg-transparent text-white hover:bg-white/10"
              asChild
            >
              <Link href="/resources">
                Organizing Resources
              </Link>
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="mx-auto mt-16 grid max-w-4xl gap-8 md:mt-24 md:grid-cols-3">
          <div className="text-center">
            <div className="mb-2 flex justify-center">
              <Users className="h-8 w-8 text-labor-red" />
            </div>
            <div className="text-3xl font-bold md:text-4xl">535</div>
            <div className="text-sm text-gray-400">Members of Congress</div>
          </div>
          <div className="text-center">
            <div className="mb-2 flex justify-center">
              <Vote className="h-8 w-8 text-labor-red" />
            </div>
            <div className="text-3xl font-bold md:text-4xl">1,000+</div>
            <div className="text-sm text-gray-400">Key Votes Tracked</div>
          </div>
          <div className="text-center">
            <div className="mb-2 flex justify-center">
              <Scale className="h-8 w-8 text-labor-red" />
            </div>
            <div className="text-3xl font-bold md:text-4xl">$2.5B+</div>
            <div className="text-sm text-gray-400">Corporate Money Exposed</div>
          </div>
        </div>
      </div>
    </section>
  );
}
