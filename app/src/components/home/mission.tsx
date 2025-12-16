import {
  Scale,
  Eye,
  BookOpen,
  TrendingUp,
} from "lucide-react";

const values = [
  {
    icon: Scale,
    title: "Labor-Focused Grading",
    description:
      "We evaluate politicians based on their voting record on issues that matter to workers: union rights, minimum wage, workplace safety, and healthcare access.",
  },
  {
    icon: Eye,
    title: "Follow the Money",
    description:
      "See which corporations and industries fund your representatives. Understand whose interests they really serve when casting their votes.",
  },
  {
    icon: BookOpen,
    title: "Worker Resources",
    description:
      "Access guides on unionizing your workplace, understanding your rights, and connecting with labor organizations in your area.",
  },
  {
    icon: TrendingUp,
    title: "Track Progress",
    description:
      "Monitor how politicians' positions evolve over time. Hold them accountable for promises made and broken.",
  },
];

export function MissionSection() {
  return (
    <section id="mission" className="py-20 md:py-28">
      <div className="container mx-auto px-4">
        {/* Section header */}
        <div className="mx-auto mb-16 max-w-3xl text-center">
          <h2 className="mb-4 text-3xl font-bold tracking-tight text-labor-navy md:text-4xl">
            What We Do
          </h2>
          <p className="text-lg text-muted-foreground">
            Team Labor provides the tools and information workers need to make
            informed decisions and advocate for themselves. We believe
            transparency is the first step toward accountability.
          </p>
        </div>

        {/* Values grid */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {values.map((value) => (
            <div
              key={value.title}
              className="group rounded-lg border bg-card p-6 shadow-sm transition-all hover:shadow-md"
            >
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-labor-navy/10 text-labor-navy group-hover:bg-labor-red group-hover:text-white transition-colors">
                <value.icon className="h-6 w-6" />
              </div>
              <h3 className="mb-2 text-lg font-semibold">{value.title}</h3>
              <p className="text-sm text-muted-foreground">
                {value.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
