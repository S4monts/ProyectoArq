import api from './api'

export function listHistorias(pacienteId){ return api.get('/historias', { params: { pacienteId } }).then(r=>r.data) }
export function addEvolucion(pacienteId, payload){ return api.post(`/historias/${pacienteId}/evoluciones`, payload).then(r=>r.data) }
