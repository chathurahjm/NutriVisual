import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blog = defineCollection({
  loader: glob({ pattern: '**/[^_]*.md', base: "./src/content/blog" }),
  schema: z.object({
    title: z.string(),
    subtitle: z.string(),
    category: z.string(),
    date: z.string(),
    readTime: z.string(),
    youtubeId: z.string().optional(),
    relatedFoods: z.array(z.string()).default([]),
    cta: z.object({
      text: z.string(),
      url: z.string(),
    })
  })
});

export const collections = { blog };
