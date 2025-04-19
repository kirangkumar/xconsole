import axios from 'axios';

export interface SatelliteData {
  name: string;
  tle1: string;
  tle2: string;
  type: 'LEO' | 'MEO' | 'GEO' | 'OTHER';
}

// Function to determine satellite type based on its altitude
function getSatelliteType(tle1: string): 'LEO' | 'MEO' | 'GEO' | 'OTHER' {
  try {
    // Extract mean motion from TLE (revolutions per day)
    const meanMotion = parseFloat(tle1.substring(52, 63));
    
    // Calculate approximate altitude using mean motion
    // Using simplified calculations:
    // GEO: ~1 revolution per day
    // MEO: 2-12 revolutions per day
    // LEO: >12 revolutions per day
    
    if (meanMotion <= 1.1) return 'GEO';
    if (meanMotion <= 12) return 'MEO';
    if (meanMotion > 12) return 'LEO';
    return 'OTHER';
  } catch {
    return 'OTHER';
  }
}

// Fetch satellite data from Space-Track.org
export async function fetchSatelliteData(category: string = 'stations'): Promise<SatelliteData[]> {
  try {
    // For ISS specifically
    if (category === 'stations') {
      const response = await axios.get('https://celestrak.org/NORAD/elements/gp.php?CATNR=25544&FORMAT=tle');
      const tleData = response.data.trim().split('\n');
      if (tleData.length >= 3) {
        return [{
          name: tleData[0].trim(),
          tle1: tleData[1].trim(),
          tle2: tleData[2].trim(),
          type: 'LEO'
        }];
      }
    }

    // For other categories
    const response = await axios.get(`https://celestrak.org/NORAD/elements/gp.php?GROUP=${category}&FORMAT=tle`);
    const tleData = response.data.trim().split('\n');
    const satellites: SatelliteData[] = [];

    // Process TLE data in groups of three lines
    for (let i = 0; i < tleData.length; i += 3) {
      if (i + 2 < tleData.length) {
        const name = tleData[i].trim();
        const tle1 = tleData[i + 1].trim();
        const tle2 = tleData[i + 2].trim();

        if (name && tle1 && tle2 && 
            tle1.startsWith('1 ') && 
            tle2.startsWith('2 ') && 
            tle1.length === 69 && 
            tle2.length === 69) {
          satellites.push({
            name,
            tle1,
            tle2,
            type: getSatelliteType(tle1),
          });
        }
      }
    }

    console.log(`Fetched ${satellites.length} satellites for category ${category}`);
    return satellites;
  } catch (error) {
    console.error('Error fetching satellite data:', error);
    // Return sample data as fallback
    return SAMPLE_SATELLITES;
  }
}

// Available satellite categories from Celestrak
export const SATELLITE_CATEGORIES = {
  STATIONS: 'stations',
  VISUAL: 'visual',
  ACTIVE: 'active',
  STARLINK: 'starlink',
  SCIENCE: 'science',
  WEATHER: 'weather',
  GPS: 'gps-ops',
  GLONASS: 'glo-ops',
  GALILEO: 'galileo',
  MILITARY: 'military',
} as const;

// Sample satellite data for testing
export const SAMPLE_SATELLITES: SatelliteData[] = [
  {
    name: "ISS (ZARYA)",
    tle1: "1 25544U 98067A   24079.91666667  .00010000  00000+0  17652-3 0  9993",
    tle2: "2 25544  51.6400  33.6600 0004000  10.0000  89.9000 15.50000000    00",
    type: "LEO"
  },
  {
    name: "STARLINK-1234",
    tle1: "1 48208U 21041A   24079.91666667  .00001000  00000+0  11111-3 0  9993",
    tle2: "2 48208  53.0500  12.3400 0001000  20.0000  89.9000 15.06000000    00",
    type: "LEO"
  }
]; 