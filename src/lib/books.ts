import { db } from './db';
import type { Book } from '@/types';

export interface LoadBooksParams {
  category?: string;
  q?: string;
}

export async function loadBooksShift(params?: LoadBooksParams): Promise<Book[]> {
  await new Promise((r) => setTimeout(r, 800));

  let results = [...db.books];

  if (params?.category && params.category.trim() !== '' && params.category !== 'Tất cả') {
    results = results.filter((b) => b.category === params.category);
  }

  if (params?.q && params.q.trim() !== '') {
    const query = params.q.toLowerCase().trim();
    results = results.filter((b) => b.title.toLowerCase().includes(query));
  }

  return results;
}

export async function getBookById(id: number): Promise<Book | undefined> {
  return db.books.find((b) => b.id === id);
}

