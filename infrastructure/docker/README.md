# Docker

## PostgreSQL local

## Requisitos

- Docker Desktop iniciado.
- Node.js LTS instalado.
- PowerShell o una terminal compatible.

## Configuración

Desde la raíz del proyecto, copiá `.env.example` como `.env`. Para ejecutar el
backend desde Windows, la URL debe usar `localhost`:

```env
DATABASE_URL=postgresql://rsi:change-me@localhost:5432/rsi
```

El archivo `.env` queda ignorado por Git; cada integrante debe crearlo en su
entorno.

Al trabajar con el backend fuera de Docker, copiá también esa configuración
como `backend/.env`, porque Prisma se ejecuta desde esa carpeta:

```powershell
Copy-Item .env backend/.env
```

## Inicio de PostgreSQL

Desde la raíz del proyecto se puede iniciar la base de datos con el `.env`
configurado:

```bash
Copy-Item .env.example .env
docker compose up -d postgres
```

El servicio queda disponible en `localhost:5432`. La aplicación usa la variable
`DATABASE_URL` definida en `backend/.env`.

## Instalación y preparación del backend

Luego, desde `backend`, instalar dependencias, generar el cliente de Prisma y
aplicar la migración inicial:

```bash
npm install
npx prisma generate
npx prisma migrate dev --name init
npm run start:dev
```

En PowerShell, si la política de ejecución bloquea `npm.ps1` o `npx.ps1`, usar
los ejecutables `.cmd`:

```powershell
npm.cmd install
npx.cmd prisma generate
npx.cmd prisma migrate dev --name init
npm.cmd run start:dev
```

La migración crea en PostgreSQL las tablas definidas en
`backend/prisma/schema.prisma`. Si ya existe una migración aplicada, no es
necesario repetirla; basta con ejecutar `npx prisma migrate deploy` al preparar
un entorno existente.

El volumen `postgres_data` conserva los datos entre reinicios. Para eliminar
también los datos persistidos, usar `docker compose down -v`.
