import { lazy, Suspense, type ComponentType } from 'react'
import { createBrowserRouter } from 'react-router'
import RootLayout from './RootLayout'

function lazyRoute(loader: () => Promise<{ default: ComponentType }>) {
  const Page = lazy(loader)
  return (
    <Suspense fallback={null}>
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
        element: lazyRoute(() => import('@/features/landing')),
      },
      {
        path: 'projects',
        element: lazyRoute(() => import('@/features/projects/ProjectsPage')),
      },
      {
        path: 'projects/:slug',
        element: lazyRoute(
          () => import('@/features/projects/ProjectDetailPage'),
        ),
      },
      {
        path: 'team',
        element: lazyRoute(() => import('@/features/team/TeamPage')),
      },
      {
        path: 'contact',
        element: lazyRoute(() => import('@/features/contact/ContactPage')),
      },
      {
        path: '*',
        element: lazyRoute(() => import('./NotFoundPage')),
      },
    ],
  },
])
