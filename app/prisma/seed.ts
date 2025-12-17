import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // Create chambers
  const house = await prisma.chamber.upsert({
    where: { name: "House" },
    update: {},
    create: { name: "House" },
  });

  const senate = await prisma.chamber.upsert({
    where: { name: "Senate" },
    update: {},
    create: { name: "Senate" },
  });

  console.log("✓ Created chambers");

  // Create all states and territories
  const states = [
    { name: "Alabama", abbreviation: "AL" },
    { name: "Alaska", abbreviation: "AK" },
    { name: "Arizona", abbreviation: "AZ" },
    { name: "Arkansas", abbreviation: "AR" },
    { name: "California", abbreviation: "CA" },
    { name: "Colorado", abbreviation: "CO" },
    { name: "Connecticut", abbreviation: "CT" },
    { name: "Delaware", abbreviation: "DE" },
    { name: "Florida", abbreviation: "FL" },
    { name: "Georgia", abbreviation: "GA" },
    { name: "Hawaii", abbreviation: "HI" },
    { name: "Idaho", abbreviation: "ID" },
    { name: "Illinois", abbreviation: "IL" },
    { name: "Indiana", abbreviation: "IN" },
    { name: "Iowa", abbreviation: "IA" },
    { name: "Kansas", abbreviation: "KS" },
    { name: "Kentucky", abbreviation: "KY" },
    { name: "Louisiana", abbreviation: "LA" },
    { name: "Maine", abbreviation: "ME" },
    { name: "Maryland", abbreviation: "MD" },
    { name: "Massachusetts", abbreviation: "MA" },
    { name: "Michigan", abbreviation: "MI" },
    { name: "Minnesota", abbreviation: "MN" },
    { name: "Mississippi", abbreviation: "MS" },
    { name: "Missouri", abbreviation: "MO" },
    { name: "Montana", abbreviation: "MT" },
    { name: "Nebraska", abbreviation: "NE" },
    { name: "Nevada", abbreviation: "NV" },
    { name: "New Hampshire", abbreviation: "NH" },
    { name: "New Jersey", abbreviation: "NJ" },
    { name: "New Mexico", abbreviation: "NM" },
    { name: "New York", abbreviation: "NY" },
    { name: "North Carolina", abbreviation: "NC" },
    { name: "North Dakota", abbreviation: "ND" },
    { name: "Ohio", abbreviation: "OH" },
    { name: "Oklahoma", abbreviation: "OK" },
    { name: "Oregon", abbreviation: "OR" },
    { name: "Pennsylvania", abbreviation: "PA" },
    { name: "Rhode Island", abbreviation: "RI" },
    { name: "South Carolina", abbreviation: "SC" },
    { name: "South Dakota", abbreviation: "SD" },
    { name: "Tennessee", abbreviation: "TN" },
    { name: "Texas", abbreviation: "TX" },
    { name: "Utah", abbreviation: "UT" },
    { name: "Vermont", abbreviation: "VT" },
    { name: "Virginia", abbreviation: "VA" },
    { name: "Washington", abbreviation: "WA" },
    { name: "West Virginia", abbreviation: "WV" },
    { name: "Wisconsin", abbreviation: "WI" },
    { name: "Wyoming", abbreviation: "WY" },
    { name: "District of Columbia", abbreviation: "DC" },
    { name: "Puerto Rico", abbreviation: "PR" },
    { name: "American Samoa", abbreviation: "AS" },
    { name: "Guam", abbreviation: "GU" },
    { name: "Northern Mariana Islands", abbreviation: "MP" },
    { name: "U.S. Virgin Islands", abbreviation: "VI" },
  ];

  for (const state of states) {
    await prisma.state.upsert({
      where: { abbreviation: state.abbreviation },
      update: {},
      create: state,
    });
  }

  console.log("✓ Created states");

  // Create grade categories
  const categories = [
    {
      name: "Labor Rights",
      slug: "labor-rights",
      description: "Union support, collective bargaining, worker protections",
      icon: "Users",
      sortOrder: 1,
    },
    {
      name: "Wealth Equality",
      slug: "wealth-equality",
      description: "Progressive taxation, social safety net, anti-monopoly",
      icon: "Scale",
      sortOrder: 2,
    },
    {
      name: "Healthcare Access",
      slug: "healthcare-access",
      description: "Universal coverage, prescription costs, worker health",
      icon: "Heart",
      sortOrder: 3,
    },
    {
      name: "Climate & Green Jobs",
      slug: "climate-green-jobs",
      description: "Clean energy jobs, just transition, environmental justice",
      icon: "Leaf",
      sortOrder: 4,
    },
    {
      name: "Corporate Accountability",
      slug: "corporate-accountability",
      description: "Regulations, consumer protection, anti-corruption",
      icon: "Building",
      sortOrder: 5,
    },
  ];

  for (const category of categories) {
    await prisma.gradeCategory.upsert({
      where: { slug: category.slug },
      update: {},
      create: category,
    });
  }

  console.log("✓ Created grade categories");

  // Create industries
  const industries = [
    { name: "Fossil Fuel", slug: "fossil-fuel", color: "#4a4a4a", icon: "Droplet" },
    { name: "Pharmaceutical", slug: "pharmaceutical", color: "#16a34a", icon: "Pill" },
    { name: "Wall Street", slug: "wall-street", color: "#2563eb", icon: "TrendingUp" },
    { name: "Big Tech", slug: "big-tech", color: "#7c3aed", icon: "Cpu" },
    { name: "Private Prisons", slug: "private-prisons", color: "#dc2626", icon: "Lock" },
    { name: "Defense", slug: "defense", color: "#64748b", icon: "Shield" },
    { name: "Real Estate", slug: "real-estate", color: "#f59e0b", icon: "Building2" },
    { name: "Insurance", slug: "insurance", color: "#0891b2", icon: "Umbrella" },
  ];

  for (const industry of industries) {
    await prisma.industry.upsert({
      where: { slug: industry.slug },
      update: {},
      create: industry,
    });
  }

  console.log("✓ Created industries");

  console.log("🎉 Seeding complete!");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
