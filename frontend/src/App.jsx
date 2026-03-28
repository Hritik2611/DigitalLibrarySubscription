import React from 'react';
import { Routes, Route } from 'react-router-dom';
// Page Imports
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import DashboardPage from './pages/DashboardPage';
import PlansPage from './pages/PlansPage';
import SeatingPlanPage from './pages/SeatingPlanPage';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import UserListPage from './pages/admin/UserListPage';
import SubscriptionListPage from './pages/admin/SubscriptionListPage';
import PaymentListPage from './pages/admin/PaymentListPage';
import DataControllerPage from './pages/admin/DataControllerPage';
import SeatManagementPage from './pages/admin/SeatManagementPage';
// Component Imports
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path='/forgot-password' element={<ForgotPasswordPage />} />
        <Route path='/reset-password/:token' element={<ResetPasswordPage />} />
        
        {/* Protected Student Routes */}
        <Route path="/" element={<ProtectedRoute />}>
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="seating-plan" element={<SeatingPlanPage />} />
          <Route path="plans" element={<PlansPage />} />
          <Route index element={<DashboardPage />} />
        </Route>

        {/* Protected Admin Routes */}
        <Route path="/admin" element={<AdminRoute />}>
          <Route path="dashboard" element={<AdminDashboardPage />} />
          <Route path="users" element={<UserListPage />} />
          <Route path="subscriptions" element={<SubscriptionListPage />} />
          <Route path="seats" element={<SeatManagementPage />} />
          <Route path="payments" element={<PaymentListPage />} />
          <Route path="data" element={<DataControllerPage />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;