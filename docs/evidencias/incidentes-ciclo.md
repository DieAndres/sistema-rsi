# Ciclo de incidentes

La pantalla existente permite crear en ABIERTO (detección). Editar se limita a los datos generales; el botón Seguimiento abre un panel con recorrido, etapa resaltada, acciones, lecciones e historial para avanzar a CONTENIDO, ERRADICADO, RECUPERADO y CERRADO. Son nombres y transiciones elegidos para implementar RF-07, no una transcripción de la consigna.

Avanzar requiere una acción de hasta 2000 caracteres; cerrar requiere lecciones aprendidas. Se admiten múltiples acciones en una misma etapa. El servidor asigna usuario y fecha. El historial y el estado se guardan juntos mediante escritura anidada de Prisma; el interceptor existente agrega AuditEvent en la transacción de la petición.

La migración conserva una entrada con el estado preexistente, sin inventar autores o acciones anteriores. Estados fuera del recorrido (por ejemplo EN_TRATAMIENTO) pasan a ABIERTO; el estado original permanece en esa entrada. Los registros cerrados sin lecciones anteriores deben completarlas al editar.

Prueba: `cd backend` y `npm run test:e2e -- --runInBand incidentes-ciclo.e2e-spec.ts`. Verifica el recorrido completo, rechazos, múltiples acciones, autor autenticado y auditoría. Backend y frontend compilan; lint de archivos modificados verificado.

El historial se conserva mientras exista el incidente; la eliminación actual sigue siendo física y su auditoría general permanece. No se reconstruye cronología anterior. No se agregan automatismos de respuesta sobre los activos.

## Uso desde la web

1. En **Seguridad → Incidentes**, seleccionar la organización y crear el incidente con activo, título, severidad, responsable y descripción. Comienza en ABIERTO y el historial registra la detección.
2. **Editar** modifica los datos generales. El activo permanece fijo al editar; no cambia la etapa ni registra acciones de resolución.
3. **Seguimiento** abre un panel en la misma pantalla. El recorrido resalta la etapa actual; el selector permite mantenerla o avanzar a la siguiente.
4. Escribir **Acción realizada** y pulsar **Guardar seguimiento**. El formulario exige texto también para registrar acciones dentro de la misma etapa. El panel permanece abierto y actualiza el historial.
5. Para seleccionar CERRADO, completar **Lecciones aprendidas** y describir la acción de cierre. **Volver** regresa al formulario general sin guardar cambios pendientes.

| Estado almacenado | Etapa mostrada | Siguiente estado permitido |
|---|---|---|
| ABIERTO | Detección | CONTENIDO |
| CONTENIDO | Contención | ERRADICADO |
| ERRADICADO | Erradicación | RECUPERADO |
| RECUPERADO | Recuperación | CERRADO |
| CERRADO | Lecciones y cierre | Ninguno; permite registrar acciones en el mismo estado |

## Contrato de API y almacenamiento

Se reutilizan POST y PATCH de `/api/v1/seguridad/incidentes` y GET de la colección o del registro. PATCH admite `estado`, `accionRealizada` y `leccionesAprendidas`; el cliente no asigna autor ni fecha. Ejemplo de avance desde ABIERTO:

```json
{"estado":"CONTENIDO","accionRealizada":"Se aisló el equipo afectado."}
```

La respuesta incluye `historial`, ordenado por fecha ascendente. Cada `AccionIncidente` conserva ID, incidenteId, estado, descripción, usuarioId, usuarioCorreo y fecha. El correo es una instantánea del autor autenticado; las entradas importadas tienen autor nulo. No hay endpoint para editar entradas del historial. `AuditEvent` conserva por separado los cambios técnicos del incidente.

HTTP 400 rechaza estados desconocidos, saltos, retrocesos, avance sin acción, acción mayor de 2000 caracteres y cierre sin lecciones. Un PATCH de datos generales sin acción no agrega una entrada de resolución; su cambio sigue siendo auditado. La fecha de la entrada importada es la de migración, no la fecha original de detección.

La migración `20261001190000_historial_incidentes` crea `acciones_incidente`, importa los estados anteriores y agrega una restricción de estados a `incidentes`. Para otra instalación con datos respaldados:

```powershell
cd backend
npx.cmd prisma migrate deploy
npx.cmd prisma generate
```

Reiniciar el backend después de generar el cliente. No se requieren dependencias ni variables nuevas.

## Alcance de la evidencia

Fecha de verificación: 01/10/2026. RF-07 (ciclo de vida), RF-19 (lecciones) y RF-16 (auditoría de cambios) son los requisitos relacionados. El panel fue revisado visualmente en el navegador; no se declara una prueba automatizada del navegador ni un incidente operativo real. La prueba de integración usa PostgreSQL, una sesión RSI temporal y un activo existente; elimina únicamente sus registros de prueba.

El backend exige acción al avanzar, mientras que el formulario de Seguimiento la exige en cada envío. No se automatizan bloqueos, erradicación ni restauración: el equipo realiza esas tareas y documenta lo realizado. No se implementan notificaciones externas ni cálculo de MTTR en esta modificación.
