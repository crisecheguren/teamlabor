import { NextRequest, NextResponse } from "next/server";

// Types for Census Geocoder API response
interface CensusGeography {
  GEOID: string;
  CENTLAT: string;
  CENTLON: string;
  NAME: string;
  BASENAME?: string;
  CD119?: string; // Congressional District (119th Congress)
  STATE?: string;
}

interface CensusAddressMatch {
  tigerLine: {
    side: string;
    tigerLineId: string;
  };
  geographies: {
    "119th Congressional Districts"?: CensusGeography[];
    "Congressional Districts"?: CensusGeography[];
    "States"?: CensusGeography[];
    "Counties"?: CensusGeography[];
  };
  coordinates: {
    x: number;
    y: number;
  };
  addressComponents: {
    zip: string;
    streetName: string;
    preType: string;
    city: string;
    preDirection: string;
    suffixDirection: string;
    fromAddress: string;
    state: string;
    suffixType: string;
    toAddress: string;
    suffixQualifier: string;
    preQualifier: string;
  };
  matchedAddress: string;
}

interface CensusResponse {
  result: {
    input: {
      address: {
        address: string;
      };
      benchmark: {
        benchmarkName: string;
      };
    };
    addressMatches: CensusAddressMatch[];
  };
}

export interface RepresentativeResult {
  success: boolean;
  address?: {
    matched: string;
    input: string;
  };
  district?: {
    state: string;
    stateAbbr: string;
    districtNumber: string;
    districtName: string;
    chamber: "House" | "Senate";
  };
  senators?: {
    state: string;
    stateAbbr: string;
  };
  error?: string;
}

// State abbreviation to full name mapping
const stateNames: Record<string, string> = {
  AL: "Alabama", AK: "Alaska", AZ: "Arizona", AR: "Arkansas", CA: "California",
  CO: "Colorado", CT: "Connecticut", DE: "Delaware", FL: "Florida", GA: "Georgia",
  HI: "Hawaii", ID: "Idaho", IL: "Illinois", IN: "Indiana", IA: "Iowa",
  KS: "Kansas", KY: "Kentucky", LA: "Louisiana", ME: "Maine", MD: "Maryland",
  MA: "Massachusetts", MI: "Michigan", MN: "Minnesota", MS: "Mississippi", MO: "Missouri",
  MT: "Montana", NE: "Nebraska", NV: "Nevada", NH: "New Hampshire", NJ: "New Jersey",
  NM: "New Mexico", NY: "New York", NC: "North Carolina", ND: "North Dakota", OH: "Ohio",
  OK: "Oklahoma", OR: "Oregon", PA: "Pennsylvania", RI: "Rhode Island", SC: "South Carolina",
  SD: "South Dakota", TN: "Tennessee", TX: "Texas", UT: "Utah", VT: "Vermont",
  VA: "Virginia", WA: "Washington", WV: "West Virginia", WI: "Wisconsin", WY: "Wyoming",
  DC: "District of Columbia", PR: "Puerto Rico", GU: "Guam", VI: "Virgin Islands",
  AS: "American Samoa", MP: "Northern Mariana Islands"
};

// State FIPS codes to abbreviations
const fipsToState: Record<string, string> = {
  "01": "AL", "02": "AK", "04": "AZ", "05": "AR", "06": "CA",
  "08": "CO", "09": "CT", "10": "DE", "11": "DC", "12": "FL",
  "13": "GA", "15": "HI", "16": "ID", "17": "IL", "18": "IN",
  "19": "IA", "20": "KS", "21": "KY", "22": "LA", "23": "ME",
  "24": "MD", "25": "MA", "26": "MI", "27": "MN", "28": "MS",
  "29": "MO", "30": "MT", "31": "NE", "32": "NV", "33": "NH",
  "34": "NJ", "35": "NM", "36": "NY", "37": "NC", "38": "ND",
  "39": "OH", "40": "OK", "41": "OR", "42": "PA", "44": "RI",
  "45": "SC", "46": "SD", "47": "TN", "48": "TX", "49": "UT",
  "50": "VT", "51": "VA", "53": "WA", "54": "WV", "55": "WI",
  "56": "WY", "72": "PR", "66": "GU", "78": "VI", "60": "AS",
  "69": "MP"
};

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const address = searchParams.get("address");

  if (!address) {
    return NextResponse.json(
      { success: false, error: "Address is required" },
      { status: 400 }
    );
  }

  try {
    // Call Census Geocoder API
    const censusUrl = new URL(
      "https://geocoding.geo.census.gov/geocoder/geographies/onelineaddress"
    );
    censusUrl.searchParams.set("address", address);
    censusUrl.searchParams.set("benchmark", "Public_AR_Current");
    censusUrl.searchParams.set("vintage", "Current_Current");
    censusUrl.searchParams.set("layers", "all");
    censusUrl.searchParams.set("format", "json");

    const response = await fetch(censusUrl.toString(), {
      headers: {
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Census API returned ${response.status}`);
    }

    const data: CensusResponse = await response.json();

    // Check if we got any address matches
    if (!data.result.addressMatches || data.result.addressMatches.length === 0) {
      return NextResponse.json({
        success: false,
        error: "Could not find that address. Please check the address and try again.",
      });
    }

    const match = data.result.addressMatches[0];
    const geographies = match.geographies;

    // Extract congressional district info (try 119th Congress first, then fallback)
    const congressionalDistricts =
      geographies["119th Congressional Districts"] ||
      geographies["Congressional Districts"];

    if (!congressionalDistricts || congressionalDistricts.length === 0) {
      return NextResponse.json({
        success: false,
        error: "Could not determine congressional district for this address.",
      });
    }

    const district = congressionalDistricts[0];

    // Parse the GEOID to get state and district
    // GEOID format: SSDD where SS is state FIPS and DD is district number
    const geoid = district.GEOID;
    const stateFips = geoid.substring(0, 2);
    const districtNum = geoid.substring(2);

    const stateAbbr = fipsToState[stateFips] || "Unknown";
    const stateName = stateNames[stateAbbr] || "Unknown";

    // Format district number (handle "00" for at-large districts)
    const districtNumber = districtNum === "00" ? "At-Large" : parseInt(districtNum, 10).toString();
    const districtName = districtNum === "00"
      ? `${stateName} At-Large`
      : `${stateName} District ${districtNumber}`;

    const result: RepresentativeResult = {
      success: true,
      address: {
        matched: match.matchedAddress,
        input: address,
      },
      district: {
        state: stateName,
        stateAbbr: stateAbbr,
        districtNumber: districtNumber,
        districtName: districtName,
        chamber: "House",
      },
      senators: {
        state: stateName,
        stateAbbr: stateAbbr,
      },
    };

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error fetching representative data:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to look up address. Please try again later.",
      },
      { status: 500 }
    );
  }
}
