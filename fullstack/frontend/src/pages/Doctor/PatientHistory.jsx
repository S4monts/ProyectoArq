import React, { useState } from 'react'
import AppHeader from '../../components/AppHeader'
import axios from 'axios'

export default function PatientHistory(){
  const [query, setQuery] = useState('')
  const [hist, setHist] = useState([])
  const [msg, setMsg] = useState(null)

  async function search(){
    try{
      // For simplicity we assume query is pacienteId or cama
      const base = import.meta.env.VITE_API_URL || 'http://localhost:4000/api'
      // If query numeric treat as pacienteId
      const pacienteId = query
      const token = localStorage.getItem('token')
      const res = await axios.get(`${base}/historias?pacienteId=${pacienteId}`, { headers: { Authorization: `Bearer ${token}` } })
      if (res.data.ok) setHist(res.data.data)
      else setMsg(res.data.msg)
    }catch(err){ setMsg(err.message) }
  }

  async function addEvolucion(pacienteId){
    const nota = prompt('Nota')
    if (!nota) return
    const base = import.meta.env.VITE_API_URL || 'http://localhost:4000/api'
    const token = localStorage.getItem('token')
    const res = await axios.post(`${base}/historias/${pacienteId}/evoluciones`, { encuentroId: 0, nota, procedimientoMedicamento: false, authorId: localStorage.getItem('userId') }, { headers: { Authorization: `Bearer ${token}` } })
    if (res.data.ok) setHist((s)=>[res.data.data, ...s])
  }

  return (
    <>
      <AppHeader showUser={true} />
      <div className="container mt-4">
      <h4>Historia Paciente</h4>
      <div className="input-group mb-3"><input className="form-control" value={query} onChange={e=>setQuery(e.target.value)} placeholder="Ingrese pacienteId"/><button className="btn btn-primary" onClick={search}>Buscar</button></div>
      {msg && <div className="alert alert-warning">{msg}</div>}
      <div>
        <button className="btn btn-success mb-3" onClick={()=>addEvolucion(query)}>Agregar evolución</button>
      </div>
      <ul className="list-group">
        {hist.map((h)=> <li key={h.id} className="list-group-item">{h.timestamp}: {h.nota} <br/><small>by {h.authorId}</small></li>)}
      </ul>
      </div>
    </>
  )
}
