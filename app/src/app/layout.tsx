import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";

const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: {
    default: "Team Labor - Holding Politicians Accountable for Workers",
    template: "%s | Team Labor",
  },
  description:
    "We grade politicians on their labor record, expose their corporate donors, and provide resources to help workers organize for better conditions.",
  keywords: [
    "labor rights",
    "union",
    "workers rights",
    "politician grades",
    "corporate donors",
    "campaign finance",
    "organizing",
    "wealth equality",
  ],
  authors: [{ name: "Team Labor" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://teamlabor.org",
    siteName: "Team Labor",
    title: "Team Labor - Holding Politicians Accountable for Workers",
    description:
      "We grade politicians on their labor record, expose their corporate donors, and provide resources to help workers organize.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Team Labor",
    description:
      "We grade politicians on their labor record, expose their corporate donors, and provide resources to help workers organize.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="min-h-screen bg-background font-sans antialiased">
        <div className="relative flex min-h-screen flex-col">
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
