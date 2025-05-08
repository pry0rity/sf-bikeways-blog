import { defineCollection, z } from 'astro:content';

const blogCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.date(),
    image: z.string().optional(),
    tags: z.array(z.string()).default([]),
    location: z.string().optional(),
    coffeeShop: z.string().optional(),
    routeName: z.string().optional(),
    bikeType: z.string().optional(),
    weather: z.string().optional(),
    gear: z.object({
      camera: z.string().optional(),
      bike: z.string().optional(),
      other: z.array(z.string()).optional(),
    }).optional(),
    coordinates: z.object({
      lat: z.number(),
      lng: z.number(),
    }).optional(),
  }),
});

const ridesCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.date(),
    distance: z.number(),
    elevation: z.number(),
    duration: z.number(),
    stravaId: z.string(),
    geojson: z.object({
      type: z.string(),
      geometry: z.object({
        type: z.string(),
        coordinates: z.array(z.array(z.number())),
      }),
      properties: z.object({}),
    }),
  }),
});

export const collections = {
  'blog': blogCollection,
  'rides': ridesCollection,
}; 