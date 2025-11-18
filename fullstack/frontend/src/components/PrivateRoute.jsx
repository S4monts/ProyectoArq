import React from 'react'
import { Navigate } from 'react-router-dom'

export default function PrivateRoute({ children, role }) {
  const token = localStorage.getItem('token');
  const myRole = localStorage.getItem('role');
  if (!token) return <Navigate to="/login" />;
  if (role && myRole !== role) return <Navigate to="/login" />;
  return children;
}
