import { createRequire } from "module";
const require = createRequire(import.meta.url);

import fetch from "node-fetch";
import dotenv from "dotenv";
import slugify from "slugify";
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
  return `/rides/${slugify(`${title} ${shortDate}`, { lower: true })}`;
}

function isRideWithGeojson(activity) {
  return (
    activity.type === "Ride" && 
    activity.map?.summary_polyline && 
    activity.map.summary_polyline.length > 0
  );
}

async function main() {
  const token = await getAccessToken();
  const activities = await fetchActivities(token);
  console.log(`📊 Fetched ${activities.length} activities from Strava`);

  const results = activities
    .filter(isRideWithGeojson)
    .map((ride) => {
      const slug = buildSlug(ride.name, ride.start_date);
      return {
        id: ride.id,
        title: ride.name,
        date: ride.start_date,
        distance: ride.distance,
        elevation: ride.total_elevation_gain,
        duration: ride.moving_time,
        blogUrl: slug,
        geojson: polylineToGeoJSON(ride.map.summary_polyline),
      };
    });

  console.log(`✅ Filtered to ${results.length} valid rides`);

  // Ensure the data directory exists
  const dataDir = "./public/data";
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  fs.writeFileSync(
    "./public/data/routes.json", 
    JSON.stringify(results, null, 2)
  );
  console.log("✅ Synced Strava routes to public/data/routes.json");
}

main().catch((error) => {
  console.error("❌ Error syncing Strava routes:", error);
  process.exit(1);
});
