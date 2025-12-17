import prisma from "@/lib/db";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { GradeBadge } from "@/components/ui/grade-badge";
import { MapPin, Users, Building2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export const metadata = {
  title: "Politicians by State",
  description:
    "Browse members of Congress organized by state. View grades and donor information.",
};

async function getPoliticiansByState() {
  // Get all states with politicians
  const states = await prisma.state.findMany({
    where: {
      politicians: {
        some: {
          inOffice: true,
        },
      },
    },
    include: {
      politicians: {
        where: {
          inOffice: true,
        },
        include: {
          chamber: true,
          grades: {
            include: {
              category: true,
            },
          },
        },
        orderBy: [
          { chamber: { name: "asc" } }, // Senate first, then House
          { lastName: "asc" },
        ],
      },
    },
    orderBy: {
      name: "asc",
    },
  });

  return states;
}

function calculateOverallGrade(
  grades: Array<{ numericScore: number; category: { weight: number } }>
): string | null {
  if (grades.length === 0) return null;

  const totalWeight = grades.reduce((sum, g) => sum + g.category.weight, 0);
  const weightedScore = grades.reduce(
    (sum, g) => sum + g.numericScore * g.category.weight,
    0
  );
  const avgScore = weightedScore / totalWeight;

  if (avgScore >= 90) return "A";
  if (avgScore >= 80) return "B";
  if (avgScore >= 70) return "C";
  if (avgScore >= 60) return "D";
  return "F";
}

export default async function PoliticiansPage() {
  const states = await getPoliticiansByState();

  const partyColors = {
    D: "bg-blue-100 text-blue-800 border-blue-200",
    R: "bg-red-100 text-red-800 border-red-200",
    I: "bg-purple-100 text-purple-800 border-purple-200",
  };

  const totalPoliticians = states.reduce(
    (sum, state) => sum + state.politicians.length,
    0
  );

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="mb-2 text-4xl font-bold text-labor-navy">
          Politicians by State
        </h1>
        <p className="text-lg text-muted-foreground">
          Browse {totalPoliticians} members of Congress organized by state.
          {states.length === 0 &&
            " Import politicians to see them listed here."}
        </p>
      </div>

      {/* Map placeholder - for future interactive map */}
      <Card className="mb-8 p-8 bg-muted/30">
        <div className="text-center">
          <MapPin className="mx-auto h-12 w-12 text-muted-foreground mb-2" />
          <p className="text-sm text-muted-foreground">
            Interactive map coming soon - select your state below
          </p>
        </div>
      </Card>

      {/* States list */}
      {states.length > 0 ? (
        <div className="space-y-6">
          {states.map((state) => (
            <Card key={state.id} className="p-6">
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <h2 className="text-2xl font-bold text-labor-navy">
                    {state.name}
                  </h2>
                  <Badge variant="outline">{state.abbreviation}</Badge>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Users className="h-4 w-4" />
                  <span>{state.politicians.length} representatives</span>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {state.politicians.map((politician) => {
                  const overallGrade = calculateOverallGrade(politician.grades);

                  return (
                    <Link
                      key={politician.id}
                      href={`/politicians/${politician.bioguideId}`}
                      className="group"
                    >
                      <Card className="h-full p-4 transition-shadow hover:shadow-md">
                        <div className="flex gap-3">
                          {/* Photo */}
                          <div className="flex-shrink-0">
                            {politician.photoUrl ? (
                              <Image
                                src={politician.photoUrl}
                                alt={`${politician.firstName} ${politician.lastName}`}
                                width={80}
                                height={98}
                                className="h-24 w-20 rounded border object-cover"
                              />
                            ) : (
                              <div className="flex h-24 w-20 items-center justify-center rounded border bg-muted">
                                <Users className="h-8 w-8 text-muted-foreground" />
                              </div>
                            )}
                          </div>

                          {/* Info */}
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-labor-navy group-hover:text-labor-red transition-colors">
                              {politician.firstName} {politician.lastName}
                            </h3>

                            <div className="mt-1 flex flex-wrap gap-1">
                              <Badge
                                variant="outline"
                                className={`text-xs ${partyColors[politician.party as keyof typeof partyColors]}`}
                              >
                                {politician.party}
                              </Badge>
                              <Badge variant="outline" className="text-xs">
                                <Building2 className="mr-1 h-3 w-3" />
                                {politician.chamber.name}
                              </Badge>
                            </div>

                            {politician.district && (
                              <p className="mt-1 text-xs text-muted-foreground">
                                District {politician.district}
                              </p>
                            )}

                            {overallGrade && (
                              <div className="mt-2">
                                <GradeBadge grade={overallGrade} size="sm" />
                              </div>
                            )}
                          </div>
                        </div>
                      </Card>
                    </Link>
                  );
                })}
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="p-12 text-center">
          <Users className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
          <h3 className="text-xl font-semibold mb-2">No Politicians Yet</h3>
          <p className="text-muted-foreground mb-4">
            Import politicians from the Congress.gov API to populate this page.
          </p>
          <code className="text-sm bg-muted px-3 py-1 rounded">
            docker compose exec app npx tsx scripts/import-politicians.ts
          </code>
        </Card>
      )}
    </div>
  );
}
