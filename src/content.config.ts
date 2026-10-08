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
    contentType: z.enum(['tutorial', 'checklist', 'explainer', 'decision-guide']),
    featuredImage: z.string().startsWith('/images/articles/'),
    featuredImageAlt: z.string().min(20).max(180),
    socialImage: z.string().startsWith('/images/articles/').optional(),
    imageStyle: z.literal('premium-v1').optional(),
    imageTagline: z.string().min(20).max(80).optional(),
    tags: z.array(z.string()).min(2).max(8),
    publishedAt: z.coerce.date(),
    updatedAt: z.coerce.date().optional(),
    reviewedAt: z.coerce.date().optional(),
    author: z.string().default('Redaksi TeknoPraktis'),
    reviewedBy: z.string().optional(),
    sources: z.array(sourceSchema).default([]),
    aiAssisted: z.boolean().default(false),
    editorialNote: z.string().max(280).optional(),
    featured: z.boolean().default(false),
    sponsored: z.boolean().default(false),
    draft: z.boolean().default(false),
  }),
});

export const collections = { articles };
