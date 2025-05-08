import { createRequire } from "module";
const require = createRequire(import.meta.url);

import fetch from "node-fetch";
import dotenv from "dotenv";
import slugify from "slugify";
import path from "path";
dotenv.config();

const fs = require("fs");
const polyline = require("@mapbox/polyline");

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

const STRAVA_TOKEN_URL = "https://www.strava.com/oauth/token";
const STRAVA_ACTIVITIES_URL = "https://www.strava.com/api/v3/athlete/activities";

async function getAccessToken() {
  const res = await fetch(STRAVA_TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      client_id: process.env.STRAVA_CLIENT_ID,
      client_secret: process.env.STRAVA_CLIENT_SECRET,
      refresh_token: process.env.STRAVA_REFRESH_TOKEN,
      grant_type: "refresh_token",
    }),
  });

  const data = await res.json();
  return data.access_token;
}

async function fetchActivities(token) {
  const res = await fetch(`${STRAVA_ACTIVITIES_URL}?per_page=30`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  const data = await res.json();
  if (!Array.isArray(data)) {
    console.error("❌ Unexpected response from Strava:");
    console.dir(data, { depth: null });
    process.exit(1);
  }

  return data;
}

function polylineToGeoJSON(encoded) {
  const coords = polyline.decode(encoded);
  // Filter out coordinates near privacy zones
  const filteredCoords = coords.filter(([lat, lng]) => !isNearPrivacyZone(lat, lng));
  
  return {
    type: "Feature",
    geometry: {
      type: "LineString",
      coordinates: filteredCoords.map(([lat, lng]) => [lng, lat]), // GeoJSON = [lng, lat]
    },
    properties: {},
  };
}

function buildSlug(title, date) {
  const shortDate = new Date(date).toISOString().split("T")[0]; // YYYY-MM-DD
  return slugify(`${title} ${shortDate}`, { lower: true });
}

function isRideWithGeojson(activity) {
  return (
    activity.type === "Ride" && 
    activity.map?.summary_polyline && 
    activity.map.summary_polyline.length > 0
  );
}

function createMarkdownContent(ride) {
  return `---
title: "${ride.title}"
description: "A ${(ride.distance / 1000).toFixed(1)}km ride with ${Math.round(ride.elevation)}m of elevation gain"
date: ${ride.date}
distance: ${ride.distance}
elevation: ${ride.elevation}
duration: ${ride.duration}
stravaId: "${ride.id}"
geojson: ${JSON.stringify(ride.geojson, null, 2)}
---

## Ride Details
- Distance: ${(ride.distance / 1000).toFixed(1)}km
- Elevation Gain: ${Math.round(ride.elevation)}m
- Duration: ${Math.round(ride.duration / 60)} minutes

## Route Map
The route map will be displayed here.

## Notes
Add your ride notes and reflections here.
`;
}

async function main() {
  const token = await getAccessToken();
  const activities = await fetchActivities(token);
  console.log(`📊 Fetched ${activities.length} activities from Strava`);

  const rides = activities.filter(isRideWithGeojson);
  console.log(`✅ Filtered to ${rides.length} valid rides`);

  // Ensure the rides directory exists
  const ridesDir = "./src/content/rides";
  if (!fs.existsSync(ridesDir)) {
    fs.mkdirSync(ridesDir, { recursive: true });
  }

  // Create markdown files for each ride
  for (const ride of rides) {
    const slug = buildSlug(ride.name, ride.start_date);
    const markdownContent = createMarkdownContent({
      id: ride.id,
      title: ride.name,
      date: ride.start_date,
      distance: ride.distance,
      elevation: ride.total_elevation_gain,
      duration: ride.moving_time,
      geojson: polylineToGeoJSON(ride.map.summary_polyline),
    });

    const filePath = path.join(ridesDir, `${slug}.md`);
    fs.writeFileSync(filePath, markdownContent);
    console.log(`✅ Created markdown file for ride: ${slug}`);
  }

  // Also save the routes data for the map
  const dataDir = "./public/data";
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  const routesData = rides.map(ride => ({
    id: ride.id,
    title: ride.name,
    date: ride.start_date,
    distance: ride.distance,
    elevation: ride.total_elevation_gain,
    duration: ride.moving_time,
    blogUrl: `/rides/${buildSlug(ride.name, ride.start_date)}`,
    geojson: polylineToGeoJSON(ride.map.summary_polyline),
  }));

  fs.writeFileSync(
    "./public/data/routes.json", 
    JSON.stringify(routesData, null, 2)
  );
  console.log("✅ Synced Strava routes to public/data/routes.json");
}

main().catch((error) => {
  console.error("❌ Error syncing Strava routes:", error);
  process.exit(1);
});
