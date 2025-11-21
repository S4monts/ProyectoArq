# ProyectoArq
Desarrollo de una Aplicación Web para un sistema simple de hospital - Medicor.

# Medicor (fullstack)

Run backend:

```powershell
﻿# ProyectoArq — Medicor

Proyecto para desarrollar una aplicación web fullstack llamada "Medicor", un sistema de gestión simple para un hospital. Este repositorio contiene dos partes principales:

- `fullstack/backend`: API en Node.js + Express y persistencia (SQLite/JSON durante la migración).
- `fullstack/frontend`: aplicación cliente con React + Vite.

En este README encontrarás instrucciones completas para ejecutar el proyecto, migraciones, pruebas y ejemplos de uso.

Contenido
- Descripción rápida
- Estructura del proyecto
- Requisitos
- Ejecutar localmente (backend y frontend)
- Migraciones y normalización de la base de datos
- Pruebas
- Ejemplos de API
- Flujo de trabajo (commits / PR)
- CI sugerido
- Preguntas frecuentes

Descripción rápida
Medicor es una app demo para gestionar pacientes, doctores, ingresos y encuentros. La API responde con objetos del formato `{ ok: true, data }` o `{ ok: false, msg }`.

Estructura del proyecto (resumen)

- `fullstack/backend`
	- `src/` — código fuente del backend (controllers, repositories, routes, utils)
	- `src/data/` — datos persistidos (JSON y archivo SQLite `medicor.db`)
	- `src/migrations/` — scripts de creación y migración de tablas normalizadas
	- `test/` — pruebas de integración con Mocha + Supertest
- `fullstack/frontend`
	- `src/` — código React + componentes
	- `public/` — assets estáticos

Requisitos

- Node.js (recomendado >= 14)
- npm
- Opcional: `sqlite3` si quieres inspeccionar la DB desde la terminal

Instalación y ejecución local

1) Backend

```powershell
cd fullstack\backend
npm install
# Desarrollo
npm run dev
# Producción (ejecuta la app)
npm install
```

El backend expone la API en `http://localhost:4000/api` por defecto.

2) Frontend

```powershell
cd fullstack\frontend
npm install
npm run dev
```

El frontend corre en Vite (por defecto `http://localhost:5173`). Ajusta las URLs si tu backend no está en `:4000`.

Migraciones y normalización de datos

El proyecto incluye utilidades para migrar la persistencia legacy (tablas con columna `json`) a tablas normalizadas (`*_norm`) en SQLite.

Scripts:

- `src/migrations/normalize-1-create-normalized-tables.js`: crea las tablas normalizadas.
- `src/migrations/normalize-2-migrate-data.js`: copia los datos desde las tablas legacy hacia las normalizadas.

Para ejecutar:

```powershell
cd fullstack\backend
npm run migrate:create
npm run migrate:run
```

Los archivos JSON originales no se sobrescriben; se recomienda revisar `src/data_backup/` si existen backups.

Tests

Hay pruebas de integración con Mocha + Supertest.

```powershell
cd fullstack\backend
npm test
```

Notas sobre tests:
- La app de Express está exportada desde `src/index.js` para permitir pruebas sin levantar un servidor en otro proceso.
- Algunas pruebas generan identificadores/DNI únicos para evitar colisiones entre ejecuciones.

Ejemplos de API (endpoints básicos)

Base URL: `http://localhost:4000/api`

- Login (demo admin)

	POST /api/auth/login
	Body JSON:
	```json
	{ "username": "admin", "password": "admin", "role": "admin" }
	```
	Response:
	```json
	{ "ok": true, "data": { "token": "demo-1", "role": "admin", "userId": "1", "name": "Admin Demo" } }
	```

- Crear ingreso (doctor)

	POST /api/ingresos
	Body JSON ejemplo:
	```json
	{ "cama": "A1", "diagnosticoBreve": "Síncope", "indicacion": false, "createdByDoctorId": "D-1" }
	```

- Agendar encuentro

	POST /api/encuentros
	Body JSON ejemplo:
	```json
	{ "pacienteId": 1, "doctorId": "D-1", "fecha": "2025-11-20", "hora": "14:00", "motivo": "Consulta" }
	```

Formato de respuesta

Todas las respuestas estándar usan:

```json
{ "ok": true, "data": ... }
```
o en caso de error:

```json
{ "ok": false, "msg": "mensaje" }
```

Persistencia

- Durante el desarrollo encontrarás dos modelos de persistencia:
	- Tablas legacy con `id` y `json` (se migraron desde archivos `.json`).
	- Tablas normalizadas `*_norm` (más adelante los repositorios y controladores manejarán campos tipados).

El código está preparado para preferir las tablas `*_norm` cuando existan y hacer fallback a las tablas legacy para compatibilidad.

Flujo de trabajo (commits / PR)

Recomendación básica:

```powershell
git checkout -b feature/mi-cambio
git add -A
git commit -m "feat: descripción corta"
git push -u origin feature/mi-cambio
```

Abrir un Pull Request con la descripción de los cambios, cómo probar y cualquier requisito de migración.

Integración continua (sugerencia)

Ejemplo mínimo para GitHub Actions (`.github/workflows/nodejs.yml`):

```yaml
name: Node.js CI
on: [push, pull_request]
jobs:
	test:
		runs-on: ubuntu-latest
		steps:
			- uses: actions/checkout@v4
			- uses: actions/setup-node@v4
				with:
					node-version: '18'
			- run: npm ci
				working-directory: ./fullstack/backend
			- run: npm run migrate:create
				working-directory: ./fullstack/backend
			- run: npm run migrate:run
				working-directory: ./fullstack/backend
			- run: npm test
				working-directory: ./fullstack/backend
```

Preguntas frecuentes / recomendaciones

- ¿Dónde están los datos?
	- `fullstack/backend/src/data/` contiene los archivos JSON y el archivo SQLite `medicor.db`.

- ¿Puedo borrar los JSON después de migrar?
	- Guarda siempre un backup. El repo incluye `src/data_backup/` cuando se ejecutó la importación previa.

- ¿Cómo inspecciono SQLite?
	- Usa una herramienta GUI (DB Browser for SQLite) o el cliente `sqlite3` en terminal:
		```powershell
		sqlite3 .\fullstack\backend\src\data\medicor.db
		```

¿Quieres que haga más cambios?

- Puedo crear la rama y el commit con este README por ti y darte los comandos para pushear.
- Puedo añadir el workflow de GitHub Actions en el repo.

---

Si quieres que lo suba y cree una rama ahora, dime y preparo los comandos `git` listos para ejecutar en tu máquina.

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
