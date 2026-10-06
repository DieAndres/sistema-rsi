# Exportaciones

Guardar aquí ejemplos generados de MCU 5.0, ISO 27001, BCU, URCDP y COBIT.

## Funcionalidades implementadas de SoA y planes

### Evaluación SoA integrada en Exportaciones

La evaluación se realiza desde **Exportaciones → ISO 27001 → Declaración de aplicabilidad (SoA)**, para la organización seleccionada. El botón **Completar evaluación SoA**, junto a las acciones de descarga, abre el listado de controles y permite seleccionar uno para completar su ficha.

La ficha muestra el tema del control como campo de solo lectura y permite guardar aplicabilidad, justificación, estado, insumos organizacionales, evidencia y plan de tratamiento. Las evaluaciones se guardan en la base de datos por organización y control.

### Listado e informe completo en una misma sección

La sección SoA ofrece dos vistas que utilizan las mismas evaluaciones guardadas:

- **Listado de controles:** presenta identificador, tema, aplicabilidad y estado.
- **Informe completo:** genera la declaración de aplicabilidad con registros disponibles, resumen por categorías, justificaciones, insumos, evidencias, estados y resumen del plan de tratamiento.

Desde ambas vistas se puede abrir la evaluación y descargar el contenido mostrado en Markdown, CSV o mediante la impresión del navegador para guardar como PDF. Al guardar una evaluación, se vuelve a consultar la vista seleccionada para reflejar los cambios.

### Planes vinculados a controles

Cada evaluación SoA puede vincularse a un plan existente de la misma organización. El resumen del informe incluye únicamente los planes vinculados a controles; no incorpora automáticamente todos los planes registrados.

La columna **Riesgo/Control** combina el identificador del control con el riesgo asociado al plan. La columna **Acción** utiliza la descripción del plan, o su nombre cuando no hay descripción, y agrega su estado. También se muestran el ID del plan, su responsable y su fecha límite.

El vínculo se establece en dos pasos: se asocia el riesgo al plan en **Planes e hitos**, y se selecciona ese plan en la ficha de evaluación del control SoA.

### Edición de planes

En **Planes e hitos**, cada plan dispone de un botón **Editar**, junto a **Ver hitos**. La edición reutiliza el formulario de creación y permite modificar nombre, tipo, descripción de la acción, responsable, riesgo asociado, fecha de inicio, fecha límite y estado.

Los cambios se guardan sobre el plan existente mediante `PATCH /api/v1/cumplimiento/planes/{id}`. Se pueden quitar las asociaciones de responsable y riesgo. Los cambios del plan se reflejan en el resumen de tratamiento al generar nuevamente el informe SoA.

