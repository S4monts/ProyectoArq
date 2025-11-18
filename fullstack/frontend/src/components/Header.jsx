import React from 'react'
import { useNavigate } from 'react-router-dom'

export default function Header() {
  const navigate = useNavigate();
  const name = localStorage.getItem('name') || 'Usuario';

  function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('name');
    navigate('/login');
  }

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container-fluid">
        <span className="navbar-brand">Medicor</span>
        <div className="d-flex">
          <div className="nav-item dropdown">
            <a className="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown">{name}</a>
            <ul className="dropdown-menu dropdown-menu-end">
              <li><button className="dropdown-item" onClick={logout}>Cerrar sesión</button></li>
            </ul>
          </div>
        </div>
      </div>
    </nav>
  )
}
