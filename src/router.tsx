import { createBrowserRouter } from 'react-router-dom';
import RootLayout from './components/layout/RootLayout';
import Home from './pages/Home/Home';
import Projects from './pages/Projects/Projects';
import ProjectDetail from './pages/ProjectDetail/ProjectDetail';
import Team from './pages/Team/Team';
import Collaboration from './pages/Collaboration/Collaboration';
import NotFound from './pages/NotFound/NotFound';

export const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      {
        path: '/',
        element: <Home />,
      },
      {
        path: '/projects',
        element: <Projects />,
      },
      {
        path: '/projects/:slug',
        element: <ProjectDetail />,
      },
      {
        path: '/team',
        element: <Team />,
      },
      {
        path: '/collaboration',
        element: <Collaboration />,
      },
      {
        path: '*',
        element: <NotFound />,
      },
    ],
  },
]);
