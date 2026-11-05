import React from 'react'
import { Navigate } from 'react-router-dom'
import { getToken, getStored } from '../utils/auth'

export default function PrivateRoute({ children, role }) {
  const token = getToken();
  const myRole = getStored('role');
  if (!token) return <Navigate to="/login" />;
  if (role && myRole !== role) return <Navigate to="/login" />;
  return children;
}
