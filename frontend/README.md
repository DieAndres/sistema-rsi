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

La interfaz utiliza contraseña y TOTP. El registro y acceso con passkeys quedan como mejora futura.
Para verificar el frontend antes de integrar cambios, ejecutar `npm run build`
y `npm run lint`.

## Incidentes: edición y seguimiento

En Seguridad → Incidentes, **Editar** modifica datos generales y **Seguimiento** abre un panel con recorrido, etapa actual, acciones, lecciones e historial. Guardar seguimiento mantiene el panel abierto; Volver regresa al formulario general. Las acciones son obligatorias en el panel y las lecciones se exigen para cerrar. [Guía completa](../docs/evidencias/incidentes-ciclo.md).

## Sesiones protegidas

El frontend usa cookies; el navegador envía Origin y el backend comprueba que corresponda a un sitio autorizado. No almacena credenciales en localStorage; consulta /auth/me para recuperar la cuenta al recargar. La CSP se aplica en el despliegue Nginx. Para verificar los controles, usar HTTPS de Docker; no desactivar Secure para publicar por HTTP.
