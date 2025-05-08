import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Privacy zones to avoid (lat, lng)
const PRIVACY_ZONES = [
  // Parse comma-separated coordinates from env vars
  ...(process.env.PRIVACY_ZONE_1 ? [{
    lat: parseFloat(process.env.PRIVACY_ZONE_1.split(',')[0]),
    lng: parseFloat(process.env.PRIVACY_ZONE_1.split(',')[1])
  }] : []),
  ...(process.env.PRIVACY_ZONE_2 ? [{
    lat: parseFloat(process.env.PRIVACY_ZONE_2.split(',')[0]),
    lng: parseFloat(process.env.PRIVACY_ZONE_2.split(',')[1])
  }] : [])
];

if (PRIVACY_ZONES.length === 0) {
  console.error('❌ No privacy zones found in .env file');
  process.exit(1);
}

const PRIVACY_RADIUS_KM = 0.48; // 3 blocks ≈ 0.48 km

// Function to calculate distance between two coordinates in kilometers
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

// Function to check if a coordinate is too close to any privacy zone
function isNearPrivacyZone(lat, lng) {
  return PRIVACY_ZONES.some(zone => 
    calculateDistance(lat, lng, zone.lat, zone.lng) < PRIVACY_RADIUS_KM
  );
}

// Read and process the routes file
const routesFile = path.join(process.cwd(), 'public', 'data', 'routes.json');
const routes = JSON.parse(fs.readFileSync(routesFile, 'utf-8'));

// Process each route
const processedRoutes = routes.map(route => {
  if (route.geojson?.geometry?.coordinates) {
    // Filter out coordinates near privacy zones
    const filteredCoords = route.geojson.geometry.coordinates.filter(([lng, lat]) => 
      !isNearPrivacyZone(lat, lng)
    );
    
    // Update the coordinates
    route.geojson.geometry.coordinates = filteredCoords;
  }
  return route;
});

// Write the processed routes back to the file
fs.writeFileSync(routesFile, JSON.stringify(processedRoutes, null, 2));
console.log('✅ Successfully processed routes.json and removed privacy zones'); 