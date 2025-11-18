import React, { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'

export default function AppHeader({ showUser = true }) {
  const navigate = useNavigate()
  const [showMenu, setShowMenu] = useState(false)
  const menuRef = useRef()
  const username = localStorage.getItem('name') || localStorage.getItem('username') || 'Usuario'

  React.useEffect(() => {
    function handleClick(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) setShowMenu(false)
    }
    if (showMenu) document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [showMenu])

  function logout() {
    localStorage.clear()
    navigate('/login')
  }

  return (
    <header className="w-100 d-flex align-items-center px-4 py-3 border-bottom bg-light justify-content-between" style={{minHeight:'80px'}}>
      <div className="d-flex align-items-center">
        {/* Reemplaza src por tu logo en src/assets/logo.png si lo tienes */}
        <img src="https://via.placeholder.com/48" alt="Logo Medicor" style={{width:48,height:48,objectFit:'cover'}} className="me-3" />
        <span className="h2 mb-0 fw-bold">Medicor</span>
      </div>
      {showUser && (
        <div className="position-relative" ref={menuRef}>
          <button className="btn btn-outline-secondary" onClick={()=>setShowMenu(v=>!v)}>
            {username}
          </button>
          {showMenu && (
            <div className="dropdown-menu show end-0 mt-2" style={{position:'absolute',right:0,minWidth:'140px'}}>
              <button className="dropdown-item" onClick={logout}>Cerrar sesión</button>
            </div>
          )}
        </div>
      )}
    </header>
  )
}
