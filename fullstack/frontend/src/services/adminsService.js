import api from './api'

export function listAdmins(){ return api.get('/admins').then(r=>r.data) }
export function createAdmin(p){ return api.post('/admins', p).then(r=>r.data) }
