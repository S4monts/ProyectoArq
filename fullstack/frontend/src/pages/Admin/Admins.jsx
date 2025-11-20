import React, { useEffect, useState } from 'react'
import AppHeader from '../../components/AppHeader'
import axios from 'axios'

export default function Admins(){
  const [list, setList] = useState([])
  const [form, setForm] = useState({ username:'', password:'', name:'', isSenior:false })
  const [showPass, setShowPass] = useState(false)
  const isSenior = localStorage.getItem('isSenior') === 'true' || localStorage.getItem('role') === 'senior';
  const currentUserId = Number(localStorage.getItem('userId'))
  useEffect(()=>{ fetchList() }, [])
  async function fetchList(){
    try {
      const token = localStorage.getItem('token')
      const base = import.meta.env.VITE_API_URL || 'http://localhost:4000/api'
      const res = await axios.get(`${base}/admins`, { headers: { Authorization: `Bearer ${token}` } })
      if (res.data.ok) setList(res.data.data)
      // Guardar si el usuario es senior para mostrar el botón
      const me = res.data.data.find(a => a.id === Number(localStorage.getItem('userId')))
      if (me && me.isSenior) localStorage.setItem('isSenior', 'true')
      else localStorage.setItem('isSenior', 'false')
    } catch (err) {
      console.error('fetchList error', err.response ? err.response.data : err.message)
      if (err.response && err.response.status === 403) {
        alert('No tienes permiso para ver administradores (403). Asegúrate de haber iniciado sesión como admin senior.')
        localStorage.setItem('isSenior','false')
      } else {
        alert('Error cargando administradores. Revisa la consola.')
      }
    }
  }
  async function create(){
    try {
      const token = localStorage.getItem('token')
      const base = import.meta.env.VITE_API_URL || 'http://localhost:4000/api'
      const res = await axios.post(`${base}/admins`, form, { headers: { Authorization: `Bearer ${token}` } })
      if (res.data.ok) {
        // refresh list to ensure persistence
        await fetchList()
        setForm({ username:'', password:'', name:'', isSenior:false })
      } else {
        console.warn('create admin failed', res.data)
        alert('No se pudo crear el admin: ' + (res.data.msg || 'error'))
      }
    } catch (err) {
      console.error('create admin error', err.response ? err.response.data : err.message)
      alert('Error creando administrador. Revisa la consola del navegador.')
    }
  }
  async function removeAdmin(id){
    if (!confirm('¿Eliminar este administrador?')) return
    try {
      const token = localStorage.getItem('token')
      const base = import.meta.env.VITE_API_URL || 'http://localhost:4000/api'
      const res = await axios.delete(`${base}/admins/${id}`, { headers: { Authorization: `Bearer ${token}` } })
      if (res.data && res.data.ok) {
        await fetchList()
      } else {
        alert('No se pudo eliminar: ' + (res.data && res.data.msg ? res.data.msg : 'error'))
      }
    } catch (err) {
      console.error('delete admin error', err.response ? err.response.data : err.message)
      alert('Error eliminando administrador. Revisa la consola.')
    }
  }

  return (
    <>
      <AppHeader showUser={true} />
      <div className="container mt-4">
      <h4>Administradores</h4>
      <div className="card p-3 mb-3">
        <div className="row g-2">
          <div className="col"><input className="form-control" placeholder="username" value={form.username} onChange={e=>setForm({...form,username:e.target.value})}/></div>
          <div className="col"><input className="form-control" placeholder="name" value={form.name} onChange={e=>setForm({...form,name:e.target.value})}/></div>
          <div className="col"><input type="password" className="form-control" placeholder="password" value={form.password} onChange={e=>setForm({...form,password:e.target.value})}/></div>
          <div className="col d-flex align-items-center">
            <label className="form-check-label me-2">Senior</label>
            <input type="checkbox" className="form-check-input" checked={form.isSenior} onChange={e=>setForm({...form,isSenior:e.target.checked})}/>
          </div>
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
            <th>Usuario</th>
            <th>Nombre</th>
            <th>isSenior</th>
            <th>Contraseña</th>
            {isSenior && <th>Acciones</th>}
          </tr>
        </thead>
        <tbody>
          {list
            .filter(a => Number(a.id) !== currentUserId) // hide current user's own row
            .map(a => (
              <tr key={a.id}>
                <td>{a.id}</td>
                <td>{a.username}</td>
                <td>{a.name}</td>
                <td>{String(!!a.isSenior)}</td>
                <td>{showPass ? a.password : '*'.repeat(a.password.length)}</td>
                {isSenior && (
                  <td>
                    <button className="btn btn-sm btn-danger" onClick={()=>removeAdmin(a.id)}>Borrar</button>
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
