import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getGradeColor(grade: string): string {
  const letter = grade.charAt(0).toUpperCase();
  switch (letter) {
    case "A":
      return "grade-a";
    case "B":
      return "grade-b";
    case "C":
      return "grade-c";
    case "D":
      return "grade-d";
    case "F":
      return "grade-f";
    default:
      return "bg-gray-500 text-white";
  }
}

export function getGradeLabel(grade: string): string {
  const letter = grade.charAt(0).toUpperCase();
  switch (letter) {
    case "A":
      return "Strong Labor Ally";
    case "B":
      return "Generally Supportive";
    case "C":
      return "Mixed Record";
    case "D":
      return "Generally Opposes Workers";
    case "F":
      return "Anti-Worker";
    default:
      return "Not Rated";
  }
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatParty(party: string): string {
  switch (party.toUpperCase()) {
    case "D":
      return "Democrat";
    case "R":
      return "Republican";
    case "I":
      return "Independent";
    default:
      return party;
  }
}

export function getPartyColor(party: string): string {
  switch (party.toUpperCase()) {
    case "D":
      return "text-blue-600";
    case "R":
      return "text-red-600";
    case "I":
      return "text-purple-600";
    default:
      return "text-gray-600";
  }
}
