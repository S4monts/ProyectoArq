const storage = window.localStorage

export function getStored(key) {
  const value = storage.getItem(key)
  if (!value) return null
  try {
    return decodeURIComponent(value)
  } catch {
    storage.removeItem(key)
    return null
  }
}

function writeStored(key, value) {
  storage.setItem(key, encodeURIComponent(String(value)))
}

export function getToken() {
  const token = getStored('token')
  return token && /^[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+$/.test(token) ? token : null
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
  writeStored('token', data.token)
  writeStored('role', data.role)
  writeStored('name', String(data.name || '').slice(0, 200))
  writeStored('userId', String(data.userId))
}

export function safeId(value) {
  const id = String(value || '').trim()
  return /^[A-Za-z0-9_-]+$/.test(id) ? id : null
}
