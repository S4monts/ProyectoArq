import React, { useEffect, useState } from 'react'
import AppHeader from '../../components/AppHeader'
import axios from 'axios'

export default function Patients(){
  const [list, setList] = useState([])
  const [view, setView] = useState('main') // 'main' or 'espera'
  const [esperaList, setEsperaList] = useState([])
  const isSenior = localStorage.getItem('isSenior') === 'true' || localStorage.getItem('role') === 'senior';

  useEffect(()=>{ fetchList() }, [])
  async function fetchList(){
    try{
      const token = localStorage.getItem('token')
      const base = import.meta.env.VITE_API_URL || 'http://localhost:4000/api'
      const res = await axios.get(`${base}/pacientes`, { headers: { Authorization: `Bearer ${token}` } })
      if (res.data.ok) setList(res.data.data)
    }catch(err){ console.error('fetchList error', err.response?.data || err.message) }
  }


  async function del(id){
    if (!confirm('Confirm delete')) return
    try{
      const token = localStorage.getItem('token')
      const base = import.meta.env.VITE_API_URL || 'http://localhost:4000/api'
      const res = await axios.delete(`${base}/pacientes/${id}`, { headers: { Authorization: `Bearer ${token}` } })
      if (res.data.ok) setList(list.filter((p)=>String(p.id)!==String(id)))
    }catch(err){ console.error('delete paciente error', err.response?.data || err.message); alert('Error eliminando paciente') }
  }

  async function fetchEspera(){
    try{
      const token = localStorage.getItem('token')
      const base = import.meta.env.VITE_API_URL || 'http://localhost:4000/api'
      const res = await axios.get(`${base}/pacientes/espera`, { headers: { Authorization: `Bearer ${token}` } })
      if (res.data.ok) setEsperaList(res.data.data)
    }catch(err){ console.error('fetchEspera error', err.response?.data || err.message) }
  }

  async function delEspera(id){
    if (!confirm('Confirm delete from waiting list')) return
    try{
      const token = localStorage.getItem('token')
      const base = import.meta.env.VITE_API_URL || 'http://localhost:4000/api'
      const res = await axios.delete(`${base}/pacientes/espera/${id}`, { headers: { Authorization: `Bearer ${token}` } })
      if (res.data.ok) setEsperaList(esperaList.filter(p=>String(p.id)!==String(id)))
    }catch(err){ console.error('delEspera error', err.response?.data || err.message); alert('Error eliminando de espera') }
  }

  async function acceptEspera(id){
    if (!confirm('Aceptar paciente desde la lista de espera?')) return
    try{
      const token = localStorage.getItem('token')
      const base = import.meta.env.VITE_API_URL || 'http://localhost:4000/api'
      const res = await axios.post(`${base}/pacientes/espera/${id}/accept`, {}, { headers: { Authorization: `Bearer ${token}` } })
      if (res.data.ok) {
        await fetchList()
        await fetchEspera()
      }
    }catch(err){ console.error('acceptEspera error', err.response?.data || err.message); alert('Error aceptando paciente') }
  }

  return (
    <>
      <AppHeader showUser={true} />
      <div className="container mt-4">
      <h4>Pacientes</h4>
      {/* Creación de pacientes eliminada: administradores no pueden crear pacientes desde aquí */}

      <div className="mb-2">
        <button className={`btn btn-sm me-2 ${view==='main' ? 'btn-primary' : 'btn-outline-primary'}`} onClick={()=>{ setView('main'); fetchList() }}>Panel Principal</button>
        <button className={`btn btn-sm ${view==='espera' ? 'btn-primary' : 'btn-outline-primary'}`} onClick={()=>{ setView('espera'); fetchEspera() }}>Lista de Pacientes en espera</button>
      </div>

      {view === 'main' ? (
        <table className="table">
          <thead><tr><th>ID</th><th>Nombre</th><th>Habitación</th><th>Cama</th><th></th></tr></thead>
          <tbody>
            {list.map(p=> <tr key={p.id}><td>{p.id}</td><td>{p.nombre} {p.apellido}</td><td>{p.habitacion}</td><td>{p.cama}</td><td><button className="btn btn-sm btn-danger" onClick={()=>del(p.id)}>Borrar</button></td></tr>)}
          </tbody>
        </table>
      ) : (
        <table className="table">
          <thead><tr><th>ID</th><th>Nombre</th><th>Creado por</th><th>Habitación</th><th>Cama</th><th></th><th></th></tr></thead>
          <tbody>
            {esperaList.map(p=> (
              <tr key={p.id}>
                <td>{p.id}</td>
                <td>{p.nombre} {p.apellido}</td>
                <td>{p.createdByName || p.createdBy}</td>
                <td>{p.habitacion}</td>
                <td>{p.cama}</td>
                <td><button className="btn btn-sm btn-danger" onClick={()=>delEspera(p.id)}>X</button></td>
                <td><button className="btn btn-sm btn-success" onClick={()=>acceptEspera(p.id)}>✓</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      </div>
    </>
  )
}
