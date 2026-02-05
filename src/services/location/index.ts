import { getCountyFromZip, isApprovedZip } from './zipToCounty';

interface ZipLookupResult {
  valid: boolean;
  city?: string;
  state?: string;
  county?: string;
  isApproved?: boolean;
  error?: string;
}

export async function lookupZipCode(zipCode: string): Promise<ZipLookupResult> {
  if (!/^\d{5}$/.test(zipCode)) {
    return { valid: false, error: 'Please enter a valid zip code' };
  }

  const county = getCountyFromZip(zipCode);
  const isApproved = isApprovedZip(zipCode);

  try {
    const response = await fetch(`https://api.zippopotam.us/us/${zipCode}`);

    if (!response.ok) {
      return { valid: false, error: "This zip code doesn't exist" };
    }

    const data = await response.json();
    const place = data.places?.[0];

    if (!place) {
      return { valid: false, error: "This zip code doesn't exist" };
    }

    return {
      valid: true,
      city: place['place name'],
      state: place['state abbreviation'],
      county: county || 'Unknown',
      isApproved
    };
  } catch {
    if (county) {
      return {
        valid: true,
        city: 'Unknown',
        state: 'CA',
        county,
        isApproved: true
      };
    }
    return { valid: false, error: 'Unable to verify zip code' };
  }
}

export { getCountyFromZip, isApprovedZip };
