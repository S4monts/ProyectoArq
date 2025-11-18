import React, { useEffect, useState } from 'react'
import axios from 'axios'

export default function Admins(){
  const [list, setList] = useState([])
  const [form, setForm] = useState({ username:'', password:'', name:'', isSenior:false })
  useEffect(()=>{ fetchList() }, [])
  async function fetchList(){
    const token = localStorage.getItem('token')
    const base = import.meta.env.VITE_API_URL || 'http://localhost:4000/api'
    const res = await axios.get(`${base}/admins`, { headers: { Authorization: `Bearer ${token}` } })
    if (res.data.ok) setList(res.data.data)
  }
  async function create(){
    const token = localStorage.getItem('token')
    const base = import.meta.env.VITE_API_URL || 'http://localhost:4000/api'
    const res = await axios.post(`${base}/admins`, form, { headers: { Authorization: `Bearer ${token}` } })
    if (res.data.ok) setList([res.data.data, ...list])
  }
  return (
    <div className="container mt-4">
      <h4>Administradores</h4>
      <div className="card p-3 mb-3">
        <div className="row g-2">
          <div className="col"><input className="form-control" placeholder="username" value={form.username} onChange={e=>setForm({...form,username:e.target.value})}/></div>
          <div className="col"><input className="form-control" placeholder="name" value={form.name} onChange={e=>setForm({...form,name:e.target.value})}/></div>
          <div className="col"><input type="password" className="form-control" placeholder="password" value={form.password} onChange={e=>setForm({...form,password:e.target.value})}/></div>
          <div className="col"><button className="btn btn-primary" onClick={create}>Crear</button></div>
        </div>
      </div>
      <table className="table"><thead><tr><th>ID</th><th>Usuario</th><th>Nombre</th><th>isSenior</th></tr></thead><tbody>{list.map(a=> <tr key={a.id}><td>{a.id}</td><td>{a.username}</td><td>{a.name}</td><td>{String(!!a.isSenior)}</td></tr>)}</tbody></table>
    </div>
  )
}
