# Arquitectura del sistema

## Control del documento

| Campo | Valor |
|---|---|
| Código | ARQ-C4-02 |
| Versión | 1.0 |
| Fecha | 24/09/2026 |
| Metodología | C4 |
| Estado | En construcción |

## C4 — Diagrama de contexto

El Sistema RSI está construido actualmente como una API backend con PostgreSQL.
Los perfiles que se muestran son actores previstos para la solución; la
autenticación y la interfaz web todavía están pendientes.

```mermaid
flowchart LR
    RSI[RSI<br/>Gestiona seguridad y cumplimiento]
    Admin[Administrador<br/>Gestiona usuarios y configuración]
    Dueño[Dueño de unidad<br/>Gestiona información de su unidad]
    Lector[Lector<br/>Consulta información autorizada]
    Sistema[Sistema de Gestión Integrada para el RSI<br/>Organización, activos, riesgos, incidentes y cumplimiento]
    RSI --> Sistema
    Admin --> Sistema
    Dueño --> Sistema
    Lector --> Sistema

    classDef actor fill:#2563eb,color:#fff,stroke:#1e40af
    classDef system fill:#16a34a,color:#fff,stroke:#15803d
    class RSI,Admin,Dueño,Lector actor
    class Sistema system
```

### Alcance del diagrama

- El sistema concentra la lógica de gestión y cumplimiento en una API REST.
- La interfaz de navegador está prevista, pero no está implementada aún.

## C4 — Diagrama de contenedores

Este nivel muestra las partes principales que forman la aplicación web y cómo se comunican.

```mermaid
flowchart LR
    Usuario[Usuario]

    subgraph Sistema[ Sistema de Gestión Integrada para el RSI ]
        Backend[Backend API<br/>NestJS + TypeScript]
        BD[(Base de datos<br/>PostgreSQL + Prisma)]
    end

    Usuario[Cliente HTTP / herramienta de pruebas] -->|JSON / REST| Backend
    Backend -->|Prisma / PostgreSQL| BD

    classDef app fill:#dbeafe,color:#111827,stroke:#60a5fa
    classDef data fill:#fef3c7,color:#111827,stroke:#f59e0b
    class Backend app
    class BD data
```

### Lectura simple del flujo

1. Un cliente HTTP invoca una ruta REST bajo `/api/v1`.
2. El backend aplica la lógica del módulo correspondiente.
3. Prisma consulta o modifica los datos en PostgreSQL.
4. La API devuelve una respuesta JSON al cliente.

## C4 — Diagrama de componentes

El backend se organiza como un monolito modular. Cada módulo concentra sus
controladores, servicios y DTOs, y utiliza Prisma para acceder a PostgreSQL.

| Componente | Responsabilidad | Estado |
|---|---|---|
| Organización | Organizaciones, unidades, trabajadores, procesos y RACI | Implementado |
| Seguridad | Activos, riesgos, vulnerabilidades e incidentes | Implementado |
| Cumplimiento | Políticas, procedimientos, planes y evidencias | Implementado |
| Búsqueda | Búsqueda global y filtros por unidad, estado y severidad | Implementado en API |
| KPI | Resumen, indicadores configurables, metas y mediciones históricas | Implementado; fórmulas disponibles mediante catálogo |
| Prisma | Persistencia y migraciones de PostgreSQL | Implementado |
| Docker Compose | Ejecución local de PostgreSQL y volumen persistente | Implementado; sin respaldo automático |
| Documentación de seguridad | Política, procedimientos de incidentes y vulnerabilidades, plan de continuidad | Redactados; requieren validación/aprobación operativa |
| Exportadores | Generación de documentos MCU, BCU, ISO, URCDP y COBIT | Pendiente |
| Autenticación y auditoría | Identidad, permisos y trazabilidad | Pendiente |
| Frontend y dashboard | Interfaz web y visualización de KPI | Pendiente |
| SIEM | Recepción y análisis centralizado de logs | Pendiente |

## C4 — Diagrama de código

Los archivos principales de los módulos implementados son:

| Componente | Archivos principales |
|---|---|
| Organización | `backend/src/organizacion/organizacion.controller.ts`, `organizacion.service.ts` |
| Seguridad | `backend/src/seguridad/seguridad.controller.ts`, `seguridad.service.ts` |
| Cumplimiento | `backend/src/cumplimiento/cumplimiento.controller.ts`, `cumplimiento.service.ts` |
| Búsqueda | `backend/src/busqueda/busqueda.controller.ts`, `busqueda.service.ts` |
| KPI | `backend/src/kpi/kpi.controller.ts`, `kpi.service.ts` |
| Persistencia | `backend/prisma/schema.prisma`, `backend/src/prisma/prisma.service.ts` |

Los módulos de seguridad incluyen activos, riesgos, vulnerabilidades e
incidentes. El módulo de cumplimiento incluye políticas, procedimientos,
planes y evidencias. Los documentos asociados describen procesos previstos y
no implican que los controles técnicos correspondientes ya estén desplegados.

## Modelo entidad-relación

Este diagrama muestra los datos principales del sistema y sus relaciones. A diferencia de C4, aquí se detallan los responsables, activos, riesgos, planes e incidentes.

```mermaid
erDiagram
    ORGANIZACION ||--o{ UNIDAD_ORGANIZATIVA : contiene
    ORGANIZACION ||--o{ PROCESO : contiene
    UNIDAD_ORGANIZATIVA ||--o{ UNIDAD_ORGANIZATIVA : depende_de
    UNIDAD_ORGANIZATIVA ||--o{ TRABAJADOR : tiene
    TRABAJADOR ||--o{ UNIDAD_ORGANIZATIVA : responsable_de
    TRABAJADOR ||--o{ ASIGNACION_RACI : recibe
    TRABAJADOR ||--o{ PROCESO : responsable_de
    PROCESO ||--o{ ASIGNACION_RACI : tiene
    UNIDAD_ORGANIZATIVA ||--o{ ACTIVO : posee
    TRABAJADOR ||--o{ ACTIVO : responsable_de
    ACTIVO ||--o{ RIESGO : afectado_por
    TRABAJADOR ||--o{ RIESGO : responsable_de
    RIESGO ||--o{ PLAN : asociado_a
    PLAN ||--o{ HITO_PLAN : contiene
    ACTIVO ||--o{ VULNERABILIDAD : contiene
    TRABAJADOR ||--o{ VULNERABILIDAD : responsable_de
    ACTIVO ||--o{ INCIDENTE : involucrado_en
    TRABAJADOR ||--o{ INCIDENTE : responsable_de
    POLITICA ||--o{ EVIDENCIA : respaldada_por
    RIESGO ||--o{ EVIDENCIA : respaldado_por
    INCIDENTE ||--o{ EVIDENCIA : respaldado_por

    ORGANIZACION {
        uuid id PK
        string nombre
    }
    UNIDAD_ORGANIZATIVA {
        uuid id PK
        uuid organizacion_id FK
        uuid unidad_padre_id FK
        string tipo
        string nombre
        uuid trabajador_responsable_id FK
    }
    TRABAJADOR {
        uuid id PK
        uuid unidad_organizativa_id FK
        string nombre
        string cargo
    }
    PROCESO {
        uuid id PK
        uuid organizacion_id FK
        uuid trabajador_responsable_id FK
        string nombre
        string version
        string estado
        date fecha_revision
    }
    ASIGNACION_RACI {
        uuid id PK
        uuid proceso_id FK
        uuid trabajador_id FK
        string tipo_responsabilidad
    }
    ACTIVO {
        uuid id PK
        uuid unidad_organizativa_id FK
        uuid trabajador_responsable_id FK
        string nombre
        string clasificacion
        string criticidad
    }
    RIESGO {
        uuid id PK
        uuid activo_id FK
        uuid trabajador_responsable_id FK
        integer probabilidad
        integer impacto
        integer puntaje_inherente_calculado
        string tratamiento
        string riesgo_residual
        boolean aceptado
        string estado
    }
    HITO_PLAN {
        uuid id PK
        uuid plan_id FK
        uuid trabajador_responsable_id FK
        string nombre
        date fecha_objetivo
        string estado
    }
    VULNERABILIDAD {
        uuid id PK
        uuid activo_id FK
        uuid trabajador_responsable_id FK
        decimal cvss
        integer sla
        string plan_remediacion
        string estado
    }
    INCIDENTE {
        uuid id PK
        uuid activo_id FK
        uuid trabajador_responsable_id FK
        string estado
        string lecciones_aprendidas
    }
    POLITICA {
        uuid id PK
        uuid organizacion_id FK
        uuid trabajador_responsable_id FK
        string titulo
        string version
        string estado
    }
    PROCEDIMIENTO {
        uuid id PK
        uuid organizacion_id FK
        uuid politica_id FK
        uuid trabajador_responsable_id FK
        string nombre
        string version
        string estado
        date fecha_revision
    }
    EVIDENCIA {
        uuid id PK
        uuid organizacion_id FK
        uuid politica_id FK
        uuid riesgo_id FK
        uuid vulnerabilidad_id FK
        uuid incidente_id FK
        string ubicacion
    }

    PLAN {
        uuid id PK
        uuid organizacion_id FK
        uuid riesgo_id FK
        uuid trabajador_responsable_id FK
        string tipo
        date fecha_inicio
        date fecha_fin
        string estado
    }
```

## Estado de la arquitectura

### Implementado

- Backend NestJS con API REST versionada en `/api/v1`.
- PostgreSQL con Prisma y migraciones.
- Módulos de organización, seguridad y cumplimiento.
- KPI: resumen existente, catálogo de fórmulas, configuración de indicadores,
  metas y captura/consulta de mediciones históricas.
- Ejecución local de PostgreSQL mediante Docker Compose.
- Volumen persistente local para los datos de PostgreSQL.
- Documentación inicial de política de seguridad, gestión de incidentes,
  gestión de vulnerabilidades y continuidad.

### Planificado o pendiente

- Frontend React + Vite.
- Exportadores de documentos.
- Autenticación, roles, permisos y auditoría.
- Integración con Wazuh.
- Dashboard visual de KPI.
- Respaldos automáticos, copia externa y prueba documentada de restauración.
