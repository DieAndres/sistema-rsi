# Gestión de Vulnerabilidades

## Control del documento

| Campo | Valor |
|---|---|
| Código | SI-VUL-10 |
| Versión | 1.0 |
| Responsable | Responsable de Seguridad de la Información |
| Fecha | 24/09/2026 |

## 1. Objetivo y alcance

Definir el proceso operativo propuesto para identificar, registrar, priorizar,
remediar y verificar vulnerabilidades que afecten los activos gestionados por
el Sistema de Gestión Integrada para el RSI. El procedimiento no afirma que ya
se hayan ejecutado escaneos o análisis de seguridad.

El procedimiento aplica a vulnerabilidades de aplicaciones, dependencias,
contenedores, infraestructura y configuraciones asociadas a los activos en
alcance.

## 2. Registro de vulnerabilidades

Toda vulnerabilidad debe registrarse en el sistema con, como mínimo:

- activo afectado;
- nombre y descripción;
- puntuación CVSS cuando esté disponible;
- estado;
- responsable;
- SLA de remediación;
- plan de remediación;
- evidencias asociadas cuando corresponda.

El backend permite registrar y consultar vulnerabilidades. Este procedimiento
no contiene un inventario de hallazgos: los registros se mantienen en la base
de datos y su reporte se completará cuando corresponda.

## 3. Priorización y SLA

| Gravedad | Rango CVSS | SLA máximo de remediación |
|---|---|---|
| Crítica | 9.0 a 10.0 | 72 horas, objetivo propuesto |
| Alta | 7.0 a 8.9 | 7 días, objetivo propuesto |
| Media | 4.0 a 6.9 | 30 días, objetivo propuesto |
| Baja | 0.1 a 3.9 | 90 días, objetivo propuesto |

Estos plazos provienen de la plantilla de referencia y deben ser aprobados por
la organización antes de usarse como compromisos operativos. El sistema
almacena un SLA en horas, pero no automatiza alertas ni vencimientos.

Cuando no exista CVSS, la prioridad debe definirse considerando criticidad del
activo, exposición, impacto potencial y posibilidad de explotación.

## 4. Proceso de gestión

1. **Identificación:** recibir un reporte, alerta, escaneo o hallazgo de una
   prueba de seguridad.
2. **Registro:** asociar la vulnerabilidad al activo afectado y documentar la
   información disponible.
3. **Clasificación:** asignar CVSS, estado inicial, responsable y SLA.
4. **Planificación:** definir el plan de remediación y la fecha objetivo.
5. **Remediación:** aplicar parche, cambio de configuración, actualización o
   control compensatorio.
6. **Verificación:** comprobar que la vulnerabilidad fue corregida y actualizar
   el estado.
7. **Cierre o aceptación:** cerrar con evidencia o documentar una aceptación de
   riesgo justificada.

## 5. Herramientas y fuentes de hallazgos

Los hallazgos pueden provenir de reportes de dependencias, análisis de código,
escaneos de infraestructura, pruebas de aplicaciones, monitoreo o reportes de
usuarios.

Las herramientas concretas se incorporarán a este documento solamente después
de ser ejecutadas y de guardar evidencia verificable de sus resultados.

## 6. Falsos positivos y excepciones

Un hallazgo puede marcarse como falso positivo o aceptarse temporalmente si se
documenta la justificación, responsable, fecha de revisión y control
compensatorio. Esta decisión no elimina el registro ni la necesidad de revisar
el riesgo asociado.

## 7. Evidencias y revisión

Las evidencias pueden incluir resultados de escaneo, reportes de dependencias,
pruebas de remediación, capturas o referencias a cambios aplicados. No deben
incluir secretos, tokens ni información personal innecesaria.

Este procedimiento se revisará al menos una vez al año o después de una
vulnerabilidad crítica relevante.

## Historial de versiones

| Versión | Fecha | Cambios |
|---|---|---|
| 1.0 | 24/09/2026 | Creación del procedimiento de gestión de vulnerabilidades. |
