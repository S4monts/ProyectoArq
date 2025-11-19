import React, { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import logo from '../assets/Medicor.png'

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
    <header className="w-100 d-flex align-items-center px-4 border-bottom justify-content-between" style={{background:'#c1ff72',height:'auto'}}>
      <div className="d-flex align-items-center" style={{margin:'0'}}>
        <img src={logo} alt="Logo Medicor" style={{width:160,height:50,objectFit:'contain',margin:'0',padding:'0',display:'block'}} />
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
