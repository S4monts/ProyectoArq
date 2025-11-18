# Medicor (fullstack)

Run backend:

```powershell
cd fullstack\backend
npm install
npm run dev
```

Run frontend:

```powershell
cd fullstack\frontend
npm install
npm run dev
```

API examples (use `http://localhost:4000/api`):

- Login (admin demo):

```json
POST /api/auth/login
{ "username":"admin", "password":"admin", "role":"admin" }

Response: { ok:true, data: { token, role, userId, name } }
```

- Create ingreso (doctor):

```json
POST /api/ingresos
{ "cama":"A1", "diagnosticoBreve":"Síncope", "indicacion":false, "createdByDoctorId":"D-1" }
```

- Schedule encuentro:

```json
POST /api/encuentros
{ "pacienteId": 1, "doctorId": "D-1", "fecha":"2025-11-20", "hora":"14:00", "motivo":"Consulta" }
```

Notes:

- All responses use the format `{ ok: true, data }` or `{ ok: false, msg }`.
- Persistence is file-based under `backend/src/data/`. Do not overwrite existing JSON files.
- `backend/src/utils/fileStore.js` contains comments to ease migration to a real DB later.
