/**
 * Import Politicians from Congress.gov API
 *
 * This script fetches current members of the 119th Congress (Senate and House)
 * and populates the database with their information.
 *
 * Required: CONGRESS_API_KEY environment variable
 * Get your free API key at: https://api.data.gov/signup/
 *
 * Usage:
 *   docker compose exec app npx tsx scripts/import-politicians.ts
 */

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const CONGRESS_API_KEY = process.env.CONGRESS_API_KEY;
const BASE_URL = "https://api.congress.gov/v3";

// Congress.gov API types
interface CongressMember {
  bioguideId: string;
  name: string;
  partyName: string;
  state: string;
  district?: number | null;
  depiction?: {
    imageUrl: string;
    attribution?: string;
  };
  terms?: {
    item: Array<{
      chamber: string;
      startYear: number;
      endYear?: number;
    }>;
  };
  updateDate: string;
  url: string;
}

interface CongressApiResponse {
  members?: CongressMember[];
  member?: CongressMember;
  pagination?: {
    count: number;
    next?: string;
  };
}

interface MemberDetail {
  addressInformation?: {
    officeAddress?: string;
    city?: string;
    district?: string;
    phoneNumber?: string;
  };
  officialWebsiteUrl?: string;
  identifiers?: {
    bioguideId?: string;
    fecIds?: string[];
  };
  partyHistory?: Array<{
    partyName: string;
    startYear: number;
  }>;
  terms?: {
    item: Array<{
      chamber: string;
      startYear: number;
      endYear?: number;
      memberType?: string;
    }>;
  };
}

async function fetchCongressMembers(offset: number = 0): Promise<{ members: CongressMember[], hasMore: boolean }> {
  if (!CONGRESS_API_KEY) {
    throw new Error('CONGRESS_API_KEY environment variable is required. Get one at: https://api.data.gov/signup/');
  }

  const limit = 250; // Max allowed per request
  const url = `${BASE_URL}/member?currentMember=true&limit=${limit}&offset=${offset}&api_key=${CONGRESS_API_KEY}`;

  console.log(`📡 Fetching members from Congress.gov API (offset: ${offset})...`);

  const response = await fetch(url);

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Congress.gov API error: ${response.status} ${response.statusText}\n${errorText}`);
  }

  const data: CongressApiResponse = await response.json();

  if (!data.members) {
    throw new Error('No members returned from Congress.gov API');
  }

  const hasMore = data.pagination?.next ? true : false;

  return { members: data.members, hasMore };
}

async function fetchMemberDetails(bioguideId: string): Promise<MemberDetail | null> {
  if (!CONGRESS_API_KEY) {
    return null;
  }

  const url = `${BASE_URL}/member/${bioguideId}?api_key=${CONGRESS_API_KEY}`;

  try {
    const response = await fetch(url);
    if (!response.ok) return null;

    const data = await response.json();
    return data.member || null;
  } catch (error) {
    console.warn(`  ⚠️  Could not fetch details for ${bioguideId}`);
    return null;
  }
}

function parseParty(partyName: string): string {
  // Map full party names to single letters
  const partyMap: Record<string, string> = {
    'Democratic': 'D',
    'Democrat': 'D',
    'Republican': 'R',
    'Independent': 'I',
    'Libertarian': 'L',
  };

  for (const [fullName, abbr] of Object.entries(partyMap)) {
    if (partyName.includes(fullName)) {
      return abbr;
    }
  }

  // Default to first letter if unknown
  return partyName.charAt(0).toUpperCase();
}

function getStateAbbreviation(stateName: string): string {
  // Map full state names to abbreviations
  const stateMap: Record<string, string> = {
    'Alabama': 'AL',
    'Alaska': 'AK',
    'Arizona': 'AZ',
    'Arkansas': 'AR',
    'California': 'CA',
    'Colorado': 'CO',
    'Connecticut': 'CT',
    'Delaware': 'DE',
    'Florida': 'FL',
    'Georgia': 'GA',
    'Hawaii': 'HI',
    'Idaho': 'ID',
    'Illinois': 'IL',
    'Indiana': 'IN',
    'Iowa': 'IA',
    'Kansas': 'KS',
    'Kentucky': 'KY',
    'Louisiana': 'LA',
    'Maine': 'ME',
    'Maryland': 'MD',
    'Massachusetts': 'MA',
    'Michigan': 'MI',
    'Minnesota': 'MN',
    'Mississippi': 'MS',
    'Missouri': 'MO',
    'Montana': 'MT',
    'Nebraska': 'NE',
    'Nevada': 'NV',
    'New Hampshire': 'NH',
    'New Jersey': 'NJ',
    'New Mexico': 'NM',
    'New York': 'NY',
    'North Carolina': 'NC',
    'North Dakota': 'ND',
    'Ohio': 'OH',
    'Oklahoma': 'OK',
    'Oregon': 'OR',
    'Pennsylvania': 'PA',
    'Rhode Island': 'RI',
    'South Carolina': 'SC',
    'South Dakota': 'SD',
    'Tennessee': 'TN',
    'Texas': 'TX',
    'Utah': 'UT',
    'Vermont': 'VT',
    'Virginia': 'VA',
    'Washington': 'WA',
    'West Virginia': 'WV',
    'Wisconsin': 'WI',
    'Wyoming': 'WY',
    'District of Columbia': 'DC',
    'Puerto Rico': 'PR',
    'American Samoa': 'AS',
    'Guam': 'GU',
    'Northern Mariana Islands': 'MP',
    'U.S. Virgin Islands': 'VI',
  };

  // If it's already an abbreviation (2 characters), return as-is
  if (stateName.length === 2) {
    return stateName.toUpperCase();
  }

  // Handle special case for Virgin Islands
  if (stateName === 'Virgin Islands') {
    return 'VI';
  }

  // Look up full name
  return stateMap[stateName] || stateName;
}

function getChamberFromTerms(terms?: { item: Array<{ chamber: string }> }): 'House' | 'Senate' {
  // Get the most recent chamber from terms
  if (!terms || !terms.item || terms.item.length === 0) {
    return 'House'; // Default to House
  }

  const mostRecentTerm = terms.item[terms.item.length - 1];
  return mostRecentTerm.chamber === 'Senate' ? 'Senate' : 'House';
}

function getElectionYear(chamber: string, terms?: { item: Array<{ startYear: number; endYear?: number }> }): number | null {
  if (!terms || !terms.item || terms.item.length === 0) return null;

  const mostRecentTerm = terms.item[terms.item.length - 1];

  if (chamber === 'Senate') {
    // Senators serve 6-year terms
    const startYear = mostRecentTerm.startYear;
    const estimatedEndYear = mostRecentTerm.endYear || (startYear + 6);
    return estimatedEndYear;
  } else {
    // House members serve 2-year terms
    const startYear = mostRecentTerm.startYear;
    const estimatedEndYear = mostRecentTerm.endYear || (startYear + 2);
    return estimatedEndYear;
  }
}

async function importPoliticians() {
  console.log('🏛️  Importing politicians from Congress.gov API\n');

  // Fetch chambers from database
  const senateRecord = await prisma.chamber.findUnique({ where: { name: 'Senate' } });
  const houseRecord = await prisma.chamber.findUnique({ where: { name: 'House' } });

  if (!senateRecord || !houseRecord) {
    throw new Error('Chambers not found in database. Run seed script first: npx prisma db seed');
  }

  // Fetch all states for mapping
  const states = await prisma.state.findMany();
  const stateMap = new Map(states.map(s => [s.abbreviation, s.id]));

  let totalImported = 0;
  let totalUpdated = 0;
  let totalErrors = 0;
  let offset = 0;
  let hasMore = true;

  // Fetch all current members (may require pagination)
  while (hasMore) {
    try {
      const { members, hasMore: more } = await fetchCongressMembers(offset);
      hasMore = more;

      console.log(`✓ Fetched ${members.length} members\n`);

      for (const member of members) {
        try {
          // Convert state name to abbreviation if needed
          const stateAbbr = getStateAbbreviation(member.state);
          const stateId = stateMap.get(stateAbbr);

          if (!stateId) {
            console.warn(`⚠️  Skipping ${member.name}: State ${member.state} (${stateAbbr}) not found in database`);
            totalErrors++;
            continue;
          }

          // Determine chamber from terms
          const chamberName = getChamberFromTerms(member.terms);
          const chamberId = chamberName === 'Senate' ? senateRecord.id : houseRecord.id;

          // Parse party
          const party = parseParty(member.partyName);

          // Get district (null for senators)
          const district = member.district ? member.district.toString() : null;

          // Split name (basic parsing - might need refinement)
          const nameParts = member.name.split(', ');
          const lastName = nameParts[0] || member.name;
          const firstName = nameParts[1]?.split(' ')[0] || '';

          // Get election year
          const electionYear = getElectionYear(chamberName, member.terms);
          const currentYear = new Date().getFullYear();
          const upForElection = electionYear ? electionYear <= currentYear + 2 : false;

          // Photo URL from depiction or fall back to theunitedstates.io
          const photoUrl = member.depiction?.imageUrl ||
                          `https://theunitedstates.io/images/congress/225x275/${member.bioguideId}.jpg`;

          // Fetch additional details (optional - adds API calls)
          // const details = await fetchMemberDetails(member.bioguideId);
          // For now, we'll skip detailed fetching to reduce API calls

          const existing = await prisma.politician.findUnique({
            where: { bioguideId: member.bioguideId },
          });

          const politicianData = {
            bioguideId: member.bioguideId,
            fecId: null, // Would need additional lookup
            firstName: firstName,
            lastName: lastName,
            party: party,
            stateId: stateId,
            district: district,
            chamberId: chamberId,
            photoUrl: photoUrl,
            website: null, // Available in member detail endpoint
            twitter: null, // Would need social media data
            phone: null, // Available in member detail endpoint
            inOffice: true, // We're only fetching current members
            upForElection: upForElection,
            electionYear: electionYear,
            termStart: null,
            termEnd: electionYear ? new Date(`${electionYear}-01-03`) : null,
          };

          await prisma.politician.upsert({
            where: { bioguideId: member.bioguideId },
            update: politicianData,
            create: politicianData,
          });

          const chamberLabel = chamberName === 'Senate' ? 'Senate' : `${member.state}-${district || 'At-Large'}`;
          const statusIcon = existing ? '↻' : '+';

          console.log(`  ${statusIcon} ${existing ? 'Updated' : 'Added'}: ${member.name} (${party}-${chamberLabel})`);

          if (existing) {
            totalUpdated++;
          } else {
            totalImported++;
          }
        } catch (error) {
          console.error(`  ✗ Error processing ${member.name}:`, error);
          totalErrors++;
        }
      }

      offset += members.length;

      // Rate limiting: wait a bit between pages
      if (hasMore) {
        console.log('\n⏳ Waiting 1 second before next page...\n');
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    } catch (error) {
      console.error('Error fetching members:', error);
      throw error;
    }
  }

  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('📊 Import Summary:');
  console.log(`   New politicians added: ${totalImported}`);
  console.log(`   Existing politicians updated: ${totalUpdated}`);
  console.log(`   Errors: ${totalErrors}`);
  console.log(`   Total processed: ${totalImported + totalUpdated + totalErrors}`);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
}

async function main() {
  try {
    await importPoliticians();
  } catch (error) {
    console.error('Fatal error during import:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
