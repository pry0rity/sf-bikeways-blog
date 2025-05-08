import { createRequire } from "module";
const require = createRequire(import.meta.url);

import fetch from "node-fetch";
import dotenv from "dotenv";
import slugify from "slugify";
import path from "path";
dotenv.config();

const fs = require("fs");
const polyline = require("@mapbox/polyline");

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
  return {
    type: "Feature",
    geometry: {
      type: "LineString",
      coordinates: coords.map(([lat, lng]) => [lng, lat]), // GeoJSON = [lng, lat]
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
