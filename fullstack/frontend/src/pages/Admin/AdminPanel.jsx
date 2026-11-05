import React from 'react'
import { useNavigate } from 'react-router-dom'
import AppHeader from '../../components/AppHeader'
import { getStored } from '../../utils/auth'

export default function AdminPanel(){
  const navigate = useNavigate()
  const [showMenu, setShowMenu] = useState(false)
  const menuRef = useRef()
  const username = getStored('name') || getStored('username') || 'Usuario'

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

  return (
    <>
      <AppHeader showUser={true} />
      <div className="container mt-4">
        <div className="row g-3">
          <div className="col-md-3"><div className="card text-center p-3" role="button" onClick={()=>navigate('/admin/patients')}><div className="fs-1">👥</div><div>Pacientes</div></div></div>
          <div className="col-md-3"><div className="card text-center p-3" role="button" onClick={()=>navigate('/admin/doctors')}><div className="fs-1">👨‍⚕️</div><div>Doctores</div></div></div>
          <div className="col-md-3"><div className="card text-center p-3" role="button" onClick={()=>navigate('/admin/encounters')}><div className="fs-1">📅</div><div>Agendar Citas</div></div></div>
          <div className="col-md-3"><div className="card text-center p-3" role="button" onClick={()=>navigate('/admin/admins')}><div className="fs-1">⚙️</div><div>Administración</div></div></div>
        </div>
      </div>
    </>
  )
}
