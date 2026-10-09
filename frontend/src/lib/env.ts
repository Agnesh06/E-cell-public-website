import { z } from 'zod'

const envSchema = z.object({
  VITE_API_URL: z.union([z.string().url(), z.literal('')]),
  VITE_CSEA_URL: z.union([z.string().url(), z.literal('')]),
})

export const env = envSchema.parse({
  VITE_API_URL: import.meta.env.VITE_API_URL ?? '',
  VITE_CSEA_URL: import.meta.env.VITE_CSEA_URL ?? '',
})
