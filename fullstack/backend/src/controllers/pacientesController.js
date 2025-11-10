// Controller refactorizado para usar el service (abstracto).
// Importa el service file-based por defecto.
const useDb = process.env.DATA_STORE === 'sqlite'; // si decides usar sqlite later
const service = useDb
  ? require('../services/pacientesService.sqlite') // (opcional, si implementas)
  : require('../services/pacientesService.file');

async function listar(req, res) {
  const list = await service.getAll();
  res.json({ ok: true, data: list });
}

async function obtener(req, res) {
  const id = Number(req.params.id);
  const item = await service.getById(id);
  if (!item) return res.status(404).json({ ok: false, msg: 'Paciente no encontrado' });
  res.json({ ok: true, data: item });
}

async function crear(req, res) {
  const { nombre, email, telefono } = req.body || {};
  if (!nombre) return res.status(400).json({ ok: false, msg: 'Nombre requerido' });

  const nuevo = await service.create({ nombre, email: email || '', telefono: telefono || '' });
  res.status(201).json({ ok: true, data: nuevo });
}

async function actualizar(req, res) {
  const id = Number(req.params.id);
  const { nombre, email, telefono } = req.body || {};
  const updated = await service.update(id, { nombre, email, telefono });
  if (!updated) return res.status(404).json({ ok: false, msg: 'Paciente no encontrado' });
  res.json({ ok: true, data: updated });
}

async function eliminar(req, res) {
  const id = Number(req.params.id);
  const ok = await service.remove(id);
  if (!ok) return res.status(404).json({ ok: false, msg: 'Paciente no encontrado' });
  res.status(204).send();
}

module.exports = {
  listar,
  obtener,
  crear,
  actualizar,
  eliminar
};