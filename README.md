# ProyectoArq — Medicor

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
