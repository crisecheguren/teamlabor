import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";

// Force dynamic rendering for this API route
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const state = searchParams.get("state");
    const district = searchParams.get("district");
    const chamber = searchParams.get("chamber");

    if (!state) {
      return NextResponse.json(
        { error: "State parameter is required" },
        { status: 400 }
      );
    }

    // Find the state record
    const stateRecord = await prisma.state.findUnique({
      where: { abbreviation: state.toUpperCase() },
    });

    if (!stateRecord) {
      return NextResponse.json(
        { error: "Invalid state abbreviation" },
        { status: 400 }
      );
    }

    // Build the query
    const where: any = {
      stateId: stateRecord.id,
      inOffice: true,
    };

    // Filter by chamber if specified
    if (chamber) {
      const chamberRecord = await prisma.chamber.findUnique({
        where: { name: chamber === "house" ? "House" : "Senate" },
      });

      if (chamberRecord) {
        where.chamberId = chamberRecord.id;
      }
    }

    // Filter by district if specified (House only)
    if (district && chamber === "house") {
      where.district = district;
    }

    // Fetch politicians
    const politicians = await prisma.politician.findMany({
      where,
      include: {
        state: true,
        chamber: true,
      },
      orderBy: [
        { chamber: { name: "asc" } }, // Senate first, then House
        { lastName: "asc" },
      ],
    });

    return NextResponse.json({
      success: true,
      politicians: politicians.map((p) => ({
        id: p.id,
        bioguideId: p.bioguideId,
        firstName: p.firstName,
        lastName: p.lastName,
        fullName: `${p.firstName} ${p.lastName}`,
        party: p.party,
        state: p.state.name,
        stateAbbr: p.state.abbreviation,
        district: p.district,
        chamber: p.chamber.name,
        photoUrl: p.photoUrl,
        website: p.website,
        twitter: p.twitter,
        phone: p.phone,
        upForElection: p.upForElection,
        electionYear: p.electionYear,
      })),
    });
  } catch (error) {
    console.error("Error fetching politicians:", error);
    return NextResponse.json(
      { error: "Failed to fetch politicians" },
      { status: 500 }
    );
  }
}
