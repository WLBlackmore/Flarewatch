import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from './pages/Home.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Mapviewer from './pages/Mapviewer.jsx';
import About from './pages/About.jsx';
import RootLayout from './RootLayout.jsx';
import './index.css'

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    errorElement: <h1>Error</h1>,
    children: [
      { path: "/", element: <Home/> },
      { path: "/dashboard", element: <Dashboard/> },
      { path: "/mapviewer", element: <Mapviewer/> },
      { path: "/about", element: <About/> }
    ]
  }
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
