import React from 'react';
import { createBrowserRouter, Outlet } from 'react-router-dom';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Home } from '@/pages/Home/Home';

const RootLayout: React.FC = () => {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] focus:rounded-md focus:bg-white focus:px-3 focus:py-2 focus:text-slate-900"
      >
        Skip to content
      </a>
      <Navbar />
      <main id="main-content" className="flex-1 pt-[var(--nav-h)]">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

// Route placeholders for pages out of scope (Do not touch Projects, ProjectDetail, Team, or Collaboration files)
const ProjectsPlaceholder: React.FC = () => (
  <div className="pt-28 pb-16 min-h-screen max-w-7xl mx-auto px-6">
    <h1 className="text-3xl font-bold">Projects</h1>
    <p className="mt-2 text-muted-foreground">Projects showcase coming soon.</p>
  </div>
);

const TeamPlaceholder: React.FC = () => (
  <div className="pt-28 pb-16 min-h-screen max-w-7xl mx-auto px-6">
    <h1 className="text-3xl font-bold">Team Directory</h1>
    <p className="mt-2 text-muted-foreground">E-Cell team wings and members directory.</p>
  </div>
);

const CollaborationPlaceholder: React.FC = () => (
  <div className="pt-28 pb-16 min-h-screen max-w-7xl mx-auto px-6">
    <h1 className="text-3xl font-bold">Collaboration & Partnerships</h1>
    <p className="mt-2 text-muted-foreground">Corporate and academic partnership proposals.</p>
  </div>
);

const NotFoundPlaceholder: React.FC = () => (
  <div className="pt-28 pb-16 min-h-screen max-w-7xl mx-auto px-6 text-center">
    <h1 className="text-4xl font-extrabold">404</h1>
    <p className="mt-2 text-muted-foreground">Page not found.</p>
  </div>
);

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: 'projects',
        element: <ProjectsPlaceholder />,
      },
      {
        path: 'team',
        element: <TeamPlaceholder />,
      },
      {
        path: 'collaboration',
        element: <CollaborationPlaceholder />,
      },
      {
        path: '*',
        element: <NotFoundPlaceholder />,
      },
    ],
  },
]);

