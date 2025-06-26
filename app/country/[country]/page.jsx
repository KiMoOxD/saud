import { getProjectsByCountry } from "@/data/projects"
import CountryProjectsClient from "./CountryProjectsClient"
import { countryNames } from "@/data/projects"

// Generates beautiful, dynamic titles and descriptions
export async function generateMetadata({ params }) {
  const country = decodeURIComponent(params.country)
  const countryDisplayName = countryNames[country] || country
  const projects = getProjectsByCountry(country)

  return {
    title: `مشاريعنا في ${countryDisplayName} | استشارات الخليج`,
    description: `استكشف محفظتنا من المشاريع الناجحة والاستثمارات في ${countryDisplayName}.`,
  }
}

// Pre-builds pages for faster performance
export async function generateStaticParams() {
  const countries = ["السعودية", "الإمارات العربية المتحدة", "قطر", "مصر"]
  return countries.map((country) => ({
    country: encodeURIComponent(country),
  }))
}

// FIX: Added 'async' to the function signature
export default async function CountryPage({ params }) {
  const country = decodeURIComponent(params.country)
  const projects = getProjectsByCountry(country)

  // We now pass the projects to the client, even if empty,
  // to let it handle the "Coming Soon" state gracefully.
  return <CountryProjectsClient country={country} projects={projects} />
}