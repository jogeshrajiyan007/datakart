import { useState } from 'react'
import './App.css'
import Home from './components/Home'
import Login from './components/Login'
import Navbar from './components/Navbar'
import Register from './components/Register'
import About from './components/About'
import Logout  from './components/Logout'
import Notifications from './components/Notifications'
import Support from './components/Support'
import Dashboard from './components/Marketplace/Dashboard'
import Cart from './components/Marketplace/Cart'
import DataProducts from './components/Marketplace/DataProducts'
import OrderStatus from './components/Marketplace/OrderStatus'
import Contracts from './components/DataManagement/Contracts'
import Monitoring from './components/DataManagement/Monitoring'
import Observability from './components/DataManagement/Observability'
import Subscriptions from './components/DataManagement/Subscriptions'
import Validation from './components/DataManagement/Validation'
import ConsumerRequest from './components/Producer/ConsumerRequest'
import ProductStudio from './components/Producer/ProductStudio'
import ProducerConsole from './components/Producer/ProducerConsole'
import ProductUsage from './components/Producer/ProductUsage'
import AdminConsole from './components/Admin/AdminConsole'
import MarketplaceManagement from './components/Admin/MarketplaceManagement'
import MarketplaceAnalytics from './components/Admin/MarketplaceAnalytics'
import ProducerManagement from './components/Admin/ProducerManagement'
import ForgotPassword  from './components/ForgotPassword'

import { Routes, Route, useLocation } from 'react-router-dom'
import Account from './components/User/Account'
import Wishlist from './components/User/Wishlist'
import BecomeProducer from './components/User/BecomeProducer'

function App() {
  const location = useLocation()
  const noNavbar = location.pathname === "/register" || location.pathname === "/" || location.pathname === "/signout" || location.pathname === "/forgot-password"

  return (
    <>
      {
        noNavbar ?
        <Routes>
          <Route path='/' element={<Login/>}/>
          <Route path='/register' element={<Register/>}/>
          <Route path='/signout' element={<Logout/>}/>
          <Route path='/forgot-password' element={<ForgotPassword/>}/>
        </Routes>

        :

        <Navbar
        content = {
            <Routes>
              <Route path='/home' element={<Home/>}/>
              <Route path='/about' element={<About/>}/>
              <Route path='/notifications' element={<Notifications/>}/>
              <Route path='/support' element={<Support/>}/>
              <Route path='/marketplace/dashboard' element={<Dashboard/>}/>
              <Route path='/marketplace/data-products' element={<DataProducts/>}/>
              <Route path='/marketplace/cart' element={<Cart/>}/>
              <Route path='/marketplace/order-status' element={<OrderStatus/>}/>
              <Route path='/data-management/my-subscriptions' element={<Subscriptions/>}/>
              <Route path='/data-management/validation' element={<Validation/>}/>
              <Route path='/data-management/monitoring' element={<Monitoring/>}/>
              <Route path='/data-management/contracts' element={<Contracts/>}/>
              <Route path='/data-management/observability' element={<Observability/>}/>
              <Route path='/user/account' element={<Account/>}/>
              <Route path='/user/wishlist' element={<Wishlist/>}/>
              <Route path='/user/become-producer' element={<BecomeProducer/>}/>
              <Route path='/producer/console' element={<ProducerConsole/>}/>
              <Route path='/producer/data-product-studio' element={<ProductStudio/>}/>
              <Route path='/producer/consumer-requests' element={<ConsumerRequest/>}/>
              <Route path='/producer/product-usage' element={<ProductUsage/>}/>
              <Route path='/admin/console' element={<AdminConsole/>}/>
              <Route path='/admin/marketplace-management' element={<MarketplaceManagement/>}/>
              <Route path='/admin/producer-management' element={<ProducerManagement/>}/>
              <Route path='/admin/marketplace-analytics' element={<MarketplaceAnalytics/>}/>
            </Routes>
        }
      />
      
      }
    </>
  )
}

export default App
