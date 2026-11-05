import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { authHeaders, safeId } from '../../utils/auth'

export default function EncountersCalendar(){
  const [list, setList] = useState([])
  useEffect(()=>{ void fetchList() }, [])
  async function fetchList(){
    const doctorId = safeId(localStorage.getItem('userId')) || 'D-1'
    const base = import.meta.env.VITE_API_URL || 'http://localhost:4000/api'
    const res = await axios.get(`${base}/encuentros`, { params: { doctorId }, headers: authHeaders() })
    if (res.data.ok) setList(res.data.data)
  }
  return (
    <div className="container mt-4">
      <h4>Citas</h4>
      <table className="table">
        <thead><tr><th>Fecha</th><th>Hora</th><th>Paciente</th><th>Habitación</th><th>Cama</th></tr></thead>
        <tbody>
          {list.map((e)=> <tr key={e.id}><td>{e.fecha}</td><td>{e.hora}</td><td>{e.pacienteId}</td><td>{e.habitacion}</td><td>{e.cama}</td></tr>)}
        </tbody>
      </table>
    </div>
  )
}
