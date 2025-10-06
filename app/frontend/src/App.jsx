import { useLocation, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import PublicRoute from './utils/PublicRoute';
import PrivateRoute from './utils/PrivateRoute';
import NotFound from './utils/NotFound';
import { useEffect } from "react";

// Components
import Login from './components/Login';
import Register from './components/Register';
import ForgotPassword from './components/ForgotPassword';
import Logout from './components/Logout';
import Home from './components/Home';
import About from './components/About';
import Notifications from './components/Notifications';
import Support from './components/Support';
import Dashboard from './components/Marketplace/Dashboard';
import Cart from './components/Marketplace/Cart';
import DataProducts from './components/Marketplace/DataProducts';
import OrderStatus from './components/Marketplace/OrderStatus';
import Contracts from './components/DataManagement/Contracts';
import Monitoring from './components/DataManagement/Monitoring';
import Observability from './components/DataManagement/Observability';
import Subscriptions from './components/DataManagement/Subscriptions';
import Validation from './components/DataManagement/Validation';
import Account from './components/User/Account';
import Wishlist from './components/User/Wishlist';
import BecomeProducer from './components/User/BecomeProducer';
import ProducerConsole from './components/Producer/ProducerConsole';
import ProductStudio from './components/Producer/ProductStudio';
import ConsumerRequest from './components/Producer/ConsumerRequest';
import ProductUsage from './components/Producer/ProductUsage';
import AdminConsole from './components/Admin/AdminConsole';
import MarketplaceManagement from './components/Admin/MarketplaceManagement';
import MarketplaceAnalytics from './components/Admin/MarketplaceAnalytics';
import ProducerManagement from './components/Admin/ProducerManagement';
import { scheduleTokenRefresh } from "./utils/authService";
import IdleTracker from './utils/IdleTracker';


function App() {
  const location = useLocation();
  const noNavbar = ['/', '/register', '/signout', '/forgot-password'].includes(location.pathname);

  const privateRoutes = [
    { path: '/home', element: <Home /> },
    { path: '/about', element: <About /> },
    { path: '/notifications', element: <Notifications /> },
    { path: '/support', element: <Support /> },
    { path: '/marketplace/dashboard', element: <Dashboard /> },
    { path: '/marketplace/data-products', element: <DataProducts /> },
    { path: '/marketplace/cart', element: <Cart /> },
    { path: '/marketplace/order-status', element: <OrderStatus /> },
    { path: '/data-management/my-subscriptions', element: <Subscriptions /> },
    { path: '/data-management/validation', element: <Validation /> },
    { path: '/data-management/monitoring', element: <Monitoring /> },
    { path: '/data-management/contracts', element: <Contracts /> },
    { path: '/data-management/observability', element: <Observability /> },
    { path: '/user/account', element: <Account /> },
    { path: '/user/wishlist', element: <Wishlist /> },
    { path: '/user/become-producer', element: <BecomeProducer /> },
    { path: '/producer/console', element: <ProducerConsole /> },
    { path: '/producer/data-product-studio', element: <ProductStudio /> },
    { path: '/producer/consumer-requests', element: <ConsumerRequest /> },
    { path: '/producer/product-usage', element: <ProductUsage /> },
    { path: '/admin/console', element: <AdminConsole /> },
    { path: '/admin/marketplace-management', element: <MarketplaceManagement /> },
    { path: '/admin/producer-management', element: <ProducerManagement /> },
    { path: '/admin/marketplace-analytics', element: <MarketplaceAnalytics /> },
  ];


  useEffect(() => {
    const access = sessionStorage.getItem("access_token");
    const refresh = sessionStorage.getItem("refresh_token");
    if (access && refresh) {
      scheduleTokenRefresh(access, refresh);
    }
  }, []);

  return (
    <>
      <IdleTracker idleTime={15 * 60 * 1000} warningTime={3 * 60} />
      {noNavbar ? (
        <Routes>
          <Route path='/' element={<PublicRoute><Login /></PublicRoute>} />
          <Route path='/register' element={<PublicRoute><Register /></PublicRoute>} />
          <Route path='/forgot-password' element={<PublicRoute><ForgotPassword /></PublicRoute>} />
          <Route path='/signout' element={<Logout />} />
          <Route path='*' element={<NotFound redirectAuthenticated={false} />} />
        </Routes>
      ) : (
        <Navbar
          content={
            <Routes>
              {privateRoutes.map(route => (
                <Route key={route.path} path={route.path} element={<PrivateRoute>{route.element}</PrivateRoute>} />
              ))}
              <Route path='*' element={<NotFound redirectAuthenticated={true} />} />
            </Routes>
          }
        />
      )}
    </>
  );
}

export default App;
