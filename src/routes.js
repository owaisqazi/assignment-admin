import { Navigate, useRoutes } from 'react-router-dom';
// layouts
import DashboardLayout from './layouts/dashboard';
import SimpleLayout from './layouts/simple';
//
import UserPage from './pages/Blog/UserPage';
import LoginPage from './pages/LoginPage';
import Page404 from './pages/Page404';

import DashboardAppPage from './pages/DashboardAppPage';

import CreatePackage from './pages/Package/CreatePackage';
import ViewPackage from './pages/Package/ViewPackage';
import Edit from './pages/Package/Edit';
import AddBlog from './pages/Blog/AddBlog';
import EditBlog from './pages/Blog/EditBlog';

// ----------------------------------------------------------------------
export default function Router() {
  const routes = useRoutes([
    {
      path: '/dashboard',
      element: <DashboardLayout />,
      children: [
        { element: <Navigate to="/dashboard/app" />, index: true },
        { path: 'user', element: <UserPage /> },
        { path: 'addblog', element: <AddBlog /> },
        { path: 'editblog/:id', element: <EditBlog /> },
        { path: 'app', element: <DashboardAppPage /> },

        { path: 'createpackage', element: <CreatePackage /> },
        { path: 'viewpackage', element: <ViewPackage /> },
        { path: 'edit/:id', element: <Edit /> },
      ],
    },

    {
      path: 'login',
      element: <LoginPage />,
    },
    {
      element: <SimpleLayout />,
      children: [
        { element: <Navigate to="/login" />, index: true },
        { path: '404', element: <Page404 /> },
        { path: '*', element: <Navigate to="/404" /> },
      ],
    },
    {
      path: '*',
      element: <Navigate to="/404" replace />,
    },
  ]);

  return routes;
}
