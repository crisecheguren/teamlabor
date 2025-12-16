import { Button } from "@/components/ui/button";
import Link from "next/link";

export const metadata = {
  title: "Politicians",
  description: "View grades and donor information for all members of Congress.",
};

export default function PoliticiansPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="mx-auto max-w-2xl text-center">
        <h1 className="mb-4 text-4xl font-bold text-labor-navy">
          Politicians
        </h1>
        <p className="mb-8 text-lg text-muted-foreground">
          This page will display searchable, filterable grades for all members
          of Congress. Coming soon in Phase 2.
        </p>
        <div className="rounded-lg border bg-muted/50 p-8">
          <p className="mb-4 text-sm text-muted-foreground">
            Features planned:
          </p>
          <ul className="mb-6 space-y-2 text-left text-sm">
            <li>✓ Search by name, state, or district</li>
            <li>✓ Filter by party, chamber, grade</li>
            <li>✓ Sort by grade, donations, election year</li>
            <li>✓ Individual politician profiles</li>
            <li>✓ Voting record details</li>
            <li>✓ Corporate donor breakdown</li>
          </ul>
          <Button asChild>
            <Link href="/">Back to Home</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
