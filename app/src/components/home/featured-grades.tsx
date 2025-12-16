import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowRight, AlertTriangle } from "lucide-react";

// Placeholder data - will be replaced with real data from database
const featuredPoliticians = [
  {
    id: "1",
    name: "Example Senator A",
    state: "CA",
    party: "D",
    chamber: "Senate",
    grade: "A",
    upForElection: true,
    electionYear: 2026,
    topIssue: "Sponsored PRO Act for union rights",
  },
  {
    id: "2",
    name: "Example Representative B",
    state: "TX",
    party: "R",
    chamber: "House",
    grade: "F",
    upForElection: true,
    electionYear: 2026,
    topIssue: "Voted against minimum wage increase 5 times",
  },
  {
    id: "3",
    name: "Example Senator C",
    state: "OH",
    party: "D",
    chamber: "Senate",
    grade: "B",
    upForElection: true,
    electionYear: 2026,
    topIssue: "Mixed record on trade agreements",
  },
  {
    id: "4",
    name: "Example Representative D",
    state: "FL",
    party: "R",
    chamber: "House",
    grade: "D",
    upForElection: true,
    electionYear: 2026,
    topIssue: "Received $500k from anti-union PACs",
  },
];

function getGradeVariant(grade: string) {
  const letter = grade.charAt(0).toUpperCase();
  switch (letter) {
    case "A":
      return "gradeA" as const;
    case "B":
      return "gradeB" as const;
    case "C":
      return "gradeC" as const;
    case "D":
      return "gradeD" as const;
    case "F":
      return "gradeF" as const;
    default:
      return "default" as const;
  }
}

function getPartyVariant(party: string) {
  switch (party.toUpperCase()) {
    case "D":
      return "democrat" as const;
    case "R":
      return "republican" as const;
    case "I":
      return "independent" as const;
    default:
      return "default" as const;
  }
}

export function FeaturedGradesSection() {
  return (
    <section id="grades" className="bg-muted/50 py-20 md:py-28">
      <div className="container mx-auto px-4">
        {/* Section header */}
        <div className="mx-auto mb-12 max-w-3xl text-center">
          <div className="mb-4 inline-flex items-center rounded-full bg-labor-red/10 px-4 py-1.5 text-sm font-medium text-labor-red">
            <AlertTriangle className="mr-2 h-4 w-4" />
            2026 Elections
          </div>
          <h2 className="mb-4 text-3xl font-bold tracking-tight text-labor-navy md:text-4xl">
            Politicians Up for Re-Election
          </h2>
          <p className="text-lg text-muted-foreground">
            These representatives face voters soon. Know their record before you
            cast your ballot.
          </p>
        </div>

        {/* Politicians grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {featuredPoliticians.map((politician) => (
            <Card
              key={politician.id}
              className="group transition-all hover:shadow-lg"
            >
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{politician.name}</CardTitle>
                    <CardDescription>
                      {politician.chamber} • {politician.state}
                    </CardDescription>
                  </div>
                  <Badge
                    variant={getGradeVariant(politician.grade)}
                    className="text-lg font-bold px-3 py-1"
                  >
                    {politician.grade}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="mb-4 flex items-center gap-2">
                  <Badge variant={getPartyVariant(politician.party)}>
                    {politician.party === "D"
                      ? "Democrat"
                      : politician.party === "R"
                      ? "Republican"
                      : "Independent"}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    Up in {politician.electionYear}
                  </span>
                </div>
                <p className="mb-4 text-sm text-muted-foreground">
                  {politician.topIssue}
                </p>
                <Button variant="ghost" size="sm" className="w-full" asChild>
                  <Link href={`/politicians/${politician.id}`}>
                    View Full Profile
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* View all link */}
        <div className="mt-12 text-center">
          <Button variant="default" size="lg" asChild>
            <Link href="/politicians">
              View All Politicians
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
