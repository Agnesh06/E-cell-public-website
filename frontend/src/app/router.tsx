import { lazy, Suspense, type ComponentType, type ReactNode } from 'react'
import { createBrowserRouter } from 'react-router'
import RootLayout from './RootLayout'
import LandingPage from '@/features/landing'
import {
  ProjectsSkeleton,
  TeamSkeleton,
  CollaborationSkeleton,
  ProjectDetailSkeleton,
} from '@/components/skeletons'
import { prefetchProjects, prefetchTeam } from '@/lib/useSheetData'

function lazyRoute(loader: () => Promise<{ default: ComponentType }>, fallback: ReactNode = null) {
  const Page = lazy(loader)
  return (
    <Suspense fallback={fallback}>
      <Page />
    </Suspense>
  )
}

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: <LandingPage />,
      },
      {
        path: 'projects',
        loader: () => {
          prefetchProjects()
          return null
        },
        element: lazyRoute(
          () => import('@/features/projects/ProjectsPage'),
          <ProjectsSkeleton />
        ),
      },
      {
        path: 'projects/:slug',
        loader: () => {
          prefetchProjects()
          return null
        },
        element: lazyRoute(
          () => import('@/features/projects/ProjectDetailPage'),
          <ProjectDetailSkeleton />
        ),
      },
      {
        path: 'team',
        loader: () => {
          prefetchTeam()
          return null
        },
        element: lazyRoute(
          () => import('@/features/team/TeamPage'),
          <TeamSkeleton />
        ),
      },
      {
        path: 'contact',
        element: lazyRoute(
          () => import('@/features/contact/Collaboration'),
          <CollaborationSkeleton />
        ),
      },
      {
        path: '*',
        element: lazyRoute(
          () => import('./NotFoundPage'),
          <div className="min-h-screen bg-[var(--color-bg)]" />
        ),
      },
    ],
  },
])
