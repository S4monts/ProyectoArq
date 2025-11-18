import React, { useEffect, useState } from 'react'
import axios from 'axios'

export default function Patients(){
  const [list, setList] = useState([])
  const [form, setForm] = useState({ nombre:'', apellido:'', dni:'', edad:'', habitacion:'', cama:'' })

  useEffect(()=>{ fetchList() }, [])
  async function fetchList(){
    const token = localStorage.getItem('token')
    const base = import.meta.env.VITE_API_URL || 'http://localhost:4000/api'
    const res = await axios.get(`${base}/pacientes`, { headers: { Authorization: `Bearer ${token}` } })
    if (res.data.ok) setList(res.data.data)
  }

  async function create(){
    const token = localStorage.getItem('token')
    const base = import.meta.env.VITE_API_URL || 'http://localhost:4000/api'
    const res = await axios.post(`${base}/pacientes`, form, { headers: { Authorization: `Bearer ${token}` } })
    if (res.data.ok) { setList([res.data.data, ...list]); setForm({ nombre:'', apellido:'', dni:'', edad:'', habitacion:'', cama:'' }) }
  }

  async function del(id){
    if (!confirm('Confirm delete')) return
    const token = localStorage.getItem('token')
    const base = import.meta.env.VITE_API_URL || 'http://localhost:4000/api'
    const res = await axios.delete(`${base}/pacientes/${id}`, { headers: { Authorization: `Bearer ${token}` } })
    if (res.data.ok) setList(list.filter((p)=>String(p.id)!==String(id)))
  }

  return (
    <div className="container mt-4">
      <h4>Pacientes</h4>
      <div className="card p-3 mb-3">
        <h5>Crear paciente</h5>
        <div className="row">
          <div className="col"><input className="form-control" placeholder="Nombre" value={form.nombre} onChange={e=>setForm({...form,nombre:e.target.value})}/></div>
          <div className="col"><input className="form-control" placeholder="Apellido" value={form.apellido} onChange={e=>setForm({...form,apellido:e.target.value})}/></div>
          <div className="col"><input className="form-control" placeholder="DNI" value={form.dni} onChange={e=>setForm({...form,dni:e.target.value})}/></div>
          <div className="col"><button className="btn btn-primary" onClick={create}>Crear</button></div>
        </div>
      </div>

      <table className="table">
        <thead><tr><th>ID</th><th>Nombre</th><th>Habitación</th><th>Cama</th><th></th></tr></thead>
        <tbody>
          {list.map(p=> <tr key={p.id}><td>{p.id}</td><td>{p.nombre} {p.apellido}</td><td>{p.habitacion}</td><td>{p.cama}</td><td><button className="btn btn-sm btn-danger" onClick={()=>del(p.id)}>Borrar</button></td></tr>)}
        </tbody>
      </table>
    </div>
  )
}
