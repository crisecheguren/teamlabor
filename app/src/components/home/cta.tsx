import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Mail } from "lucide-react";

export function CTASection() {
  return (
    <section className="py-20 md:py-28">
      <div className="container mx-auto px-4">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-labor-navy to-labor-navy/80 px-6 py-16 text-white shadow-2xl md:px-12 md:py-24">
          {/* Background decoration */}
          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-labor-red/20 blur-3xl" />
          <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-labor-red/10 blur-3xl" />

          <div className="relative mx-auto max-w-3xl text-center">
            <h2 className="mb-6 text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl">
              Ready to Fight for Workers?
            </h2>
            <p className="mx-auto mb-10 max-w-xl text-lg text-gray-300">
              Join thousands of workers staying informed about their
              representatives. Get updates on key votes, new grades, and
              organizing resources.
            </p>

            {/* Email signup placeholder */}
            <div className="mx-auto mb-8 flex max-w-md flex-col gap-4 sm:flex-row">
              <div className="relative flex-1">
                <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="h-12 w-full rounded-lg border-0 bg-white/10 pl-10 pr-4 text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-labor-red"
                />
              </div>
              <Button variant="labor" size="lg" className="h-12">
                Stay Informed
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>

            <p className="text-xs text-gray-400">
              We respect your privacy. Unsubscribe at any time.
            </p>

            {/* Alternative actions */}
            <div className="mt-12 flex flex-wrap items-center justify-center gap-4 border-t border-white/10 pt-8">
              <Button
                variant="outline"
                className="border-white/30 bg-transparent text-white hover:bg-white/10"
                asChild
              >
                <Link href="/resources">
                  Organizing Resources
                </Link>
              </Button>
              <Button
                variant="outline"
                className="border-white/30 bg-transparent text-white hover:bg-white/10"
                asChild
              >
                <Link href="/about">
                  Our Methodology
                </Link>
              </Button>
              <Button
                variant="outline"
                className="border-white/30 bg-transparent text-white hover:bg-white/10"
                asChild
              >
                <Link href="/about#contribute">
                  Contribute Data
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
