# Arquitectura del sistema

## C4 — Diagrama de contexto

El sistema será utilizado por distintos perfiles de la organización para gestionar seguridad de la información, activos, riesgos, incidentes y cumplimiento.

```mermaid
flowchart LR
    RSI[RSI<br/>Gestiona seguridad y cumplimiento]
    Admin[Administrador<br/>Gestiona usuarios y configuración]
    Dueño[Dueño de unidad<br/>Gestiona información de su unidad]
    Lector[Lector<br/>Consulta información autorizada]
    Sistema[Sistema de Gestión Integrada para el RSI<br/>Organización, activos, riesgos, incidentes y cumplimiento]
    Wazuh[Wazuh<br/>Analiza eventos y logs de seguridad]

    RSI --> Sistema
    Admin --> Sistema
    Dueño --> Sistema
    Lector --> Sistema
    Sistema -->|Envía eventos y logs| Wazuh

    classDef actor fill:#2563eb,color:#fff,stroke:#1e40af
    classDef system fill:#16a34a,color:#fff,stroke:#15803d
    classDef external fill:#e5e7eb,color:#111827,stroke:#9ca3af
    class RSI,Admin,Dueño,Lector actor
    class Sistema system
    class Wazuh external
```

### Alcance del diagrama

- Los usuarios interactúan con el sistema desde un navegador.
- El sistema RSI concentra la lógica de gestión y cumplimiento.
- Wazuh se considera un sistema externo porque Persona 2 gestionará su integración técnica.

## C4 — Diagrama de contenedores

Este nivel muestra las partes principales que forman la aplicación web y cómo se comunican.

```mermaid
flowchart LR
    Usuario[Usuario]

    subgraph Sistema[ Sistema de Gestión Integrada para el RSI ]
        Frontend[Frontend web<br/>React + Vite + TypeScript]
        Backend[Backend API<br/>NestJS + TypeScript]
        Exportador[Exportador de documentos<br/>Módulo del backend]
        BD[(Base de datos<br/>PostgreSQL + Prisma)]
    end

    Wazuh[Wazuh<br/>SIEM]

    Usuario -->|HTTPS| Frontend
    Frontend -->|JSON / REST| Backend
    Backend -->|Lee y escribe| BD
    Backend -->|Solicita informes| Exportador
    Backend -->|Envía eventos y logs| Wazuh

    classDef user fill:#2563eb,color:#fff,stroke:#1e40af
    classDef app fill:#dbeafe,color:#111827,stroke:#60a5fa
    classDef data fill:#fef3c7,color:#111827,stroke:#f59e0b
    classDef external fill:#e5e7eb,color:#111827,stroke:#9ca3af
    class Usuario user
    class Frontend,Backend,Exportador app
    class BD data
    class Wazuh external
```

### Lectura simple del flujo

1. El usuario entra a la aplicación mediante el **frontend**.
2. El frontend solicita información al **backend**.
3. El backend aplica la lógica del sistema y consulta **PostgreSQL**.
4. Cuando se solicita un informe, el backend utiliza el **exportador**.
5. Las acciones relevantes generan eventos que se envían a **Wazuh**.

## Modelo entidad-relación

Este diagrama muestra los datos principales del sistema y sus relaciones. A diferencia de C4, aquí se detallan los responsables, activos, riesgos, planes e incidentes.

```mermaid
erDiagram
    ORGANIZACION ||--o{ UNIDAD_ORGANIZATIVA : contiene
    UNIDAD_ORGANIZATIVA ||--o{ UNIDAD_ORGANIZATIVA : depende_de
    UNIDAD_ORGANIZATIVA ||--o{ TRABAJADOR : tiene
    TRABAJADOR ||--o{ ASIGNACION_RACI : recibe
    PROCESO ||--o{ ASIGNACION_RACI : tiene
    UNIDAD_ORGANIZATIVA ||--o{ ACTIVO : posee
    TRABAJADOR ||--o{ ACTIVO : responsable_de
    ACTIVO ||--o{ RIESGO : afectado_por
    TRABAJADOR ||--o{ RIESGO : responsable_de
    RIESGO ||--o{ PLAN_TRATAMIENTO : tratado_por
    ACTIVO ||--o{ VULNERABILIDAD : contiene
    TRABAJADOR ||--o{ VULNERABILIDAD : responsable_de
    ACTIVO ||--o{ INCIDENTE : involucrado_en
    TRABAJADOR ||--o{ INCIDENTE : responsable_de
    INCIDENTE ||--o{ LECCION_APRENDIDA : produce
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
    }
    TRABAJADOR {
        uuid id PK
        uuid unidad_organizativa_id FK
        string nombre
        string cargo
    }
    PROCESO {
        uuid id PK
        string nombre
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
        string criticidad
    }
    RIESGO {
        uuid id PK
        uuid activo_id FK
        uuid trabajador_responsable_id FK
        string tratamiento
        string estado
    }
    PLAN_TRATAMIENTO {
        uuid id PK
        uuid riesgo_id FK
        date fecha_limite
        string estado
    }
    VULNERABILIDAD {
        uuid id PK
        uuid activo_id FK
        uuid trabajador_responsable_id FK
        decimal cvss
        string estado
    }
    INCIDENTE {
        uuid id PK
        uuid activo_id FK
        uuid trabajador_responsable_id FK
        string estado
    }
    LECCION_APRENDIDA {
        uuid id PK
        uuid incidente_id FK
        string descripcion
    }
    POLITICA {
        uuid id PK
        string titulo
        string version
        string estado
    }
    EVIDENCIA {
        uuid id PK
        string tipo_entidad
        uuid entidad_id
        string ubicacion
    }
```
