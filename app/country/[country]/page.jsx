import { getProjectsByCountry, getAllCountryPaths, countryNames } from "@/data/projects"
import CountryProjectsClient from "./CountryProjectsClient"

export async function generateMetadata({ params }) {
  const paramsData = await params;
  const countryKey = paramsData.country;
  const countryDisplayName = countryNames[countryKey] || countryKey;

  return {
    title: `مشاريعنا في ${countryDisplayName} | استشارات الخليج`,
    description: `استكشف محفظتنا من المشاريع الناجحة والاستثمارات في ${countryDisplayName}.`,
  }
}

export async function generateStaticParams() {
  // This function now correctly returns an array of objects with string values.
  // e.g., [{ country: 'saudi_arabia' }, { country: 'egypt' }]
  return getAllCountryPaths();
}

export default async function CountryPage({ params }) {
  const paramsData = await params;
  const countryKey = paramsData.country;
  const projects = getProjectsByCountry(countryKey);

  // Pass the country key to the client component.
  return <CountryProjectsClient country={countryKey} projects={projects} />
}