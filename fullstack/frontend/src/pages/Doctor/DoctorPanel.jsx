import React from 'react'
import { useNavigate } from 'react-router-dom'
import AppHeader from '../../components/AppHeader'

export default function DoctorPanel(){
  const navigate = useNavigate()
  return (
    <>
      <AppHeader showUser={true} />
      <div className="container mt-4">
        <div className="row g-3">
          <div className="col-md-4">
            <div className="card text-center p-3" role="button" onClick={()=>navigate('/doctor/request-admission')}>
              {/* ICON: replace with <i className="bi bi-plus-circle"></i> */}
              <div className="fs-1">🏥</div>
              <div>Solicitar Ingreso de Paciente</div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card text-center p-3" role="button" onClick={()=>navigate('/doctor/encounters')}>
              {/* ICON: replace with calendar icon */}
              <div className="fs-1">📅</div>
              <div>Citas</div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card text-center p-3" role="button" onClick={()=>navigate('/doctor/history')}>
              {/* ICON: replace with history icon */}
              <div className="fs-1">📖</div>
              <div>Historia Paciente</div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
