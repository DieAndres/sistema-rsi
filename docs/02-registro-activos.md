# Inventario y clasificación de activos del Sistema RSI

## Encabezado de mapeo normativo

| Marco | Ítem verificado | Aporte de este documento |
|---|---|---|
| MCU 5.0 | Identificar (ID), categoría ID.AM — Gestión de activos | Identifica software, datos, servicios y dependencias que sostienen al Sistema RSI. El inventario físico del equipo anfitrión queda por completar. |
| MCU 5.0 | ID.AM-01, ID.AM-02 e ID.AM-05 | Orientan el inventario de hardware, software y servicios, y la priorización por clasificación y criticidad. Esta versión documenta los componentes verificables en el repositorio y señala lo que falta verificar en el entorno. |
| COBIT 2019 | BAI09 — Gestionar activos; APO12 — Gestionar riesgos | El inventario permite asignar responsables y priorizar el análisis de riesgos de los componentes del RSI. La plantilla menciona APO03 como «gestión de activos», pero en COBIT 2019 el objetivo específico de activos es BAI09. |
| ISO/IEC 27001:2022 e ISO/IEC 27002:2022 | Anexo A, 5.9 — Inventario de información y otros activos asociados | Registra los activos, sus responsables propuestos y una clasificación preliminar. No acredita que el inventario esté completo en toda la operación. |
| BCU — Guía de estándares mínimos de gestión | GA.1 — Identificar formalmente activos y responsables; GA.2 — Clasificar y proteger información | Sirve como referencia de inventario y clasificación. No se presupone que el proyecto sea una institución supervisada. |
| Ley 18.331 | Art. 10 — Seguridad de los datos | Los datos personales tratados por el RSI se identifican como información a proteger. El inventario técnico no sustituye el registro legal de bases de datos ni determina por sí solo al responsable del tratamiento. |
| NIST CSF 2.0 | ID.AM — Gestión de activos | Referencia complementaria para mantener el inventario según la importancia de cada activo. |

El perfil MCU 5.0 **Avanzado** es una meta de la consigna; este registro no declara cumplimiento del perfil.

## Control del documento

| Campo | Valor |
|---|---|
| Código | SI-ACT-02 |
| Versión | 1.0 — propuesta |
| Responsable del inventario | RSI o responsable de seguridad designado para el Sistema RSI |
| Fecha | 30/09/2026 |
| Aprobación | Pendiente de registrar |
| Próxima revisión | Al cambiar la arquitectura o el despliegue y, como mínimo, anualmente |

### Historial de versiones

| Versión | Fecha | Autor | Cambios |
|---|---|---|---|
| 1.0 | 30/09/2026 | Equipo del proyecto | Primer inventario del propio Sistema RSI, basado en arquitectura, configuración y código del repositorio. |

## 1. Objetivo

Identificar los componentes y la información necesarios para **desarrollar y operar el Sistema RSI**, estimar su importancia para la seguridad y continuidad, y ofrecer una base para el análisis de riesgos. Los activos que las organizaciones usuarias cargan mediante el módulo `/seguridad/activos` pertenecen a **sus propios inventarios**; no son filas de este documento. La base de datos y las categorías de información que el RSI almacena sí son activos de la plataforma.

## 2. Metodología

1. Identificar componentes en `docs/00-arquitectura.md`, `docker-compose.yml`, los paquetes del frontend y backend, el esquema Prisma y la configuración versionada.
2. Registrar por separado información, software, servicios y almacenamiento. Una tecnología prevista solo se incorpora al inventario operativo cuando exista configuración o despliegue verificable.
3. Proponer clasificación según el daño por divulgación y criticidad según el impacto de pérdida o indisponibilidad. La clasificación se valida con el responsable designado antes de considerarla definitiva.
4. Verificar versión, ubicación real, propietario y dependencias en cada cambio de despliegue. No publicar contraseñas, tokens, cadenas de conexión reales ni rutas sensibles del anfitrión.

La ubicación indicada abajo es **lógica o de repositorio**, porque no hay inventario verificado del equipo físico ni un despliegue de producción. «Dueño» expresa el rol propuesto; falta designar a una persona responsable.

## 3. Clasificación

Los niveles siguientes son **criterios propuestos** para la información del RSI; no son etiquetas ya aprobadas para cada registro de las organizaciones usuarias.

| Nivel | Confidencialidad | Ejemplo del RSI | Impacto orientativo de una divulgación |
|---|---|---|---|
| Público | Distribución autorizada sin restricción | Documentación o código que se publique deliberadamente | Bajo para la confidencialidad; aún debe preservarse su integridad. |
| Interno | Acceso del equipo operador o desarrollador | Configuración sin secretos, diagramas operativos | Puede facilitar ataques o causar errores de operación. |
| Confidencial | Acceso limitado por función y ámbito | Datos de usuarios, registros de organizaciones, logs de auditoría | Exposición de información personal u operativa. |
| Secreto | Acceso estrictamente limitado | Contraseñas de servicio, semillas TOTP y claves de sesión | Su exposición puede permitir suplantación o acceso a la plataforma. |

La criticidad «Sí» significa que perder ese activo impediría funciones esenciales del RSI o comprometería de forma grave su seguridad; es una **valoración preliminar**, distinta de la clasificación de confidencialidad.

## 4. Inventario de activos

| ID | Activo del RSI | Tipo | Ubicación / evidencia en repositorio | Dueño propuesto | Clasificación preliminar | Crítico | Software / versión o estado |
|---|---|---|---|---|---|---|---|
| RSI-A01 | Interfaz web | SW | `frontend/src/`, `frontend/package.json` | Responsable técnico | Interno | Sí | React 19 y Vite 8 declarados; versión instalada depende del lockfile. |
| RSI-A02 | API y lógica de negocio | SW | `backend/src/`, `backend/package.json` | Responsable técnico | Interno | Sí | NestJS 12 declarado; API `/api/v1`. |
| RSI-A03 | Identidad, sesiones y autorización | SW | `backend/src/auth/`, `backend/prisma/schema.prisma` | Responsable técnico | Confidencial | Sí | Módulo propio del backend; autenticación y permisos descritos en la arquitectura. |
| RSI-A04 | Base de datos PostgreSQL | Servicio | `docker-compose.yml`, `backend/prisma/` | Administrador de plataforma | Confidencial | Sí | Imagen `postgres:16-alpine` declarada para entorno local. |
| RSI-A05 | Datos persistidos de la aplicación | Dato | Tablas definidas en `backend/prisma/schema.prisma` | RSI / operador del sistema | Confidencial | Sí | Incluye cuentas, sesiones, auditoría y registros de gestión; volumen y cantidad reales por verificar. |
| RSI-A06 | Volumen persistente de PostgreSQL | Dato / almacenamiento | `postgres_data` en `docker-compose.yml` | Administrador de plataforma | Confidencial | Sí | Persistencia local; **no es una copia de seguridad**. |
| RSI-A07 | Secretos de configuración y credenciales | Dato | Variables definidas en `.env.example`; valores reales fuera de Git | Administrador de plataforma | Secreto | Sí | Contraseña de BD y `DATABASE_URL`; custodio y medio seguro por definir. |
| RSI-A08 | Eventos de auditoría | Dato | Modelo `AuditEvent` y módulo `backend/src/auth/` | RSI / administrador | Confidencial | Sí | Registro básico en BD; retención y cobertura completas por verificar. |
| RSI-A09 | Código fuente, esquema y migraciones | SW / dato | `frontend/`, `backend/`, Git | Responsable técnico | Interno | Sí | Versionado en el repositorio; integridad necesaria para reconstruir el servicio. |
| RSI-A10 | Configuración de ejecución local | Dato | `docker-compose.yml`, `backend/prisma/` | Administrador de plataforma | Interno | Sí | Docker Compose configura PostgreSQL; backend y frontend se ejecutan fuera de Compose en las guías actuales. |

La etiqueta «Interno» del código y de la interfaz se revisará según la decisión de publicación *open source* de la consigna: publicar el código no autoriza publicar secretos ni configuraciones privadas. El inventario cubre activos **lógicos verificables**, no afirma que cada componente esté desplegado y protegido en producción.

### Componentes previstos que aún no integran el inventario operativo

| Componente | Decisión o requisito | Estado observado |
|---|---|---|
| Nginx y TLS | Previstos en las decisiones de arquitectura; TLS exigido por RNF-04 | `infrastructure/nginx/README.md` es un marcador, sin configuración de proxy o certificado. |
| Wazuh / SIEM | Previsto para centralizar eventos | `docs/00-arquitectura.md` lo indica como pendiente; no se encontró despliegue en `docker-compose.yml`. |
| Copia de seguridad independiente | Respaldo diario y restauración probada exigidos por RNF-03 | `docs/06-Plan-Continuidad.md` indica que no están configurados ni probados. |
| Equipo anfitrión y red | Necesarios para operar la aplicación | Identidad, ubicación, versión de SO y responsable no constan en el repositorio; deben relevarse en el entorno de entrega. |

## 5. Matriz crítica (para riesgo e impacto)

La matriz se refiere a **funciones del Sistema RSI**, no a los procesos de negocio de las organizaciones que cargan datos. Los RTO son objetivos propuestos en `docs/06-Plan-Continuidad.md`, no tiempos demostrados.

| Función del RSI | Activos que la sostienen | Impacto de una interrupción | RTO deseado |
|---|---|---|---|
| Consultar y modificar registros | RSI-A01 a RSI-A06, RSI-A10 | Alto: impide la operación de gestión y consulta. | Backend: 2 horas después de recuperar PostgreSQL; BD: 4 horas, objetivos propuestos. |
| Iniciar sesión y aplicar permisos | RSI-A01 a RSI-A05, RSI-A07 | Alto: bloquea el uso autorizado o expone información si se compromete. | Pendiente de acordar por función. |
| Conservar trazabilidad | RSI-A04, RSI-A05, RSI-A08 | Alto: dificulta reconstruir cambios y revisar incidentes. | Pendiente de acordar. |
| Recuperar datos y servicio | RSI-A04, RSI-A06, RSI-A09, RSI-A10 y respaldo independiente pendiente | Alto: puede causar pérdida prolongada o irreversible de datos. | BD: 4 horas; RPO: 24 horas solo si se implementa respaldo diario, objetivos propuestos. |

## 6. Responsabilidades

| Rol | Responsabilidad sobre este inventario |
|---|---|
| Dueño designado de cada activo | Confirmar clasificación, criticidad, ubicación, accesos y cambios. La asignación nominal está pendiente. |
| Administrador de plataforma | Verificar componentes realmente desplegados, versiones, configuración, volumen y medios de respaldo. |
| RSI o responsable de seguridad | Revisar que el inventario cubra el alcance del RSI y usarlo para priorizar riesgos y controles. |

## Fuentes oficiales

- [AGESIC — MCU 5.0, función Identificar y categoría ID.AM](https://www.gub.uy/agencia-gobierno-electronico-sociedad-informacion-conocimiento/comunicacion/publicaciones/marco-ciberseguridad-50/modelo-madurez/funcion-identificar-id).
- [ISACA — COBIT 2019, objetivo BAI09](https://www.isaca.org/resources/news-and-trends/industry-news/2020/managing-remote-work-environments-with-cobit-2019) y [APO12](https://www.isaca.org/resources/news-and-trends/industry-news/2019/governing-digital-transformation-using-cobit-2019).
- [Comité ISO/IEC JTC 1/SC 27 — inventario de información y activos asociados, control 5.9](https://committee.iso.org/files/live/sites/jtc1sc27/files/resources/ISO-IEC%20JTC%201-SC%2027_N22755_SC27%20Journal%20Vol%202%20Issue%202%20%28update%20Dec%202022%29.pdf).
- [BCU — Guía de estándares mínimos de gestión de seguridad de la información](https://www.bcu.gub.uy/Servicios-Financieros-SSF/Documents/guia%20emg%20seguridad%20de%20la%20informacion.pdf).
- [IMPO — Ley 18.331, artículo 10](https://www.impo.com.uy/bases/leyes/18331-2008/10).
- [NIST — Cybersecurity Framework 2.0](https://www.nist.gov/publications/nist-cybersecurity-framework-csf-20).
