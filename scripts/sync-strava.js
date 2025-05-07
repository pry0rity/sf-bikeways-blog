import { createRequire } from "module";
const require = createRequire(import.meta.url);

import fetch from "node-fetch";
import dotenv from "dotenv";
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

async function main() {
    const token = await getAccessToken();
    const activities = await fetchActivities(token);
    console.log("Fetched activities:", activities);

  const results = activities.map((ride) => {
    return {
      id: ride.id,
      title: ride.name,
      date: ride.start_date,
      blogUrl: `/rides/${slugify(ride.name)}`,
      geojson: polylineToGeoJSON(ride.map.summary_polyline),
    };
  });

  fs.writeFileSync("./src/data/routes.json", JSON.stringify(results, null, 2));
  console.log("✅ Synced Strava routes.");
}

function slugify(str) {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

main();
