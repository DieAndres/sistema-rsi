# Frontend RSI

Interfaz del sistema RSI construida con React, Vite y TypeScript.

## Estructura

```text
src/
├── app/                 # Composición y arranque de la aplicación
├── features/            # Funcionalidades agrupadas por dominio
│   └── organizacion/
│       ├── api/         # Llamadas a endpoints de organización
│       ├── components/  # Componentes propios de organización
│       ├── pages/       # Pantallas del módulo
│       ├── types/       # Tipos de sus datos
│       └── utils/       # Transformaciones del módulo
├── shared/              # Código reutilizable entre funcionalidades
│   └── api/             # Cliente HTTP común
├── assets/              # Recursos gráficos
├── index.css            # Estilos y reglas globales
└── main.tsx             # Entrada de React
```

Cada nueva funcionalidad debe vivir bajo `features/` en una carpeta con su
dominio. El código común solo va en `shared/` cuando sea utilizado por más de
una funcionalidad.

## Desarrollo

```bash
npm install
npm run dev
```

Vite reenvía `/api` al backend en `http://localhost:3001`. Para registrar o usar
passkeys en desarrollo, abrir `http://localhost:5173`, que debe coincidir con
`WEBAUTHN_ORIGIN` del backend. En **Seguridad de cuenta** se registra la passkey;
en la pantalla de acceso se usa **Entrar con passkey / Windows Hello**.
Para verificar el frontend antes de integrar cambios, ejecutar `npm run build`
y `npm run lint`.
