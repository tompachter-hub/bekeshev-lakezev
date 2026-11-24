import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

// ערכי "סוג" מטבלת התגיות במסמך האפיון
export const KINDS = [
  'מהלך פדגוגי',
  'דילמה',
  'רעיון מהמליאה',
  'מאמר או מקור',
  'קישור חיצוני',
  'תוצר מורה',
  'שיעור',
  'כלי',
] as const;

// ערכי "סוג ריווח" (שנת בקשב לקצב)
export const RITUAL_TYPES = [
  'משחק',
  'שיח',
  'סרטון',
  'בחירה לימודית',
  'בחירה משחקית',
  'חושית',
  'עצירה וגמישות בזמן',
] as const;

const years = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/years' }),
  schema: z.object({
    title: z.string(),
    hebrewYear: z.string(),
    current: z.boolean().default(false),
    description: z.string().default(''),
    order: z.number(), // לסידור: מספר גבוה = שנה מאוחרת יותר
  }),
});

const meetings = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/meetings' }),
  schema: z.object({
    year: z.string(),
    number: z.number(),
    date: z.coerce.date(),
    title: z.string(),
    summary: z.string(),
    nextTask: z.string().optional(),
    photos: z
      .array(z.object({ src: z.string(), alt: z.string() }))
      .default([]),
    whatsapp: z.string().optional(),
    draft: z.boolean().default(false), // טיוטה: מוצגת רק בהרצה מקומית, לא באתר החי
  }),
});

const items = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/items' }),
  schema: z.object({
    title: z.string(),
    kind: z.enum(KINDS),
    year: z.string(),
    meeting: z.string().optional(),
    ritualType: z.enum(RITUAL_TYPES).optional(),
    author: z.string().default('תום'),
    summary: z.string().default(''),
    url: z.string().optional(),
    whyRead: z.string().optional(),
    file: z.string().optional(),
    draft: z.boolean().default(false),
  }),
});

const bots = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/bots' }),
  schema: z.object({
    name: z.string(),
    year: z.string(),
    url: z.string().optional(), // ריק = הקישור עוד לא מוכן
    howTo: z.string(),
    order: z.number().default(0),
  }),
});

// לוח מפגשים – קובץ אחד לכל שנה. קבצים שמתחילים בקו תחתון (_) הם תבניות ולא מוצגים.
const schedule = defineCollection({
  loader: glob({ pattern: '[^_]*.md', base: './src/content/schedule' }),
  schema: z.object({
    year: z.string(),
    sessions: z
      .array(
        z.object({
          date: z.coerce.date(),
          time: z.string().optional(), // למשל "14:00–15:30"
          place: z.string().optional(),
          topic: z.string().optional(),
        }),
      )
      .default([]),
  }),
});

// עבודת הסיכום השנתית – קובץ אחד לכל שנה
const summaries = defineCollection({
  loader: glob({ pattern: '[^_]*.md', base: './src/content/summaries' }),
  schema: z.object({
    year: z.string(),
    title: z.string(),
    file: z.string().optional(), // קובץ להורדה, למשל media/summary-tashpaz.pdf
    fileLabel: z.string().optional(), // הטקסט על כפתור ההורדה
    draft: z.boolean().default(false),
  }),
});

export const collections = { years, meetings, items, bots, schedule, summaries };
