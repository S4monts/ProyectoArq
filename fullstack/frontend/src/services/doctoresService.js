import api from './api'

export function listDoctores(){ return api.get('/doctores').then(r=>r.data) }
export function createDoctor(p){ return api.post('/doctores', p).then(r=>r.data) }
