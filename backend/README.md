# Backend del sistema RSI

API REST del Sistema de Gestión Integrada para el RSI, construida con NestJS, TypeScript, Prisma y PostgreSQL.

## Preparación

Desde la raíz del proyecto, iniciá PostgreSQL:

```powershell
docker compose up -d postgres
```

Desde esta carpeta, instalá las dependencias y prepará Prisma:

```powershell
npm.cmd install
npx.cmd prisma generate
npx.cmd prisma migrate deploy
```

La variable `DATABASE_URL` debe estar definida en `backend/.env`.

## Ejecución

```powershell
npm.cmd run start:dev
```

La API utiliza el prefijo `/api/v1`.

## KPI

El resumen de indicadores se obtiene con:

```powershell
Invoke-RestMethod -Uri "http://localhost:3000/api/v1/kpis/resumen"
```

La respuesta incluye activos totales y con responsable, riesgos abiertos,
vulnerabilidades abiertas y críticas, e incidentes agrupados por estado.

## Comprobaciones

```powershell
npm.cmd run build
npm.cmd test -- --runInBand
npm.cmd run test:e2e -- --runInBand
```

## Módulos actuales

- Organización: organizaciones, unidades, trabajadores, procesos y RACI.
- Seguridad: activos, riesgos, vulnerabilidades e incidentes.
- Cumplimiento: políticas, procedimientos, planes y evidencias.
- KPI: resumen de indicadores operativos.

Las credenciales y archivos `.env` son locales y no deben subirse al repositorio.
