import React from 'react'
import { useSelector } from 'react-redux'
import { Navigate, Outlet, replace } from 'react-router-dom';

const AdminRoute = () => {
const {userInfo} = useSelector((state) => state.auth);

  return userInfo && userInfo.role == 'admin' ?(
    <Outlet />
  ) : (
    <Navigate to="/login" replace />
  );
};

export default AdminRoute;
