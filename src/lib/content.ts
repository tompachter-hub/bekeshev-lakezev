import { getCollection, type CollectionEntry } from 'astro:content';

// טיוטות מוצגות רק בהרצה מקומית (npm run dev), לא באתר החי
const showDrafts = import.meta.env.DEV;

export function url(path: string): string {
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  return `${base}/${path.replace(/^\//, '')}`;
}

export function formatDate(d: Date): string {
  return d.toLocaleDateString('he-IL', { day: 'numeric', month: 'long', year: 'numeric' });
}

export async function getYears() {
  const all = await getCollection('years');
  return all.sort((a, b) => b.data.order - a.data.order);
}

export async function getCurrentYear() {
  const all = await getYears();
  return all.find((y) => y.data.current) ?? all[0];
}

export async function getMeetings(yearId?: string) {
  const all = await getCollection(
    'meetings',
    (m) => (showDrafts || !m.data.draft) && (!yearId || m.data.year === yearId),
  );
  return all.sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
}

export async function getItems() {
  const all = await getCollection('items', (i) => showDrafts || !i.data.draft);
  return all.sort((a, b) => a.data.title.localeCompare(b.data.title, 'he'));
}

export async function getBots() {
  const all = await getCollection('bots');
  return all.sort((a, b) => b.data.order - a.data.order);
}

export async function getSchedule(yearId: string) {
  const all = await getCollection('schedule', (s) => s.data.year === yearId);
  return all
    .flatMap((s) => s.data.sessions)
    .sort((a, b) => a.date.getTime() - b.date.getTime());
}

export async function getSummaries() {
  const all = await getCollection('summaries', (s) => showDrafts || !s.data.draft);
  return all;
}

export function isoDate(d: Date): string {
  return d.toISOString().slice(0, 10);
}

export type Meeting = CollectionEntry<'meetings'>;
export type Item = CollectionEntry<'items'>;
export type Bot = CollectionEntry<'bots'>;
export type Year = CollectionEntry<'years'>;
