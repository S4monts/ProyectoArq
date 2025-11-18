import api from './api'

export function createEncuentro(payload){
  return api.post('/encuentros', payload).then(r=>r.data)
}

export function listEncuentros(params){
  return api.get('/encuentros', { params }).then(r=>r.data)
}
