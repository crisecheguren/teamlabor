import { cn } from "@/lib/utils";

interface GradeBadgeProps {
  grade: string;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
  className?: string;
}

const gradeColors = {
  A: "bg-green-500 text-white border-green-600",
  "A+": "bg-green-600 text-white border-green-700",
  "A-": "bg-green-400 text-white border-green-500",
  B: "bg-lime-500 text-white border-lime-600",
  "B+": "bg-lime-600 text-white border-lime-700",
  "B-": "bg-lime-400 text-white border-lime-500",
  C: "bg-yellow-500 text-gray-900 border-yellow-600",
  "C+": "bg-yellow-600 text-gray-900 border-yellow-700",
  "C-": "bg-yellow-400 text-gray-900 border-yellow-500",
  D: "bg-orange-500 text-white border-orange-600",
  "D+": "bg-orange-600 text-white border-orange-700",
  "D-": "bg-orange-400 text-white border-orange-500",
  F: "bg-red-500 text-white border-red-600",
  "F-": "bg-red-600 text-white border-red-700",
};

const gradeDescriptions = {
  A: "Strong labor ally",
  "A+": "Outstanding labor champion",
  "A-": "Strong labor supporter",
  B: "Generally supportive",
  "B+": "Reliable labor supporter",
  "B-": "Mostly supportive",
  C: "Mixed record",
  "C+": "Inconsistent support",
  "C-": "Frequently opposing",
  D: "Generally opposes workers",
  "D+": "Occasionally supports workers",
  "D-": "Consistently opposes workers",
  F: "Anti-worker voting record",
  "F-": "Hostile to workers",
};

const sizeClasses = {
  sm: "text-sm px-2 py-1 min-w-[2rem]",
  md: "text-base px-3 py-1.5 min-w-[2.5rem]",
  lg: "text-2xl px-4 py-2 min-w-[3.5rem]",
};

export function GradeBadge({
  grade,
  size = "md",
  showLabel = false,
  className,
}: GradeBadgeProps) {
  const normalizedGrade = grade.toUpperCase() as keyof typeof gradeColors;
  const colorClass =
    gradeColors[normalizedGrade] || "bg-gray-400 text-white border-gray-500";
  const description = gradeDescriptions[normalizedGrade] || "No rating";
  const sizeClass = sizeClasses[size];

  return (
    <div className={cn("inline-flex items-center gap-2", className)}>
      <div
        className={cn(
          "font-bold rounded-md border-2 text-center inline-block",
          colorClass,
          sizeClass
        )}
        title={description}
      >
        {grade}
      </div>
      {showLabel && (
        <span className="text-sm text-muted-foreground">{description}</span>
      )}
    </div>
  );
}
