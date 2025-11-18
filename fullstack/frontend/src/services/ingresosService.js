import api from './api'

export function createIngreso(payload){
  return api.post('/ingresos', payload).then(r=>r.data)
}

export function listIngresos(status){
  return api.get('/ingresos', { params: { status } }).then(r=>r.data)
}
