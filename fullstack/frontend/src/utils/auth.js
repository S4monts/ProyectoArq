export function getToken() {
  const token = localStorage.getItem('token')
  return token && token.split('.').length === 2 ? token : null
}

export function authHeaders() {
  const token = getToken()
  return token ? { Authorization: `Bearer ${token}` } : {}
}

export function storeSession(data) {
  if (!data || !/^[^.]+\.[^.]+$/.test(data.token) || !['admin', 'doctor'].includes(data.role)) {
    throw new Error('Respuesta de autenticación inválida')
  }
  if (!/^[\w-]+$/.test(String(data.userId))) throw new Error('Identificador de usuario inválido')
  localStorage.setItem('token', data.token)
  localStorage.setItem('role', data.role)
  localStorage.setItem('name', String(data.name || '').slice(0, 200))
  localStorage.setItem('userId', String(data.userId))
}

export function safeId(value) {
  const id = String(value || '').trim()
  return /^[A-Za-z0-9_-]+$/.test(id) ? id : null
}
