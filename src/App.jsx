import React from 'react';
import { Routes, Route } from 'react-router';
import SignupPage from './pages/Auth/SignupPage';
import LoginPage from './pages/Auth/LoginPage.jsx';
import SSOLoginPage from './pages/Auth/SSOLoginPage';
import LandingPage from './pages/LandingPage/LandingPage.jsx';
import Dashboard from "./pages/Dashboard/Dashboard.jsx"; 
import Account from "./pages/Profile/Account.jsx"; 
import ProfilePage from "./pages/Profile/Profile.tsx"; 
import Preference from "./pages/Preference/Preference.jsx"; 
import Availability from "./pages/Availability/Availability.jsx";
import ProductNew from "./pages/Product/ProductNew.jsx";
import ProductDetail from "./pages/Product/ProductDetail.jsx";
import Map from "./pages/Search/Map.jsx";
import MyAds from "./pages/MyAds/MyAds.jsx";
import Notifcations from "./components/common/Notification/Notification.jsx";
import ProtectedRoute from './components/Security/ProtectedRoutes';
import "./index.css";
import MessagesList from './pages/Messages/MessagesList.jsx';
import Message from './pages/Messages/Message.jsx';
import NewMessage from './pages/Messages/NewMessage.jsx';
import MainLayout from './Layouts/MainLayout.jsx';
import PaymentSuccessPage from './pages/Stripe/Success.jsx';
import ValidatePickup from './pages/Product/ValidatePickup.jsx';

export default function App() {
  return (
    <Routes>
      {/* Routes publiques */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/login/google" element={<SSOLoginPage />} />

      {/* Routes protégées */}
      <Route element={<ProtectedRoute />}>
        <Route element={<MainLayout />}>
          <Route path="/home" element={<Dashboard />} />
          <Route path="/new-product" element={<ProductNew />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/account" element={<Account />} />
          <Route path="/chats" element={<MessagesList />} />
          <Route path="/new-message" element={<NewMessage />} />
          <Route path="/chats/:chatId" element={<Message />} />
          <Route path="/account/profile" element={<ProfilePage />} />
          <Route path="/account/preferences" element={<Preference />} />
          <Route path="/account/availability" element={<Availability />} />
          <Route path="/checkout/success/:id" element={<PaymentSuccessPage />} />
          <Route path="/search" element={<Map />} />
          <Route path='/validate-pickup/:qrCodeToken' element={<ValidatePickup />} />
          <Route path="/my-ads" element={<MyAds />} />
          <Route path="/notifications" element={<Notifcations />} />
        </Route>
      </Route>
    </Routes>
  );
}