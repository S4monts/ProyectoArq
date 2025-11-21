import React, { useState, useRef, useEffect } from 'react'
import styles from './AdminPanel.module.css'
import { useNavigate } from 'react-router-dom'
import AppHeader from '../../components/AppHeader'
import api from '../../services/api'

export default function AdminPanel(){
  const navigate = useNavigate()
  const [showMenu, setShowMenu] = useState(false)
  const menuRef = useRef()
  const username = localStorage.getItem('name') || localStorage.getItem('username') || 'Usuario'
  const [isSenior, setIsSenior] = useState(() => {
    const v = localStorage.getItem('isSenior')
    return v === 'true' ? true : (v === 'false' ? false : null)
  })

  // Cerrar menú si se hace clic fuera
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

  // Ensure we know whether current admin is senior; if unknown, fetch from API
  useEffect(()=>{
    if (isSenior !== null) return
    const token = localStorage.getItem('token')
    const userId = Number(localStorage.getItem('userId'))
    if (!token || !userId) {
      setIsSenior(false)
      localStorage.setItem('isSenior','false')
      return
    }
    api.get('/admins').then(res=>{
      const admins = res.data.data || []
      const me = admins.find(a => a.id === userId)
      const senior = !!(me && me.isSenior)
      setIsSenior(senior)
      localStorage.setItem('isSenior', senior ? 'true' : 'false')
    }).catch(err=>{
      setIsSenior(false)
      localStorage.setItem('isSenior','false')
    })
  },[isSenior])

  return (
    <>
      <AppHeader showUser={true} />
      <div className="container-fluid py-5" style={{background:'#e9ffe6'}}>
        <div className="container px-0" style={{maxWidth:'720px'}}>
          <h2 className="fw-bold text-dark pt-3 pb-2" style={{marginTop:0,marginBottom:0,justifyContent:'center', display:'flex'}}>Bienvenido al panel de administración</h2>
        </div>
          <div className="container mt-2 d-flex justify-content-center align-items-center" style={{minHeight:'60vh'}}>
            <div className="row w-100 g-4" style={{maxWidth:'720px'}}>
              <div className="col-6 mb-4">
                <div className={`card text-center p-4 fs-2 d-flex flex-column justify-content-center align-items-center ${styles.panelCard}`} role="button" style={{height:'260px',cursor:'pointer'}} onClick={()=>navigate('/admin/patients')}>
                  <div className="fs-1 mb-2">👥</div>
                  <div>Pacientes</div>
                </div>
              </div>
              <div className="col-6 mb-4">
                <div className={`card text-center p-4 fs-2 d-flex flex-column justify-content-center align-items-center ${styles.panelCard}`} role="button" style={{height:'260px',cursor:'pointer'}} onClick={()=>navigate('/admin/doctors')}>
                  <div className="fs-1 mb-2">👨‍⚕️</div>
                  <div>Doctores</div>
                </div>
              </div>
              <div className="col-6 mb-4">
                <div className={`card text-center p-4 fs-2 d-flex flex-column justify-content-center align-items-center ${styles.panelCard}`} role="button" style={{height:'260px',cursor:'pointer'}} onClick={()=>navigate('/admin/encounters')}>
                  <div className="fs-1 mb-2">📅</div>
                  <div>Agendar Citas</div>
                </div>
              </div>
              {isSenior ? (
                <div className="col-6 mb-4">
                  <div className={`card text-center p-4 fs-2 d-flex flex-column justify-content-center align-items-center ${styles.panelCard}`} role="button" style={{height:'260px',cursor:'pointer'}} onClick={()=>navigate('/admin/admins')}>
                    <div className="fs-1 mb-2">⚙️</div>
                    <div>Administración</div>
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </div>
    </>
  )
}
