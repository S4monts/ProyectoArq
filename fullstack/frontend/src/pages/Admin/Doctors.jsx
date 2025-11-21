import React, { useEffect, useState } from 'react'
import AppHeader from '../../components/AppHeader'
import axios from 'axios'

// similar senior check used in Admins
const isSeniorLocal = () => localStorage.getItem('isSenior') === 'true' || localStorage.getItem('role') === 'senior'

export default function Doctors(){
  const [list, setList] = useState([])
  const [form, setForm] = useState({ nombre:'', apellido:'', email:'', telefono:'', username:'', password:'' })
  const [showPass, setShowPass] = useState(false)
  const isSenior = isSeniorLocal()
  const currentUserId = Number(localStorage.getItem('userId'))

  useEffect(()=>{ fetchList() }, [])
  async function fetchList(){
    try {
      const token = localStorage.getItem('token')
      const base = import.meta.env.VITE_API_URL || 'http://localhost:4000/api'
      const res = await axios.get(`${base}/doctores`, { headers: { Authorization: `Bearer ${token}` } })
      if (res.data.ok) setList(res.data.data)
    } catch (err) {
      console.error('fetchList doctors error', err.response ? err.response.data : err.message)
      alert('Error cargando doctores. Revisa la consola.')
    }
  }

  async function create(){
    try {
      const token = localStorage.getItem('token')
      const base = import.meta.env.VITE_API_URL || 'http://localhost:4000/api'
      const res = await axios.post(`${base}/doctores`, form, { headers: { Authorization: `Bearer ${token}` } })
      if (res.data.ok) {
        await fetchList()
        setForm({ nombre:'', apellido:'', email:'', telefono:'', username:'', password:'' })
      } else {
        alert('No se pudo crear doctor: ' + (res.data.msg || 'error'))
      }
    } catch (err) {
      console.error('create doctor error', err.response ? err.response.data : err.message)
      alert('Error creando doctor. Revisa la consola.')
    }
  }

  async function removeDoctor(id){
    if (!confirm('¿Eliminar este doctor?')) return
    try {
      const token = localStorage.getItem('token')
      const base = import.meta.env.VITE_API_URL || 'http://localhost:4000/api'
      const res = await axios.delete(`${base}/doctores/${id}`, { headers: { Authorization: `Bearer ${token}` } })
      if (res.data && res.data.ok) await fetchList()
      else alert('No se pudo eliminar: ' + (res.data && res.data.msg ? res.data.msg : 'error'))
    } catch (err) {
      console.error('delete doctor error', err.response ? err.response.data : err.message)
      alert('Error eliminando doctor. Revisa la consola.')
    }
  }

  return (
    <>
      <AppHeader showUser={true} />
      <div className="container mt-4">
      <h4>Doctores</h4>
      <div className="card p-3 mb-3">
        <div className="row g-2">
          <div className="col"><input className="form-control" placeholder="Nombre" value={form.nombre} onChange={e=>setForm({...form,nombre:e.target.value})}/></div>
          <div className="col"><input className="form-control" placeholder="Apellido" value={form.apellido} onChange={e=>setForm({...form,apellido:e.target.value})}/></div>
          <div className="col"><input className="form-control" placeholder="Email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})}/></div>
          <div className="col"><input className="form-control" placeholder="Username (opcional)" value={form.username} onChange={e=>setForm({...form,username:e.target.value})}/></div>
          <div className="col"><input className="form-control" placeholder="Password (opcional)" value={form.password} onChange={e=>setForm({...form,password:e.target.value})}/></div>
          <div className="col"><button className="btn btn-primary" onClick={create}>Crear</button></div>
        </div>
      </div>

      <div className="mb-2">
        {isSenior && (
          <button className="btn btn-outline-secondary btn-sm" onClick={()=>setShowPass(v=>!v)}>
            {showPass ? 'Ocultar contraseñas' : 'Revelar contraseñas'}
          </button>
        )}
      </div>

      <table className="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Asignados</th>
            <th>Username</th>
            <th>Contraseña</th>
            {isSenior && <th>Acciones</th>}
          </tr>
        </thead>
        <tbody>
          {list.map(d=> (
            <tr key={d.id}>
              <td>{d.id}</td>
              <td>{d.nombre} {d.apellido}</td>
              <td>{d.cantidadPacientesAsignados || 0}</td>
              <td>{d.username || '-'}</td>
              <td>{showPass ? (d.password || '-') : (d.password ? '*'.repeat(d.password.length) : '-')}</td>
              {isSenior && (
                <td>
                  <button className="btn btn-sm btn-danger" onClick={()=>removeDoctor(d.id)}>Borrar</button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
      </div>
    </>
  )
}
