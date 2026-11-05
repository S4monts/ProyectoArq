import React, { useState } from 'react'
import axios from 'axios'
import { authHeaders, safeId } from '../../utils/auth'

export default function PatientHistory(){
  const [query, setQuery] = useState('')
  const [hist, setHist] = useState([])
  const [msg, setMsg] = useState(null)

  async function search(){
    try{
      const base = import.meta.env.VITE_API_URL || 'http://localhost:4000/api'
      const pacienteId = safeId(query)
      if (!pacienteId) return setMsg('pacienteId inválido')
      const res = await axios.get(`${base}/historias`, { params: { pacienteId }, headers: authHeaders() })
      if (res.data.ok) setHist(res.data.data)
      else setMsg(res.data.msg)
    }catch(err){ setMsg(err.message) }
  }

  async function addEvolucion(pacienteId){
    const nota = prompt('Nota')
    if (!nota) return
    const id = safeId(pacienteId)
    if (!id) return setMsg('pacienteId inválido')
    const base = import.meta.env.VITE_API_URL || 'http://localhost:4000/api'
    const res = await axios.post(`${base}/historias/${encodeURIComponent(id)}/evoluciones`, { encuentroId: 0, nota, procedimientoMedicamento: false, authorId: localStorage.getItem('userId') }, { headers: authHeaders() })
    if (res.data.ok) setHist((s)=>[res.data.data, ...s])
  }

  return (
    <div className="container mt-4">
      <h4>Historia Paciente</h4>
      <div className="input-group mb-3"><input className="form-control" value={query} onChange={e=>setQuery(e.target.value)} placeholder="Ingrese pacienteId"/><button type="button" className="btn btn-primary" onClick={search}>Buscar</button></div>
      {msg && <div className="alert alert-warning">{msg}</div>}
      <div>
        <button type="button" className="btn btn-success mb-3" onClick={()=>addEvolucion(query)}>Agregar evolución</button>
      </div>
      <ul className="list-group">
        {hist.map((h)=> <li key={h.id} className="list-group-item">{h.timestamp}: {h.nota} <br/><small>by {h.authorId}</small></li>)}
      </ul>
    </div>
  )
}
