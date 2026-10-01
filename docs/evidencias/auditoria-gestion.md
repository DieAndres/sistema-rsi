# Evidencia: auditoría de gestión y filtros

Fecha: 01/10/2026. Requisitos: RF-16; consulta del historial relacionada con RNF-05.

## Implementación

`AuditoriaInterceptor` registra en `AuditEvent` las altas, modificaciones,
bajas y aprobaciones de organización, seguridad, cumplimiento, KPI y las
evaluaciones SoA/brechas MCU. También registra las exportaciones de inventario
y SoA. Las consultas ordinarias no generan eventos de cambios.

Se registra actor autenticado, entidad, ID, operación, fecha UTC y resultado.
Los metadatos contienen campos persistidos anteriores y nuevos; las relaciones
activo/proceso se guardan por ID. No se copia el cuerpo de la petición ni
relaciones completas. Autenticación mantiene sus eventos existentes separados.

La operación y su evento se guardan en una transacción serializable. El
contexto de transacción se propaga entre los proveedores Prisma mediante
AsyncLocalStorage. Si falla el evento, se deshace la modificación de negocio.
Un conflicto de escrituras concurrentes aborta la petición; no se reintenta
automáticamente.

## Consulta

Solo el Administrador accede a `GET /api/v1/auth/auditoria`.
Parámetros opcionales: `entidad`, `usuarioId`, `pagina` (desde 1).
Respuesta: `{ eventos, total, pagina, porPagina: 50 }`.
Los filtros se aplican en PostgreSQL antes de paginar. La pantalla permite
filtrar por entidad/usuario, recorrer páginas y desplegar los cambios.
No hay purga automática ni límite de antigüedad al consultar; la prueba incluye
eventos de 2024. Esto no demuestra por sí solo un año de operación, respaldo
ni resguardo de la base: esas garantías siguen requiriendo evidencia operativa.

## Prueba ejecutada

Desde `backend/`:

```powershell
npm.cmd run test:e2e -- --runInBand auditoria.e2e-spec.ts
```

Resultado: 1 suite aprobada, 4 pruebas aprobadas.

- Altas, valores anteriores/nuevos, cambios de relaciones, bajas, aprobación,
  evaluaciones SoA, brechas y exportaciones con su actor.
- Filtros, paginación de 51 eventos y acceso a eventos antiguos.
- Acceso permitido al Administrador; rechazo de solicitudes sin sesión,
  del Lector y de filtros inválidos.
- Solicitudes fallidas sin eventos de éxito y rollback si falla la auditoría,
  comprobando la propagación entre instancias distintas de PrismaService.

Los registros pertenecen a cuentas y entidades de prueba y se eliminan al
finalizar la suite. PostgreSQL se reanudó para ejecutar las pruebas y volvió
a su estado pausado previo.
