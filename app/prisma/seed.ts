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

  // Create states (just a few for demo)
  const states = [
    { name: "California", abbreviation: "CA" },
    { name: "Texas", abbreviation: "TX" },
    { name: "Florida", abbreviation: "FL" },
    { name: "New York", abbreviation: "NY" },
    { name: "Ohio", abbreviation: "OH" },
    { name: "Pennsylvania", abbreviation: "PA" },
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
