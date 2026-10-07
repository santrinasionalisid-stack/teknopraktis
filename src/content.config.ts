import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const sourceSchema = z.object({
  title: z.string().min(2),
  url: z.string().url(),
});

const articles = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/articles' }),
  schema: z.object({
    title: z.string().min(20).max(100),
    seoTitle: z.string().min(20).max(70).optional(),
    description: z.string().min(80).max(180),
    slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
    category: z.string(),
    categorySlug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
    tags: z.array(z.string()).min(2).max(8),
    publishedAt: z.coerce.date(),
    updatedAt: z.coerce.date().optional(),
    reviewedAt: z.coerce.date().optional(),
    author: z.string().default('Redaksi TeknoPraktis'),
    reviewedBy: z.string().optional(),
    sources: z.array(sourceSchema).default([]),
    featured: z.boolean().default(false),
    sponsored: z.boolean().default(false),
    draft: z.boolean().default(false),
  }),
});

export const collections = { articles };
