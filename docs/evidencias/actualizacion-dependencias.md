# Actualización de dependencias — 08/10/2026

Control: corrección de dependencias vulnerables sin omitir el hook pre-push ni utilizar npm audit fix --force.

Cambios:

- Se retiró @nestjs/mau y el comando nest deploy, sin uso en el despliegue Docker del proyecto. Se eliminaron sus dependencias vulnerables tmp y undici.
- Prisma, su cliente y el adaptador PostgreSQL permanecen en la rama 7.10.0. Overrides dirigidos actualizan deepmerge-ts a 8.0.2 en @prisma/config y mysql2 a 3.24.5 en prisma.
- El lector YAML de @istanbuljs/load-nyc-config utiliza js-yaml 4.3.2 mediante un override; elimina la cadena argparse 1 / sprintf-js que originaba los avisos moderados.

Estos overrides deben revisarse al actualizar los paquetes padres y retirarse cuando incorporen versiones corregidas. La compatibilidad comprobada corresponde a los flujos y versiones del proyecto; no garantiza toda funcionalidad de las herramientas externas.

Verificación:

- npm ci del backend aprobado: instalación desde el lockfile actualizado.
- npm audit: cero vulnerabilidades informadas en backend y frontend en la fecha de evaluación.
- Prisma validate y generate aprobados; configuración Prisma cargada con deepmerge-ts actualizado.
- Compilación de backend y frontend aprobada.
- Diez suites unitarias: 16 pruebas aprobadas.
- Dos suites HTTP de sesiones y permisos/búsqueda/KPI: 12 pruebas aprobadas.
- Lectura de una configuración YAML con la dependencia resuelta por load-nyc-config: resultado esperado.
- PostgreSQL aislado: 18 migraciones aplicadas, escritura y lectura de usuario y transacción de auditoría aprobadas. No se modificó la BD operativa.

Resultado: avisos altos y moderados del informe anterior resueltos en el árbol npm actual. Esto no equivale a un análisis de imágenes Docker ni a una garantía de ausencia de vulnerabilidades futuras.

Referencias de los avisos: [deepmerge-ts](https://github.com/advisories/GHSA-ggr8-5vv4-36mx), [mysql2](https://github.com/advisories/GHSA-3f6p-5ww8-9rcr) y [sprintf-js](https://github.com/advisories/GHSA-hp3w-g68c-fv3c).
