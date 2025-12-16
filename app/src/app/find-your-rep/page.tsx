"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Search, MapPin, User, Building2, Loader2 } from "lucide-react";
import Link from "next/link";

interface RepresentativeResult {
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

interface AddressForm {
  street: string;
  city: string;
  state: string;
  zip: string;
}

interface FormErrors {
  street?: string;
  city?: string;
  state?: string;
  zip?: string;
}

const US_STATES = [
  { abbr: "AL", name: "Alabama" },
  { abbr: "AK", name: "Alaska" },
  { abbr: "AZ", name: "Arizona" },
  { abbr: "AR", name: "Arkansas" },
  { abbr: "CA", name: "California" },
  { abbr: "CO", name: "Colorado" },
  { abbr: "CT", name: "Connecticut" },
  { abbr: "DE", name: "Delaware" },
  { abbr: "DC", name: "District of Columbia" },
  { abbr: "FL", name: "Florida" },
  { abbr: "GA", name: "Georgia" },
  { abbr: "HI", name: "Hawaii" },
  { abbr: "ID", name: "Idaho" },
  { abbr: "IL", name: "Illinois" },
  { abbr: "IN", name: "Indiana" },
  { abbr: "IA", name: "Iowa" },
  { abbr: "KS", name: "Kansas" },
  { abbr: "KY", name: "Kentucky" },
  { abbr: "LA", name: "Louisiana" },
  { abbr: "ME", name: "Maine" },
  { abbr: "MD", name: "Maryland" },
  { abbr: "MA", name: "Massachusetts" },
  { abbr: "MI", name: "Michigan" },
  { abbr: "MN", name: "Minnesota" },
  { abbr: "MS", name: "Mississippi" },
  { abbr: "MO", name: "Missouri" },
  { abbr: "MT", name: "Montana" },
  { abbr: "NE", name: "Nebraska" },
  { abbr: "NV", name: "Nevada" },
  { abbr: "NH", name: "New Hampshire" },
  { abbr: "NJ", name: "New Jersey" },
  { abbr: "NM", name: "New Mexico" },
  { abbr: "NY", name: "New York" },
  { abbr: "NC", name: "North Carolina" },
  { abbr: "ND", name: "North Dakota" },
  { abbr: "OH", name: "Ohio" },
  { abbr: "OK", name: "Oklahoma" },
  { abbr: "OR", name: "Oregon" },
  { abbr: "PA", name: "Pennsylvania" },
  { abbr: "RI", name: "Rhode Island" },
  { abbr: "SC", name: "South Carolina" },
  { abbr: "SD", name: "South Dakota" },
  { abbr: "TN", name: "Tennessee" },
  { abbr: "TX", name: "Texas" },
  { abbr: "UT", name: "Utah" },
  { abbr: "VT", name: "Vermont" },
  { abbr: "VA", name: "Virginia" },
  { abbr: "WA", name: "Washington" },
  { abbr: "WV", name: "West Virginia" },
  { abbr: "WI", name: "Wisconsin" },
  { abbr: "WY", name: "Wyoming" },
  { abbr: "PR", name: "Puerto Rico" },
];

export default function FindYourRepPage() {
  const [formData, setFormData] = useState<AddressForm>({
    street: "",
    city: "",
    state: "",
    zip: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<RepresentativeResult | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Street validation
    if (!formData.street.trim()) {
      newErrors.street = "Street address is required";
    } else if (formData.street.trim().length < 5) {
      newErrors.street = "Please enter a valid street address";
    }

    // City validation
    if (!formData.city.trim()) {
      newErrors.city = "City is required";
    } else if (formData.city.trim().length < 2) {
      newErrors.city = "Please enter a valid city name";
    }

    // State validation
    if (!formData.state) {
      newErrors.state = "State is required";
    }

    // ZIP validation
    if (!formData.zip.trim()) {
      newErrors.zip = "ZIP code is required";
    } else if (!/^\d{5}(-\d{4})?$/.test(formData.zip.trim())) {
      newErrors.zip = "Please enter a valid 5-digit ZIP code";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    setApiError(null);
    setResult(null);

    // Build the full address string for the Census API
    const fullAddress = `${formData.street.trim()}, ${formData.city.trim()}, ${formData.state} ${formData.zip.trim()}`;

    try {
      const response = await fetch(
        `/api/representatives?address=${encodeURIComponent(fullAddress)}`
      );
      const data: RepresentativeResult = await response.json();

      if (data.success) {
        setResult(data);
      } else {
        setApiError(data.error || "Something went wrong");
      }
    } catch {
      setApiError("Failed to look up address. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const inputClassName = (fieldName: keyof FormErrors) =>
    `w-full rounded-md border bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${
      errors[fieldName] ? "border-red-500" : "border-input"
    }`;

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="mx-auto max-w-2xl">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="mb-4 text-4xl font-bold text-labor-navy">
            Find Your Representatives
          </h1>
          <p className="text-lg text-muted-foreground">
            Enter your address to find your members of Congress and see how they
            vote on issues that matter to workers.
          </p>
        </div>

        {/* Search Form */}
        <Card className="mb-8 p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Street Address */}
            <div>
              <label
                htmlFor="street"
                className="mb-1 block text-sm font-medium text-foreground"
              >
                Street Address <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  id="street"
                  name="street"
                  value={formData.street}
                  onChange={handleChange}
                  placeholder="123 Main Street"
                  className={`${inputClassName("street")} pl-9`}
                  disabled={loading}
                />
              </div>
              {errors.street && (
                <p className="mt-1 text-xs text-red-500">{errors.street}</p>
              )}
            </div>

            {/* City and State Row */}
            <div className="grid gap-4 sm:grid-cols-2">
              {/* City */}
              <div>
                <label
                  htmlFor="city"
                  className="mb-1 block text-sm font-medium text-foreground"
                >
                  City <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="City"
                  className={inputClassName("city")}
                  disabled={loading}
                />
                {errors.city && (
                  <p className="mt-1 text-xs text-red-500">{errors.city}</p>
                )}
              </div>

              {/* State */}
              <div>
                <label
                  htmlFor="state"
                  className="mb-1 block text-sm font-medium text-foreground"
                >
                  State <span className="text-red-500">*</span>
                </label>
                <select
                  id="state"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  className={inputClassName("state")}
                  disabled={loading}
                >
                  <option value="">Select state...</option>
                  {US_STATES.map((state) => (
                    <option key={state.abbr} value={state.abbr}>
                      {state.name}
                    </option>
                  ))}
                </select>
                {errors.state && (
                  <p className="mt-1 text-xs text-red-500">{errors.state}</p>
                )}
              </div>
            </div>

            {/* ZIP Code */}
            <div className="sm:w-1/2">
              <label
                htmlFor="zip"
                className="mb-1 block text-sm font-medium text-foreground"
              >
                ZIP Code <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="zip"
                name="zip"
                value={formData.zip}
                onChange={handleChange}
                placeholder="12345"
                maxLength={10}
                className={inputClassName("zip")}
                disabled={loading}
              />
              {errors.zip && (
                <p className="mt-1 text-xs text-red-500">{errors.zip}</p>
              )}
            </div>

            {/* Privacy Note */}
            <p className="text-xs text-muted-foreground">
              We use your address only to find your congressional district. We
              don&apos;t store or share your address.
            </p>

            {/* Submit Button */}
            <Button
              type="submit"
              variant="labor"
              className="w-full"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Looking up...
                </>
              ) : (
                <>
                  <Search className="mr-2 h-4 w-4" />
                  Find My Representatives
                </>
              )}
            </Button>
          </form>
        </Card>

        {/* Error Message */}
        {apiError && (
          <Card className="mb-8 border-red-200 bg-red-50 p-6">
            <p className="text-center text-red-700">{apiError}</p>
          </Card>
        )}

        {/* Results */}
        {result && result.success && (
          <div className="space-y-6">
            {/* Matched Address */}
            <Card className="bg-green-50 p-4">
              <div className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-5 w-5 text-green-600" />
                <div>
                  <p className="text-sm font-medium text-green-800">
                    Address Found
                  </p>
                  <p className="text-sm text-green-700">
                    {result.address?.matched}
                  </p>
                </div>
              </div>
            </Card>

            {/* House Representative */}
            {result.district && (
              <Card className="p-6">
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-labor-navy text-white">
                    <User className="h-5 w-5" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-labor-navy">
                      House Representative
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      {result.district.districtName}
                    </p>
                  </div>
                </div>
                <div className="rounded-lg border bg-muted/50 p-4">
                  <p className="mb-2 text-sm text-muted-foreground">
                    Your representative serves in the U.S. House of
                    Representatives for {result.district.state}&apos;s{" "}
                    {result.district.districtNumber === "At-Large"
                      ? "at-large seat"
                      : `${result.district.districtNumber}${getOrdinalSuffix(
                          parseInt(result.district.districtNumber)
                        )} congressional district`}
                    .
                  </p>
                  <Button asChild variant="outline" size="sm">
                    <Link
                      href={`/politicians?state=${result.district.stateAbbr}&chamber=house&district=${result.district.districtNumber}`}
                    >
                      View Representative&apos;s Grade
                    </Link>
                  </Button>
                </div>
              </Card>
            )}

            {/* Senators */}
            {result.senators && (
              <Card className="p-6">
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-labor-red text-white">
                    <Building2 className="h-5 w-5" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-labor-navy">
                      U.S. Senators
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      {result.senators.state}
                    </p>
                  </div>
                </div>
                <div className="rounded-lg border bg-muted/50 p-4">
                  <p className="mb-2 text-sm text-muted-foreground">
                    {result.senators.state} has two U.S. Senators who represent
                    the entire state.
                  </p>
                  <Button asChild variant="outline" size="sm">
                    <Link
                      href={`/politicians?state=${result.senators.stateAbbr}&chamber=senate`}
                    >
                      View Senators&apos; Grades
                    </Link>
                  </Button>
                </div>
              </Card>
            )}

            {/* Call to Action */}
            <Card className="border-labor-navy bg-labor-navy/5 p-6">
              <h3 className="mb-2 text-lg font-semibold text-labor-navy">
                What&apos;s Next?
              </h3>
              <p className="mb-4 text-sm text-muted-foreground">
                Now that you know who represents you, check out their voting
                records on labor issues, see who&apos;s funding their campaigns,
                and learn how to make your voice heard.
              </p>
              <div className="flex flex-wrap gap-3">
                <Button asChild variant="labor" size="sm">
                  <Link href="/politicians">Browse All Politicians</Link>
                </Button>
                <Button asChild variant="outline" size="sm">
                  <Link href="/resources">Worker Resources</Link>
                </Button>
              </div>
            </Card>
          </div>
        )}

        {/* Info Section - shown when no results */}
        {!result && !apiError && (
          <div className="rounded-lg border bg-muted/30 p-6">
            <h2 className="mb-3 text-lg font-semibold text-labor-navy">
              Why Find Your Representatives?
            </h2>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="mt-1 text-labor-red">•</span>
                <span>
                  See how your representatives vote on issues that affect
                  workers
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 text-labor-red">•</span>
                <span>
                  Learn which corporations are funding their campaigns
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 text-labor-red">•</span>
                <span>
                  Hold them accountable with our labor-focused grades
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 text-labor-red">•</span>
                <span>
                  Find contact information to make your voice heard
                </span>
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

// Helper function to get ordinal suffix (1st, 2nd, 3rd, etc.)
function getOrdinalSuffix(n: number): string {
  const s = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return s[(v - 20) % 10] || s[v] || s[0];
}
