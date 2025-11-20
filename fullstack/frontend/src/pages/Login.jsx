import React, { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import AppHeader from '../components/AppHeader'

export default function Login() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('doctor')
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  async function submit(e) {
    e.preventDefault()
    if (!username || !password) return setError('complete los campos')
    try {
      const base = import.meta.env.VITE_API_URL || 'http://localhost:4000/api'
      const res = await axios.post(`${base}/auth/login`, { username, password, role })
      if (res.data.ok) {
        const { token, role: r, name, userId } = res.data.data
        localStorage.setItem('token', token)
        localStorage.setItem('role', r)
        localStorage.setItem('name', name)
        localStorage.setItem('userId', userId)
        navigate(r === 'admin' ? '/admin' : '/doctor')
      } else {
        setError(res.data.msg)
      }
    } catch (err) {
      setError(err.response?.data?.msg || err.message)
    }
  }

  return (
    <>
      <AppHeader showUser={false} />
      <div className="d-flex justify-content-center align-items-center" style={{minHeight:'100vh',backgroundImage:'url(./src/assets/hospi.jpg)',backgroundSize:'cover',backgroundPosition:'center'}}>
        <div className="card p-4 text-center" style={{maxWidth:'380px', width:'100%',background:'rgba(255,255,255,0.92)'}}>
            <h3 className="mb-3">Iniciar sesión</h3>
            {error && <div className="alert alert-danger text-center">{error}</div>}
            <form onSubmit={submit}>
              <div className="mb-2 text-center">
                <label className="form-label d-block">Usuario</label>
                <input className="form-control text-center mx-auto" value={username} onChange={(e)=>setUsername(e.target.value)} />
              </div>
              <div className="mb-2 text-center">
                <label className="form-label d-block">Contraseña</label>
                <input type="password" className="form-control text-center mx-auto" value={password} onChange={(e)=>setPassword(e.target.value)} />
              </div>
              <div className="mb-3 text-center">
                <label className="form-label d-block">Rol</label>
                <div className="d-flex justify-content-center gap-2">
                  <button type="button" className={`btn ${role === 'doctor' ? 'btn-primary' : 'btn-outline-primary'}`} onClick={() => setRole('doctor')}>Doctor</button>
                  <button type="button" className={`btn ${role === 'admin' ? 'btn-primary' : 'btn-outline-primary'}`} onClick={() => setRole('admin')}>Admin</button>
                </div>
                <input type="hidden" name="role" value={role} />
              </div>
              <div className="d-flex justify-content-center">
                <button className="btn btn-primary">Ingresar</button>
              </div>
            </form>
          </div>
        </div>
    </>
  )
}
