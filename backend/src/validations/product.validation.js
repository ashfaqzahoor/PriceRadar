import { z } from 'zod';

export const searchSchema = z.object({
  query: z.object({
    q: z.string().max(80).default(''),
    category: z.string().optional(),
    pincode: z.string().optional(),
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().max(50).default(12),
    sort: z.enum(['best', 'price_desc', 'name', 'unit_price', 'savings']).default('best'),
    provider: z.string().default('all'),
    availableOnly: z.coerce.boolean().default(false)
  }),
  body: z.object({}).passthrough(),
  params: z.object({}).passthrough()
});

export const suggestionSchema = z.object({
  query: z.object({
    q: z.string().min(1).max(80)
  }),
  body: z.object({}).passthrough(),
  params: z.object({}).passthrough()
});

export const wishlistSchema = z.object({
  body: z.object({
    productKey: z.string().min(1),
    name: z.string().min(1),
    imageUrl: z.string().url().optional().or(z.literal('')),
    bestPrice: z.number().optional(),
    provider: z.string().optional(),
    productUrl: z.string().url().optional()
  }),
  query: z.object({}).passthrough(),
  params: z.object({}).passthrough()
});

export const productKeyParamSchema = z.object({
  params: z.object({
    productKey: z.string().min(1)
  }),
  query: z.object({
    pincode: z.string().optional()
  }).passthrough(),
  body: z.object({}).passthrough()
});

