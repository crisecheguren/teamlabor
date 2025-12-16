import { Button } from "@/components/ui/button";
import Link from "next/link";

export const metadata = {
  title: "Resources",
  description: "Guides and resources for unionizing and understanding your workplace rights.",
};

export default function ResourcesPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="mx-auto max-w-2xl text-center">
        <h1 className="mb-4 text-4xl font-bold text-labor-navy">
          Worker Resources
        </h1>
        <p className="mb-8 text-lg text-muted-foreground">
          Guides, tools, and information to help workers understand their rights
          and organize for better conditions. Coming soon in Phase 4.
        </p>
        <div className="rounded-lg border bg-muted/50 p-8">
          <p className="mb-4 text-sm text-muted-foreground">
            Resources planned:
          </p>
          <ul className="mb-6 space-y-2 text-left text-sm">
            <li>✓ Unionizing your workplace guide</li>
            <li>✓ Know your rights fact sheets</li>
            <li>✓ Legal resources and contacts</li>
            <li>✓ Labor organization directory</li>
            <li>✓ Workplace safety information</li>
            <li>✓ Wage theft resources</li>
          </ul>
          <Button asChild>
            <Link href="/">Back to Home</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
