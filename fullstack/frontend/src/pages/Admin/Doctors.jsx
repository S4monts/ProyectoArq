import React, { useEffect, useState } from 'react'
import AppHeader from '../../components/AppHeader'
import axios from 'axios'

export default function Doctors(){
  const [list, setList] = useState([])
  const [form, setForm] = useState({ nombre:'', apellido:'', email:'', telefono:'' })

  useEffect(()=>{ fetchList() }, [])
  async function fetchList(){
    const token = localStorage.getItem('token')
    const base = import.meta.env.VITE_API_URL || 'http://localhost:4000/api'
    const res = await axios.get(`${base}/doctores`, { headers: { Authorization: `Bearer ${token}` } })
    if (res.data.ok) setList(res.data.data)
  }

  async function create(){
    const token = localStorage.getItem('token')
    const base = import.meta.env.VITE_API_URL || 'http://localhost:4000/api'
    const res = await axios.post(`${base}/doctores`, form, { headers: { Authorization: `Bearer ${token}` } })
    if (res.data.ok) { setList([res.data.data, ...list]); setForm({ nombre:'', apellido:'', email:'', telefono:'' }) }
  }

  return (
    <>
      <AppHeader showUser={true} />
      <div className="container mt-4">
      <h4>Doctores</h4>
      <div className="card p-3 mb-3">
        <div className="row">
          <div className="col"><input className="form-control" placeholder="Nombre" value={form.nombre} onChange={e=>setForm({...form,nombre:e.target.value})}/></div>
          <div className="col"><input className="form-control" placeholder="Apellido" value={form.apellido} onChange={e=>setForm({...form,apellido:e.target.value})}/></div>
          <div className="col"><input className="form-control" placeholder="Email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})}/></div>
          <div className="col"><button className="btn btn-primary" onClick={create}>Crear</button></div>
        </div>
      </div>
      <table className="table"><thead><tr><th>ID</th><th>Nombre</th><th>Asignados</th></tr></thead><tbody>{list.map(d=> <tr key={d.id}><td>{d.id}</td><td>{d.nombre} {d.apellido}</td><td>{d.cantidadPacientesAsignados || 0}</td></tr>)}</tbody></table>
      </div>
    </>
  )
}
