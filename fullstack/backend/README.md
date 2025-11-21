git status
git add -A
git commit -m "feat(migration): add normalized tables + tests; prefer *_norm in repos"
git checkout -b feature/sqlite-normalized-migration
git push -u origin feature/sqlite-normalized-migration
# Medicor — Backend (Guía de migración y pruebas)

Este repositorio contiene la parte backend de Medicor (Node.js + Express) y usa SQLite como almacenamiento.

En este README encontrarás instrucciones para:
- Instalar y ejecutar el servidor en desarrollo.
- Ejecutar las migraciones que crean tablas normalizadas y migran los datos desde las tablas legacy (JSON).
- Ejecutar las pruebas de integración (Mocha + Supertest).
- Preparar un commit y un PR.

Requisitos
- Node.js >= 14
- npm

Arranque rápido (desarrollo)

1) Instalar dependencias

```powershell
cd .\fullstack\backend
npm install
```

2) Levantar el servidor en modo desarrollo

```powershell
npm run dev
# o
npm start
```

Base de datos y migraciones

La base de datos SQLite usada por la aplicación es `src/data/medicor.db`.

Hemos añadido dos scripts de migración en `src/migrations`:

- `normalize-1-create-normalized-tables.js` — crea las tablas normalizadas (`*_norm`).
- `normalize-2-migrate-data.js` — copia los datos desde las tablas legacy (que contienen una columna `json`) hacia las tablas normalizadas.

Para ejecutar las migraciones:

```powershell
cd .\fullstack\backend
npm run migrate:create
npm run migrate:run
```

Notas:
- Las migraciones no eliminan los datos originales: si ejecutaste previamente la importación desde JSON se guardaron backups en `src/data_backup/`.
- Tras migrar, los repositorios del proyecto intentan leer desde las tablas `*_norm` y hacen fallback a las tablas legacy para compatibilidad.

Pruebas (unitarias / integración)

Se usa Mocha + Supertest + Chai para tests de integración. Para ejecutar las pruebas:

```powershell
cd .\fullstack\backend
npm test
```

Notas sobre las pruebas:
- Las pruebas requieren que `src/index.js` exporte la app de Express (ya está preparado).
- Algunas pruebas generan DNIs únicos para evitar colisiones entre ejecuciones.

Control de versiones y PR

Flujo recomendado para enviar los cambios a GitHub (desde el directorio `fullstack/backend` o la raíz del repo):

```powershell
cd .\fullstack\backend
git checkout -b feature/sqlite-normalized-migration
git add -A
git commit -m "feat(migration): tablas normalizadas, migraciones y tests"
git push -u origin feature/sqlite-normalized-migration
```

Abre un Pull Request en GitHub desde la rama `feature/sqlite-normalized-migration` hacia la rama principal. En la descripción del PR incluye:
- Resumen de los cambios (migraciones, repositorios adaptados para `*_norm`, tests añadidos).
- Cómo ejecutar las migraciones y las pruebas (copiar los comandos clave de este README).

Integración continua (sugerencia)

Puedes añadir un workflow de GitHub Actions que haga:
- `npm ci`
- `npm run migrate:create` y `npm run migrate:run` (opcional si no quieres migrar en CI)
- `npm test`

Ejemplo rápido de `.github/workflows/nodejs.yml` (opcional):

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

Depuración y operaciones comunes

- Inspeccionar la base de datos SQLite:

```powershell
# Requiere sqlite3 o una GUI; desde PowerShell con sqlite3 instalado:
sqlite3 .\fullstack\backend\src\data\medicor.db
```

- Comprobar tablas normalizadas:

```sql
SELECT name FROM sqlite_master WHERE type='table' ORDER BY name;
SELECT COUNT(*) FROM users_norm;
SELECT COUNT(*) FROM pacientes_norm;
```

Preguntas frecuentes / recomendaciones

- ¿Actualizo el README aquí o lo hago en mi repositorio local?
	- Puedes hacerlo en cualquiera de los dos sitios. Si deseas que todo quede versionado y revisionable, lo mejor es editar el archivo en el repositorio y hacer commit/push desde tu máquina (o dejar que yo prepare la rama y los commits y tú los empujes).
- ¿Quieres que lo suba yo y cree la rama y el commit?
	- Puedo preparar los cambios y mostrarte los comandos `git` para ejecutar. Para hacer el `push` necesito tus credenciales locales.

Contacto

Si quieres, puedo también:
- Añadir el archivo de workflow de GitHub Actions.
- Actualizar el README principal en la raíz del proyecto.
- Preparar un changelog y un template de PR.

Dime si quieres que empuje estos cambios a una rama (yo prepararé el commit y te daré los comandos) o si prefieres hacerlo tú mismo desde tu equipo.
