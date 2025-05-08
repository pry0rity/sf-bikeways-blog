## Tech Stack

- [Astro](https://astro.build)
- [Tailwind CSS](https://tailwindcss.com)
- [MDX](https://mdxjs.com)
- [TypeScript](https://www.typescriptlang.org)
- [Cloudflare Pages](https://developers.cloudflare.com/pages/)

## Project Structure

```
sf-bikeways-blog/
├── public/          # Static assets
├── src/
│   ├── components/  # Reusable components
│   ├── content/     # Blog posts and content
│   ├── layouts/     # Page layouts
│   ├── pages/       # Route pages
│   └── styles/      # Global styles
└── package.json
```

## Content Structure

Blog posts are written in Markdown with frontmatter metadata:

```markdown
---
title: "Post Title"
description: "Post description"
date: 2024-03-20
image: "/images/post-image.jpg"
tags: ["tag1", "tag2"]
location: "San Francisco"
coffeeShop: "Coffee Shop Name"
routeName: "Route Name"
bikeType: "Bike Type"
weather: "Weather conditions"
gear:
  camera: "Camera used"
  bike: "Bike used"
  other: ["Other gear items"]
coordinates:
  lat: 37.7749
  lng: -122.4194
---
```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

```sh
npm create astro@latest -- --template minimal
```
