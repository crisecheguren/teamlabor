import { notFound } from "next/navigation";
import prisma from "@/lib/db";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  MapPin,
  Building2,
  Phone,
  Globe,
  Twitter,
  ArrowLeft,
  Calendar,
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
              <h1 className="mb-2 text-3xl font-bold text-labor-navy">
                {politician.firstName} {politician.lastName}
              </h1>

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
          <div className="rounded-lg border bg-muted/50 p-6 text-center">
            <p className="text-muted-foreground">
              Grades coming soon! We&apos;re currently collecting voting data
              and analyzing this representative&apos;s record on labor issues.
            </p>
          </div>
        </Card>

        {/* Voting Record Section */}
        <Card className="mb-8 p-6">
          <h2 className="mb-4 text-2xl font-bold text-labor-navy">
            Voting Record
          </h2>
          <div className="rounded-lg border bg-muted/50 p-6 text-center">
            <p className="text-muted-foreground">
              Voting record analysis coming soon. Check back later to see how{" "}
              {politician.firstName} {politician.lastName} votes on key labor
              issues.
            </p>
          </div>
        </Card>

        {/* Campaign Finance Section */}
        <Card className="p-6">
          <h2 className="mb-4 text-2xl font-bold text-labor-navy">
            Campaign Finance
          </h2>
          <div className="rounded-lg border bg-muted/50 p-6 text-center">
            <p className="text-muted-foreground">
              Campaign finance data coming soon. We&apos;ll show you the top
              corporate donors and their industries here.
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}
