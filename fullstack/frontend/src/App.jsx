import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import DoctorPanel from './pages/Doctor/DoctorPanel'
import RequestAdmission from './pages/Doctor/RequestAdmission'
import EncountersCalendar from './pages/Doctor/EncountersCalendar'
import PatientHistory from './pages/Doctor/PatientHistory'
import AdminPanel from './pages/Admin/AdminPanel'
import Patients from './pages/Admin/Patients'
import Doctors from './pages/Admin/Doctors'
import Encounters from './pages/Admin/Encounters'
import Admins from './pages/Admin/Admins'
import Header from './components/Header'
import PrivateRoute from './components/PrivateRoute'

export default function App() {
  const token = localStorage.getItem('token');
  return (
    <BrowserRouter>
      {window.location.pathname !== '/login' && token && <Header />}
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/doctor" element={<PrivateRoute role="doctor"><DoctorPanel /></PrivateRoute>} />
        <Route path="/doctor/request-admission" element={<PrivateRoute role="doctor"><RequestAdmission /></PrivateRoute>} />
        <Route path="/doctor/encounters" element={<PrivateRoute role="doctor"><EncountersCalendar /></PrivateRoute>} />
        <Route path="/doctor/history" element={<PrivateRoute role="doctor"><PatientHistory /></PrivateRoute>} />

        <Route path="/admin" element={<PrivateRoute role="admin"><AdminPanel /></PrivateRoute>} />
        <Route path="/admin/patients" element={<PrivateRoute role="admin"><Patients /></PrivateRoute>} />
        <Route path="/admin/doctors" element={<PrivateRoute role="admin"><Doctors /></PrivateRoute>} />
        <Route path="/admin/encounters" element={<PrivateRoute role="admin"><Encounters /></PrivateRoute>} />
        <Route path="/admin/admins" element={<PrivateRoute role="admin"><Admins /></PrivateRoute>} />

        <Route path="/" element={<Navigate to={token ? (localStorage.getItem('role') === 'admin' ? '/admin' : '/doctor') : '/login'} />} />
      </Routes>
    </BrowserRouter>
  )
}
