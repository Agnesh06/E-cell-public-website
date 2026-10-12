import { z } from 'zod'

const envSchema = z.object({
  VITE_API_URL: z.union([z.string().url(), z.literal('')]),
  VITE_CSEA_URL: z.union([z.string().url(), z.literal('')]),
  VITE_PROJECTS_SHEET_ID: z.string().optional(),
  VITE_TEAM_SHEET_ID: z.string().optional(),
  VITE_PROJECTS_SHEET_TAB: z.string().optional().default('Form responses 1'),
  VITE_TEAM_SHEET_TAB: z.string().optional().default('Form responses 1'),
  VITE_PROJECTS_CSV_URL: z.string().optional(),
  VITE_TEAM_CSV_URL: z.string().optional(),
})

export const env = envSchema.parse({
  VITE_API_URL: import.meta.env.VITE_API_URL ?? '',
  VITE_CSEA_URL: import.meta.env.VITE_CSEA_URL ?? '',
  VITE_PROJECTS_SHEET_ID: import.meta.env.VITE_PROJECTS_SHEET_ID || undefined,
  VITE_TEAM_SHEET_ID: import.meta.env.VITE_TEAM_SHEET_ID || undefined,
  VITE_PROJECTS_SHEET_TAB: import.meta.env.VITE_PROJECTS_SHEET_TAB || 'Form responses 1',
  VITE_TEAM_SHEET_TAB: import.meta.env.VITE_TEAM_SHEET_TAB || 'Form responses 1',
  VITE_PROJECTS_CSV_URL: import.meta.env.VITE_PROJECTS_CSV_URL || undefined,
  VITE_TEAM_CSV_URL: import.meta.env.VITE_TEAM_CSV_URL || undefined,
})
