import { MetadataRoute } from 'next';

const DOMAIN = 'https://appinsight.site';

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: `${DOMAIN}/`, lastModified: new Date(), changeFrequency: 'weekly', priority: 1.0 },
    { url: `${DOMAIN}/login`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
    { url: `${DOMAIN}/register`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
  ];
}
