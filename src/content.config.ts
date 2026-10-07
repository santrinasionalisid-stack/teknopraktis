import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const articles = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/articles' }),
  schema: z.object({
    title: z.string(),
    description: z.string().min(80).max(180),
    slug: z.string(),
    category: z.string(),
    categorySlug: z.string(),
    tags: z.array(z.string()).default([]),
    publishedAt: z.coerce.date(),
    updatedAt: z.coerce.date().optional(),
    author: z.string().default('Redaksi TeknoPraktis'),
    featured: z.boolean().default(false),
    draft: z.boolean().default(false),
  }),
});

export const collections = { articles };
