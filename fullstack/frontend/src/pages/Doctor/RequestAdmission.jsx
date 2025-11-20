import React, { useState } from 'react'
import AppHeader from '../../components/AppHeader'
import axios from 'axios'

export default function RequestAdmission(){
  const [form, setForm] = useState({ cama: '', habitacion: '', nombre: '', apellido: '', edad:'', diagnosticoBreve:'', indicacion:false, indicacionDetalle:'' })
  const [msg, setMsg] = useState(null)

  async function submit(e){
    e.preventDefault()
    if (!form.cama && form.urgencia === true) return setMsg('cama es obligatorio para urgencia')
    if (!form.diagnosticoBreve && !form.nombre) return setMsg('diagnosticoBreve o nombre requerido')
    try{
      const token = localStorage.getItem('token')
      const base = import.meta.env.VITE_API_URL || 'http://localhost:4000/api'
      const res = await axios.post(`${base}/ingresos`, { ...form, createdByDoctorId: localStorage.getItem('userId') || localStorage.getItem('name') }, { headers: { Authorization: `Bearer ${token}` } })
      if (res.data.ok) setMsg('Solicitud creada')
      else setMsg(res.data.msg)
    }catch(err){ setMsg(err.response?.data?.msg || err.message) }
  }

  return (
    <>
      <AppHeader showUser={true} />
      <div className="container mt-4">
      <h4>Solicitar Ingreso</h4>
      {msg && <div className="alert alert-info">{msg}</div>}
      <form onSubmit={submit}>
        <div className="mb-2"><label className="form-label">Cama (obligatorio)</label><input className="form-control" value={form.cama} onChange={e=>setForm({...form,cama:e.target.value})} required/></div>
        <div className="mb-2"><label className="form-label">Habitación</label><input className="form-control" value={form.habitacion} onChange={e=>setForm({...form,habitacion:e.target.value})}/></div>
        <div className="mb-2"><label className="form-label">Nombre</label><input className="form-control" value={form.nombre} onChange={e=>setForm({...form,nombre:e.target.value})}/></div>
        <div className="mb-2"><label className="form-label">Apellido</label><input className="form-control" value={form.apellido} onChange={e=>setForm({...form,apellido:e.target.value})}/></div>
        <div className="mb-2"><label className="form-label">Edad</label><input type="number" className="form-control" value={form.edad} onChange={e=>setForm({...form,edad:e.target.value})}/></div>
        <div className="mb-2"><label className="form-label">Diagnóstico Breve</label><input className="form-control" value={form.diagnosticoBreve} onChange={e=>setForm({...form,diagnosticoBreve:e.target.value})} required/></div>
        <div className="form-check mb-2"><input type="checkbox" className="form-check-input" checked={form.indicacion} onChange={e=>setForm({...form,indicacion:e.target.checked})}/><label className="form-check-label">Indicacion</label></div>
        {form.indicacion && <div className="mb-2"><label className="form-label">Detalle indicación</label><input className="form-control" value={form.indicacionDetalle} onChange={e=>setForm({...form,indicacionDetalle:e.target.value})} required/></div>}
        <button className="btn btn-primary">Enviar</button>
      </form>
      </div>
    </>
  )
}
