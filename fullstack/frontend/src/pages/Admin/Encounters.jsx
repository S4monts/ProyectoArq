import React, { useState } from 'react'
import axios from 'axios'

export default function Encounters(){
  const [form, setForm] = useState({ pacienteId:'', doctorId:'', fecha:'', hora:'', habitacion:'', cama:'', motivo:'' })
  const [msg, setMsg] = useState(null)

  async function submit(){
    try{
      const base = import.meta.env.VITE_API_URL || 'http://localhost:4000/api'
      const token = localStorage.getItem('token')
      const res = await axios.post(`${base}/encuentros`, form, { headers: { Authorization: `Bearer ${token}` } })
      if (res.data.ok) setMsg('Encuentro creado')
      else setMsg(res.data.msg)
    }catch(err){ setMsg(err.response?.data?.msg || err.message) }
  }

  return (
    <div className="container mt-4">
      <h4>Agendar Citas</h4>
      {msg && <div className="alert alert-info">{msg}</div>}
      <div className="row g-2">
        <div className="col-md-2"><input className="form-control" placeholder="pacienteId" value={form.pacienteId} onChange={e=>setForm({...form,pacienteId:e.target.value})}/></div>
        <div className="col-md-2"><input className="form-control" placeholder="doctorId" value={form.doctorId} onChange={e=>setForm({...form,doctorId:e.target.value})}/></div>
        <div className="col-md-2"><input className="form-control" placeholder="YYYY-MM-DD" value={form.fecha} onChange={e=>setForm({...form,fecha:e.target.value})}/></div>
        <div className="col-md-2"><input className="form-control" placeholder="HH:MM" value={form.hora} onChange={e=>setForm({...form,hora:e.target.value})}/></div>
        <div className="col-md-2"><button className="btn btn-primary" onClick={submit}>Crear</button></div>
      </div>
    </div>
  )
}
