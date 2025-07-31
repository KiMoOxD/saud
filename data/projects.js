import projectsData from './projectsData.json';

// Helper map to normalize country data into a consistent key/slug.
const countryLookup = {
    // Keyed by English name
    "Saudi Arabia": { key: "saudi_arabia", ar: "السعودية" },
    "Egypt": { key: "egypt", ar: "مصر" },
    "Qatar": { key: "qatar", ar: "قطر" },
    "Oman": { key: "oman", ar: "سلطنة عمان" },
    "Tanzania": { key: "tanzania", ar: "تنزانيا" },
    "Turkey": { key: "turkey", ar: "تركيا" },
    "Yemen": { key: "yemen", ar: "اليمن" },
    // Keyed by Arabic name for legacy string-only entries
    "تركيا": { key: "turkey", ar: "تركيا" },
    "اليمن": { key: "yemen", ar: "اليمن" }
};

/**
 * Normalizes the raw project data from the JSON file.
 */
const allProjects = projectsData.projects.map(p => {
    const financial_indicators = p.financial_indicators || {};
    const sector = p.sector || { en: 'Uncategorized', ar: 'غير مصنف' };
    
    // --- Country Normalization Logic ---
    let country_key = 'unknown';
    let country_ar = 'دولة غير محددة';
    let country_en = 'Unknown';

    if (typeof p.country === 'object' && p.country !== null && p.country.en) {
        const lookup = countryLookup[p.country.en];
        if (lookup) {
            country_key = lookup.key;
            country_ar = lookup.ar;
            country_en = p.country.en;
        }
    } else if (typeof p.country === 'string') {
        const lookup = countryLookup[p.country];
        if (lookup) {
            country_key = lookup.key;
            country_ar = lookup.ar;
            // Find the corresponding English name from the lookup table
            country_en = Object.keys(countryLookup).find(key => countryLookup[key].key === lookup.key && !/^[^\u0000-\u007F]*$/.test(key)) || 'Unknown';
        }
    }

    return {
      ...p,
      country_key, // The new URL-safe key, e.g., 'saudi_arabia'
      country_ar,  // The Arabic display name, e.g., 'السعودية'
      country_en,  // The English name, e.g., 'Saudi Arabia'
      sector: sector.en, // Keep original sector name for mapping
      sector_ar: sector.ar,
      financial_indicators: {
          total_investment: financial_indicators.total_investment || 0,
          internal_rate_of_return: financial_indicators.internal_rate_of_return || "0%",
          payback_period: financial_indicators.payback_period || "N/A"
      },
      id: p.id.toString() 
    };
});

/**
 * Generates a list of all unique country pages for Next.js's generateStaticParams.
 * Returns an array of objects with the URL-safe country key.
 */
export const getAllCountryPaths = () => {
    const countryKeys = [...new Set(allProjects.map(p => p.country_key))];
    return countryKeys.filter(key => key && key !== 'unknown').map(key => ({
        country: key
    }));
};

/**
 * Retrieves all projects for a specific country using its key.
 * @param {string} countryKey - The URL-safe key of the country (e.g., "saudi_arabia").
 */
export const getProjectsByCountry = (countryKey) => {
  return allProjects.filter(p => p.country_key === countryKey);
};

/**
 * Retrieves a single project by its ID.
 * @param {string} id - The ID of the project.
 */
export const getProjectById = (id) => {
    return allProjects.find((project) => project.id === id.toString());
};

/**
 * Dynamically generates a map of English sector names to their Arabic translations.
 */
export const sectorNames = allProjects.reduce((acc, project) => {
  if (project.sector && project.sector_ar) {
    acc[project.sector] = project.sector_ar;
  }
  return acc;
}, { 'Uncategorized': 'غير مصنف' });

/**
 * Dynamically generates a map of country keys to their Arabic display names.
 * e.g., { "saudi_arabia": "السعودية" }
 */
export const countryNames = allProjects.reduce((acc, project) => {
    if(project.country_key && project.country_ar) {
        acc[project.country_key] = project.country_ar;
    }
    return acc;
}, {});

/**
 * Returns all processed projects.
 */
export const getAllProjects = () => {
    return allProjects;
};

/**
 * Searches projects based on a query string.
 */
export const searchProjects = (query) => {
  if (!query) return [];
  const lowerCaseQuery = query.toLowerCase();
  return allProjects.filter(
    (project) =>
      project.project_name.toLowerCase().includes(lowerCaseQuery) ||
      project.description.toLowerCase().includes(lowerCaseQuery) ||
      project.location.toLowerCase().includes(lowerCaseQuery) ||
      project.country_ar.toLowerCase().includes(lowerCaseQuery) ||
      project.country_en.toLowerCase().includes(lowerCaseQuery)
  );
};