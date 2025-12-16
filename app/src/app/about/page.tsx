import { Button } from "@/components/ui/button";
import Link from "next/link";

export const metadata = {
  title: "About",
  description: "Learn about Team Labor's mission, methodology, and the team behind the project.",
};

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="mx-auto max-w-3xl">
        <h1 className="mb-8 text-4xl font-bold text-labor-navy">
          About Team Labor
        </h1>
        
        <section className="mb-12">
          <h2 className="mb-4 text-2xl font-semibold">Our Mission</h2>
          <p className="mb-4 text-muted-foreground">
            Team Labor is a labor-focused advocacy organization dedicated to
            transparency, accountability, and worker empowerment. We believe
            that workers deserve to know where their elected representatives
            truly stand on issues that affect their lives.
          </p>
          <p className="text-muted-foreground">
            By tracking voting records, exposing corporate donor relationships,
            and providing accessible resources, we aim to give workers the
            information they need to make informed decisions and advocate
            effectively for their interests.
          </p>
        </section>

        <section id="methodology" className="mb-12">
          <h2 className="mb-4 text-2xl font-semibold">Grading Methodology</h2>
          <p className="mb-4 text-muted-foreground">
            Our grading system evaluates politicians across several categories
            important to workers:
          </p>
          <ul className="mb-4 list-inside list-disc space-y-2 text-muted-foreground">
            <li><strong>Labor Rights</strong> — Union support, collective bargaining, worker protections</li>
            <li><strong>Wealth Equality</strong> — Progressive taxation, social safety net, anti-monopoly</li>
            <li><strong>Healthcare Access</strong> — Universal coverage, prescription costs, worker health</li>
            <li><strong>Climate & Green Jobs</strong> — Clean energy jobs, just transition</li>
            <li><strong>Corporate Accountability</strong> — Regulations, consumer protection</li>
          </ul>
          <p className="text-muted-foreground">
            Grades are calculated based on key votes, weighted by importance to
            workers. We identify bills relevant to each category, assign a
            &quot;labor position&quot; (support/oppose), and score politicians based on
            alignment with worker interests.
          </p>
        </section>

        <section id="data-sources" className="mb-12">
          <h2 className="mb-4 text-2xl font-semibold">Data Sources</h2>
          <p className="mb-4 text-muted-foreground">
            We use publicly available data from official government sources:
          </p>
          <ul className="mb-4 list-inside list-disc space-y-2 text-muted-foreground">
            <li>Voting records from Congress.gov and ProPublica</li>
            <li>Campaign finance data from OpenSecrets and FEC filings</li>
            <li>Bill information from GovTrack and Congress.gov</li>
          </ul>
        </section>

        <section id="contribute" className="mb-12">
          <h2 className="mb-4 text-2xl font-semibold">Get Involved</h2>
          <p className="mb-4 text-muted-foreground">
            Team Labor is a community effort. There are many ways to contribute:
          </p>
          <ul className="mb-4 list-inside list-disc space-y-2 text-muted-foreground">
            <li>Help identify key votes and bills</li>
            <li>Share our grades with your community</li>
            <li>Report errors or suggest improvements</li>
            <li>Contribute to our open-source codebase</li>
          </ul>
        </section>

        <div className="text-center">
          <Button asChild>
            <Link href="/">Back to Home</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
