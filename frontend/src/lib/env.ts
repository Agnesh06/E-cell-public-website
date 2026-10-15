import { z } from 'zod'

const envSchema = z.object({
  VITE_API_BASE_URL: z.string().optional(),
  VITE_API_URL: z.union([z.string().url(), z.literal('')]).optional().default(''),
  VITE_USE_MOCK_API: z.boolean().default(false),
  VITE_CSEA_URL: z.union([z.string().url(), z.literal('')]).optional().default(''),
  VITE_PROJECTS_SHEET_ID: z.string().optional(),
  VITE_TEAM_SHEET_ID: z.string().optional(),
  VITE_PROJECTS_SHEET_TAB: z.string().optional().default('Form responses 1'),
  VITE_TEAM_SHEET_TAB: z.string().optional().default('Form responses 1'),
  VITE_PROJECTS_CSV_URL: z.string().optional(),
  VITE_TEAM_CSV_URL: z.string().optional(),
})

const rawBaseUrl = (import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL || '')
  .trim()
  .replace(/\/+$/, '')
const rawUseMock = import.meta.env.VITE_USE_MOCK_API

export const env = envSchema.parse({
  VITE_API_BASE_URL: rawBaseUrl || undefined,
  VITE_API_URL: rawBaseUrl || '',
  VITE_USE_MOCK_API: rawUseMock === 'true' || rawUseMock === true,
  VITE_CSEA_URL: import.meta.env.VITE_CSEA_URL ?? '',
  VITE_PROJECTS_SHEET_ID: import.meta.env.VITE_PROJECTS_SHEET_ID || undefined,
  VITE_TEAM_SHEET_ID: import.meta.env.VITE_TEAM_SHEET_ID || undefined,
  VITE_PROJECTS_SHEET_TAB: import.meta.env.VITE_PROJECTS_SHEET_TAB || 'Form responses 1',
  VITE_TEAM_SHEET_TAB: import.meta.env.VITE_TEAM_SHEET_TAB || 'Form responses 1',
  VITE_PROJECTS_CSV_URL: import.meta.env.VITE_PROJECTS_CSV_URL || undefined,
  VITE_TEAM_CSV_URL: import.meta.env.VITE_TEAM_CSV_URL || undefined,
})

