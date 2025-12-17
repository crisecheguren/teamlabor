import { notFound } from "next/navigation";
import prisma from "@/lib/db";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { GradeBadge } from "@/components/ui/grade-badge";
import {
  MapPin,
  Building2,
  Phone,
  Globe,
  Twitter,
  ArrowLeft,
  Calendar,
  TrendingUp,
  FileText,
  DollarSign,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

interface PoliticianPageProps {
  params: {
    bioguideId: string;
  };
}

async function getPolitician(bioguideId: string) {
  const politician = await prisma.politician.findUnique({
    where: { bioguideId },
    include: {
      state: true,
      chamber: true,
      grades: {
        include: {
          category: true,
        },
        orderBy: {
          category: {
            sortOrder: "asc",
          },
        },
      },
      votes: {
        include: {
          bill: {
            include: {
              category: true,
            },
          },
        },
        orderBy: {
          voteDate: "desc",
        },
        take: 10,
      },
      donations: {
        include: {
          corporation: {
            include: {
              industry: true,
            },
          },
        },
        orderBy: {
          amount: "desc",
        },
        take: 10,
      },
    },
  });

  return politician;
}

export default async function PoliticianPage({
  params,
}: PoliticianPageProps) {
  const politician = await getPolitician(params.bioguideId);

  if (!politician) {
    notFound();
  }

  // Calculate overall grade from all categories
  const overallGrade = politician.grades.length > 0
    ? (() => {
        const totalWeight = politician.grades.reduce(
          (sum, g) => sum + g.category.weight,
          0
        );
        const weightedScore = politician.grades.reduce(
          (sum, g) => sum + g.numericScore * g.category.weight,
          0
        );
        const avgScore = weightedScore / totalWeight;

        // Convert to letter grade
        if (avgScore >= 90) return "A";
        if (avgScore >= 80) return "B";
        if (avgScore >= 70) return "C";
        if (avgScore >= 60) return "D";
        return "F";
      })()
    : null;

  const partyColors = {
    D: "bg-blue-100 text-blue-800 border-blue-200",
    R: "bg-red-100 text-red-800 border-red-200",
    I: "bg-purple-100 text-purple-800 border-purple-200",
  };

  const partyNames = {
    D: "Democrat",
    R: "Republican",
    I: "Independent",
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Back Button */}
      <div className="mb-6">
        <Button asChild variant="ghost" size="sm">
          <Link href="/find-your-rep">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Find Your Rep
          </Link>
        </Button>
      </div>

      <div className="mx-auto max-w-4xl">
        {/* Header Card */}
        <Card className="mb-8 p-6">
          <div className="flex flex-col gap-6 sm:flex-row">
            {/* Photo */}
            <div className="flex-shrink-0">
              {politician.photoUrl ? (
                <Image
                  src={politician.photoUrl}
                  alt={`${politician.firstName} ${politician.lastName}`}
                  width={225}
                  height={275}
                  className="h-auto w-48 rounded-lg border"
                />
              ) : (
                <div className="flex h-64 w-48 items-center justify-center rounded-lg border bg-muted">
                  <span className="text-muted-foreground">No photo</span>
                </div>
              )}
            </div>

            {/* Info */}
            <div className="flex-1">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h1 className="mb-2 text-3xl font-bold text-labor-navy">
                    {politician.firstName} {politician.lastName}
                  </h1>
                </div>
                {overallGrade && (
                  <div className="text-center">
                    <div className="text-xs font-semibold uppercase text-muted-foreground mb-1">
                      Overall Grade
                    </div>
                    <GradeBadge grade={overallGrade} size="lg" />
                  </div>
                )}
              </div>

              <div className="mb-4 flex flex-wrap gap-2">
                <Badge
                  variant="outline"
                  className={partyColors[politician.party as keyof typeof partyColors]}
                >
                  {partyNames[politician.party as keyof typeof partyNames]}
                </Badge>
                <Badge variant="outline">
                  <Building2 className="mr-1 h-3 w-3" />
                  {politician.chamber.name}
                </Badge>
                <Badge variant="outline">
                  <MapPin className="mr-1 h-3 w-3" />
                  {politician.state.name}
                  {politician.district && ` - District ${politician.district}`}
                </Badge>
              </div>

              {/* Contact Info */}
              <div className="space-y-2">
                {politician.phone && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Phone className="h-4 w-4" />
                    <span>{politician.phone}</span>
                  </div>
                )}
                {politician.website && (
                  <div className="flex items-center gap-2 text-sm">
                    <Globe className="h-4 w-4" />
                    <a
                      href={politician.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-labor-red hover:underline"
                    >
                      Official Website
                    </a>
                  </div>
                )}
                {politician.twitter && (
                  <div className="flex items-center gap-2 text-sm">
                    <Twitter className="h-4 w-4" />
                    <a
                      href={`https://twitter.com/${politician.twitter}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-labor-red hover:underline"
                    >
                      @{politician.twitter}
                    </a>
                  </div>
                )}
              </div>

              {/* Election Info */}
              {politician.upForElection && politician.electionYear && (
                <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 p-3">
                  <div className="flex items-center gap-2 text-sm text-amber-800">
                    <Calendar className="h-4 w-4" />
                    <span className="font-medium">
                      Up for re-election in {politician.electionYear}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </Card>

        {/* Grades Section */}
        <Card className="mb-8 p-6">
          <h2 className="mb-4 text-2xl font-bold text-labor-navy">
            Labor Grades
          </h2>
          {politician.grades.length > 0 ? (
            <div className="space-y-4">
              {politician.grades.map((grade) => (
                <div
                  key={grade.id}
                  className="flex items-center justify-between rounded-lg border p-4"
                >
                  <div className="flex-1">
                    <h3 className="font-semibold text-labor-navy">
                      {grade.category.name}
                    </h3>
                    {grade.category.description && (
                      <p className="text-sm text-muted-foreground">
                        {grade.category.description}
                      </p>
                    )}
                    {grade.reasoning && (
                      <p className="mt-2 text-sm">{grade.reasoning}</p>
                    )}
                  </div>
                  <div className="ml-4 text-right">
                    <GradeBadge grade={grade.letterGrade} size="lg" />
                    <div className="mt-1 text-xs text-muted-foreground">
                      Score: {grade.numericScore.toFixed(0)}/100
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {grade.sessionYear} Session
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-lg border bg-muted/50 p-6 text-center">
              <p className="text-muted-foreground">
                Grades coming soon! We&apos;re currently collecting voting data
                and analyzing this representative&apos;s record on labor issues.
              </p>
            </div>
          )}
        </Card>

        {/* Voting Record Section */}
        <Card className="mb-8 p-6">
          <h2 className="mb-4 flex items-center gap-2 text-2xl font-bold text-labor-navy">
            <FileText className="h-6 w-6" />
            Voting Record
          </h2>
          {politician.votes.length > 0 ? (
            <div className="space-y-3">
              {politician.votes.map((vote) => {
                const isProLabor =
                  (vote.bill.laborPosition === "support" &&
                    vote.position === "yea") ||
                  (vote.bill.laborPosition === "oppose" &&
                    vote.position === "nay");
                const isAntiLabor =
                  (vote.bill.laborPosition === "support" &&
                    vote.position === "nay") ||
                  (vote.bill.laborPosition === "oppose" &&
                    vote.position === "yea");

                return (
                  <div
                    key={vote.id}
                    className="flex items-start gap-4 rounded-lg border p-4"
                  >
                    <div className="flex-1">
                      <div className="mb-1 flex items-center gap-2">
                        <h3 className="font-semibold">{vote.bill.title}</h3>
                        {vote.bill.category && (
                          <Badge variant="outline" className="text-xs">
                            {vote.bill.category.name}
                          </Badge>
                        )}
                      </div>
                      {vote.bill.shortTitle && (
                        <p className="text-sm text-muted-foreground">
                          {vote.bill.shortTitle}
                        </p>
                      )}
                      <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
                        <span>
                          {vote.bill.billType.toUpperCase()}{" "}
                          {vote.bill.billNumber}
                        </span>
                        <span>•</span>
                        <span>
                          {new Date(vote.voteDate).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge
                        variant={
                          isProLabor
                            ? "default"
                            : isAntiLabor
                              ? "destructive"
                              : "secondary"
                        }
                        className="mb-1"
                      >
                        {vote.position.toUpperCase()}
                      </Badge>
                      {vote.bill.laborPosition && (
                        <div className="text-xs text-muted-foreground">
                          Labor: {vote.bill.laborPosition}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="rounded-lg border bg-muted/50 p-6 text-center">
              <p className="text-muted-foreground">
                Voting record analysis coming soon. Check back later to see how{" "}
                {politician.firstName} {politician.lastName} votes on key labor
                issues.
              </p>
            </div>
          )}
        </Card>

        {/* Campaign Finance Section */}
        <Card className="p-6">
          <h2 className="mb-4 flex items-center gap-2 text-2xl font-bold text-labor-navy">
            <DollarSign className="h-6 w-6" />
            Campaign Finance
          </h2>
          {politician.donations.length > 0 ? (
            <div>
              <div className="mb-4 rounded-lg bg-amber-50 border border-amber-200 p-4">
                <div className="flex items-start gap-2">
                  <TrendingUp className="h-5 w-5 text-amber-600 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-amber-900">
                      Top Corporate Donors
                    </h3>
                    <p className="text-sm text-amber-700">
                      Showing the largest corporate contributions. Follow the
                      money to understand potential conflicts of interest.
                    </p>
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                {politician.donations.map((donation) => (
                  <div
                    key={donation.id}
                    className="flex items-center justify-between rounded-lg border p-4"
                  >
                    <div className="flex-1">
                      <h3 className="font-semibold">
                        {donation.corporation.name}
                      </h3>
                      <div className="mt-1 flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">
                          {donation.corporation.industry.name}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {donation.donationType.replace("_", " ").toUpperCase()}
                        </span>
                      </div>
                      {donation.corporation.description && (
                        <p className="mt-2 text-sm text-muted-foreground">
                          {donation.corporation.description}
                        </p>
                      )}
                    </div>
                    <div className="ml-4 text-right">
                      <div className="text-xl font-bold text-labor-navy">
                        ${donation.amount.toLocaleString()}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {donation.electionCycle} cycle
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="rounded-lg border bg-muted/50 p-6 text-center">
              <p className="text-muted-foreground">
                Campaign finance data coming soon. We&apos;ll show you the top
                corporate donors and their industries here.
              </p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
