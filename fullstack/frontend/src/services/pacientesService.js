import api from './api'

export function listPacientes(){ return api.get('/pacientes').then(r=>r.data) }
export function createPaciente(p){ return api.post('/pacientes', p).then(r=>r.data) }
export function deletePaciente(id){ return api.delete(`/pacientes/${id}`).then(r=>r.data) }
