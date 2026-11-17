import type { MetadataRoute } from 'next';
import { loadBooksShift } from '@/lib/books';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const books = await loadBooksShift();
  const baseUrl = 'http://localhost:3000';

  const staticUrls: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/books`,
      lastModified: new Date(),
    },
  ];

  const bookUrls: MetadataRoute.Sitemap = books.map((book) => ({
    url: `${baseUrl}/books/${book.id}`,
    lastModified: new Date(),
  }));

  return [...staticUrls, ...bookUrls];
}

