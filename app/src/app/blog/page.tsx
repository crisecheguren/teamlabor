import { Button } from "@/components/ui/button";
import Link from "next/link";

export const metadata = {
  title: "Blog",
  description: "News, analysis, and updates on labor issues and political accountability.",
};

export default function BlogPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="mx-auto max-w-2xl text-center">
        <h1 className="mb-4 text-4xl font-bold text-labor-navy">
          Blog
        </h1>
        <p className="mb-8 text-lg text-muted-foreground">
          News, analysis, and commentary on labor issues, worker rights, and
          political accountability. Coming soon in Phase 4.
        </p>
        <div className="rounded-lg border bg-muted/50 p-8">
          <p className="mb-4 text-sm text-muted-foreground">
            Content planned:
          </p>
          <ul className="mb-6 space-y-2 text-left text-sm">
            <li>✓ Analysis of key votes</li>
            <li>✓ Deep dives on corporate influence</li>
            <li>✓ Worker success stories</li>
            <li>✓ Policy explainers</li>
            <li>✓ Election coverage</li>
            <li>✓ Organizing tips</li>
          </ul>
          <Button asChild>
            <Link href="/">Back to Home</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
