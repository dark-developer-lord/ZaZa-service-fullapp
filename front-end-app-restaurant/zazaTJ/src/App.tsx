import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Layout from './pages/layout';
import Home from './pages/home';
import About from './pages/about';
import DineOut from './pages/b2bdeliver';
import ResDeliver from './pages/resDeliver';
import Supermarkets from './pages/supermarkets';
import Box from './pages/box';
import Sigin from './pages/sigin';
import Pharmacy from './pages/pharmacy';
import CorporatePackages from './pages/corporatePackages';
import FoodPage from './pages/food';

const App = () => {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      children: [
        {
          index: true,
          element: <Home />,
        },
        {
          path: "/about",
          element: <About />,
        },
        {
          path: "/b2bdeliver",
          element:<DineOut/>
        },
        {
          path: "/food",
          element: <FoodPage />
        },
        {
          path: "/resDeliver",
          element:<ResDeliver/>
        },
        {
          path: "/supermarkets",
          element:<Supermarkets/>
        },
        {
          path: "/box",
          element:<Box/>
        },
        {
          path: "/signin",
          element:<Sigin/>
        },
        {
          path: "/pharmacy",
          element:<Pharmacy/>
        },
        {
          path:"/CorporatePackages",
          element:<CorporatePackages/>
        }
      ],

    },
  ]);
  return (
    <div>
        <RouterProvider router={router}/>
    </div>
  )
}

export default App
