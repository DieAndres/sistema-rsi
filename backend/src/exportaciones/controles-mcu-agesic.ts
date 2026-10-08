// Fuente: planillas MCU 5.0 AGESIC, columna Línea Base = Si.
// Generado con scripts/extraer-mcu-agesic.py; no editar manualmente.
export const FUENTES_MCU_AGESIC = {
  "Básico": {
    "archivo": "Básico.xlsx",
    "sha256": "d22163e728c59b509fb95e475d54a89390f3de51eec7a116bc5cea5c1bcbe9dc",
    "controles": 165
  },
  "Estándar": {
    "archivo": "Estándar.xlsx",
    "sha256": "116493669e8fa73f5fa7ee3571a314e842b7497611267e1f7a3d4998dc5ab9fd",
    "controles": 234
  },
  "Avanzado": {
    "archivo": "Avanzado.xlsx",
    "sha256": "71bb642ac43a48785798ec2fd58a9d56b6a3f077325d0697b68b019435527ed7",
    "controles": 309
  }
};
export const CONTROLES_MCU_AGESIC = [
  {
    "controlId": "PS.1-1",
    "tema": "existe una política de seguridad aprobada por la Dirección",
    "funciones": [
      "Gobernar"
    ],
    "perfiles": [
      "Básico",
      "Estándar",
      "Avanzado"
    ],
    "evidenciaNecesaria": "Registrar una referencia verificable de la organización para este control.",
    "demostracionSugerida": "Describir cómo se verifica el control y su evidencia en la organización."
  },
  {
    "controlId": "PS.1-2",
    "tema": "la política es difundida a todo el personal y partes interesadas relevantes.",
    "funciones": [
      "Gobernar"
    ],
    "perfiles": [
      "Básico",
      "Estándar",
      "Avanzado"
    ],
    "evidenciaNecesaria": "Registrar una referencia verificable de la organización para este control.",
    "demostracionSugerida": "Describir cómo se verifica el control y su evidencia en la organización."
  },
  {
    "controlId": "OR.1-1",
    "tema": "existe una persona que cumple el rol de RSI.",
    "funciones": [
      "Gobernar"
    ],
    "perfiles": [
      "Básico",
      "Estándar",
      "Avanzado"
    ],
    "evidenciaNecesaria": "Registrar una referencia verificable de la organización para este control.",
    "demostracionSugerida": "Describir cómo se verifica el control y su evidencia en la organización."
  },
  {
    "controlId": "OR.1-2",
    "tema": "el RSI coordina actividades de seguridad de la información.",
    "funciones": [
      "Gobernar"
    ],
    "perfiles": [
      "Básico",
      "Estándar",
      "Avanzado"
    ],
    "evidenciaNecesaria": "Registrar una referencia verificable de la organización para este control.",
    "demostracionSugerida": "Describir cómo se verifica el control y su evidencia en la organización."
  },
  {
    "controlId": "OR.2-1",
    "tema": "se encuentra designado formalmente el CSI de la organización.",
    "funciones": [
      "Gobernar"
    ],
    "perfiles": [
      "Básico",
      "Estándar",
      "Avanzado"
    ],
    "evidenciaNecesaria": "Registrar una referencia verificable de la organización para este control.",
    "demostracionSugerida": "Describir cómo se verifica el control y su evidencia en la organización."
  },
  {
    "controlId": "OR.3-1",
    "tema": "está designado un punto de contacto oficial para incidentes de ciberseguridad.",
    "funciones": [
      "Gobernar"
    ],
    "perfiles": [
      "Básico",
      "Estándar",
      "Avanzado"
    ],
    "evidenciaNecesaria": "Registrar una referencia verificable de la organización para este control.",
    "demostracionSugerida": "Describir cómo se verifica el control y su evidencia en la organización."
  },
  {
    "controlId": "OR.3-2",
    "tema": "se han identificado los contactos de autoridades ante aspectos de ciberseguridad.",
    "funciones": [
      "Gobernar"
    ],
    "perfiles": [
      "Básico",
      "Estándar",
      "Avanzado"
    ],
    "evidenciaNecesaria": "Registrar una referencia verificable de la organización para este control.",
    "demostracionSugerida": "Describir cómo se verifica el control y su evidencia en la organización."
  },
  {
    "controlId": "OR.4-1",
    "tema": "se tiene una lista actualizada de proyectos (finalizados, en curso o planificados) de la organización.",
    "funciones": [
      "Proteger"
    ],
    "perfiles": [
      "Básico",
      "Estándar",
      "Avanzado"
    ],
    "evidenciaNecesaria": "Registrar una referencia verificable de la organización para este control.",
    "demostracionSugerida": "Describir cómo se verifica el control y su evidencia en la organización."
  },
  {
    "controlId": "OR.5-1",
    "tema": "se mantiene un inventario actualizado de los dispositivos móviles de la organización.",
    "funciones": [
      "Identificar"
    ],
    "perfiles": [
      "Básico",
      "Estándar",
      "Avanzado"
    ],
    "evidenciaNecesaria": "Registrar una referencia verificable de la organización para este control.",
    "demostracionSugerida": "Describir cómo se verifica el control y su evidencia en la organización."
  },
  {
    "controlId": "OR.5-2",
    "tema": "estos activos cuentan con al menos un factor de autenticación para acceder a la información.",
    "funciones": [
      "Proteger"
    ],
    "perfiles": [
      "Básico",
      "Estándar",
      "Avanzado"
    ],
    "evidenciaNecesaria": "Registrar una referencia verificable de la organización para este control.",
    "demostracionSugerida": "Describir cómo se verifica el control y su evidencia en la organización."
  },
  {
    "controlId": "OR.5-3",
    "tema": "existen pautas que regulan el uso de los dispositivos móviles.",
    "funciones": [
      "Proteger"
    ],
    "perfiles": [
      "Básico",
      "Estándar",
      "Avanzado"
    ],
    "evidenciaNecesaria": "Registrar una referencia verificable de la organización para este control.",
    "demostracionSugerida": "Describir cómo se verifica el control y su evidencia en la organización."
  },
  {
    "controlId": "OR.5-5",
    "tema": "los dispositivos de la organización cumplen con requisitos de seguridad como: antimalware, cifrado de disco, bloqueo, versión mínima de sistema operativo.",
    "funciones": [
      "Proteger"
    ],
    "perfiles": [
      "Básico",
      "Estándar",
      "Avanzado"
    ],
    "evidenciaNecesaria": "Registrar una referencia verificable de la organización para este control.",
    "demostracionSugerida": "Describir cómo se verifica el control y su evidencia en la organización."
  },
  {
    "controlId": "OR.6-1",
    "tema": "están definidos requisitos de seguridad mínimos para los dispositivos que se utilicen para acceder remotamente a los activos de la organización.",
    "funciones": [
      "Proteger"
    ],
    "perfiles": [
      "Básico",
      "Estándar",
      "Avanzado"
    ],
    "evidenciaNecesaria": "Registrar una referencia verificable de la organización para este control.",
    "demostracionSugerida": "Describir cómo se verifica el control y su evidencia en la organización."
  },
  {
    "controlId": "OR.6-4",
    "tema": "se implementa el múltiple factor de autenticación para el acceso remoto.",
    "funciones": [
      "Proteger"
    ],
    "perfiles": [
      "Básico",
      "Estándar",
      "Avanzado"
    ],
    "evidenciaNecesaria": "Registrar una referencia verificable de la organización para este control.",
    "demostracionSugerida": "Describir cómo se verifica el control y su evidencia en la organización."
  },
  {
    "controlId": "OR.7-1",
    "tema": "se han identificado los servicios críticos para la organización.",
    "funciones": [
      "Gobernar"
    ],
    "perfiles": [
      "Básico",
      "Estándar",
      "Avanzado"
    ],
    "evidenciaNecesaria": "Registrar una referencia verificable de la organización para este control.",
    "demostracionSugerida": "Describir cómo se verifica el control y su evidencia en la organización."
  },
  {
    "controlId": "OR.7-2",
    "tema": "se han identificado los proveedores y/o otras partes interesadas críticas para la organización.",
    "funciones": [
      "Gobernar"
    ],
    "perfiles": [
      "Básico",
      "Estándar",
      "Avanzado"
    ],
    "evidenciaNecesaria": "Registrar una referencia verificable de la organización para este control.",
    "demostracionSugerida": "Describir cómo se verifica el control y su evidencia en la organización."
  },
  {
    "controlId": "PL.1-1",
    "tema": "están establecidos los objetivos anuales de seguridad de la información.",
    "funciones": [
      "Gobernar"
    ],
    "perfiles": [
      "Básico",
      "Estándar",
      "Avanzado"
    ],
    "evidenciaNecesaria": "Registrar una referencia verificable de la organización para este control.",
    "demostracionSugerida": "Describir cómo se verifica el control y su evidencia en la organización."
  },
  {
    "controlId": "PL.1-2",
    "tema": "están definidas las acciones para lograr el cumplimiento de los objetivos.",
    "funciones": [
      "Gobernar"
    ],
    "perfiles": [
      "Básico",
      "Estándar",
      "Avanzado"
    ],
    "evidenciaNecesaria": "Registrar una referencia verificable de la organización para este control.",
    "demostracionSugerida": "Describir cómo se verifica el control y su evidencia en la organización."
  },
  {
    "controlId": "GR.1-1",
    "tema": "existe un proceso para la gestión de riesgos de seguridad de la información que abarca los componentes del centro de procesamiento de datos y servicios críticos de forma independiente.",
    "funciones": [
      "Gobernar"
    ],
    "perfiles": [
      "Básico",
      "Estándar",
      "Avanzado"
    ],
    "evidenciaNecesaria": "Registrar una referencia verificable de la organización para este control.",
    "demostracionSugerida": "Describir cómo se verifica el control y su evidencia en la organización."
  },
  {
    "controlId": "GR.2-1",
    "tema": "Se identifican los principales riesgos de seguridad de la información, valorando su potencial impacto y su probabilidad de ocurrencia.",
    "funciones": [
      "Gobernar",
      "Identificar",
      "Proteger"
    ],
    "perfiles": [
      "Básico",
      "Estándar",
      "Avanzado"
    ],
    "evidenciaNecesaria": "Registrar una referencia verificable de la organización para este control.",
    "demostracionSugerida": "Describir cómo se verifica el control y su evidencia en la organización."
  },
  {
    "controlId": "GR.3-1",
    "tema": "se toman acciones ad-hoc con el objetivo de llevar los principales riesgos de seguridad de la información a niveles aceptables para la organización.",
    "funciones": [
      "Gobernar",
      "Identificar"
    ],
    "perfiles": [
      "Básico",
      "Estándar",
      "Avanzado"
    ],
    "evidenciaNecesaria": "Registrar una referencia verificable de la organización para este control.",
    "demostracionSugerida": "Describir cómo se verifica el control y su evidencia en la organización."
  },
  {
    "controlId": "GH.1-1",
    "tema": "las condiciones laborales del personal, ya sea mediante contrato, estatuto o normativa interna, incluyen cláusulas o disposiciones que establecen sus responsabilidades en materia de seguridad de la información.",
    "funciones": [
      "Gobernar"
    ],
    "perfiles": [
      "Básico",
      "Estándar",
      "Avanzado"
    ],
    "evidenciaNecesaria": "Registrar una referencia verificable de la organización para este control.",
    "demostracionSugerida": "Describir cómo se verifica el control y su evidencia en la organización."
  },
  {
    "controlId": "GH.2-1",
    "tema": "se realizan actividades propias de difusión de información relacionada con seguridad de la información, como la difusión de las políticas y mecanismos de protección.",
    "funciones": [
      "Proteger"
    ],
    "perfiles": [
      "Básico",
      "Estándar",
      "Avanzado"
    ],
    "evidenciaNecesaria": "Registrar una referencia verificable de la organización para este control.",
    "demostracionSugerida": "Describir cómo se verifica el control y su evidencia en la organización."
  },
  {
    "controlId": "GH.2-2",
    "tema": "se elabora y/o obtiene el material educativo necesario para la realización de las campañas de concientización.",
    "funciones": [
      "Proteger"
    ],
    "perfiles": [
      "Básico",
      "Estándar",
      "Avanzado"
    ],
    "evidenciaNecesaria": "Registrar una referencia verificable de la organización para este control.",
    "demostracionSugerida": "Describir cómo se verifica el control y su evidencia en la organización."
  },
  {
    "controlId": "GH.3-1",
    "tema": "los usuarios privilegiados demuestran conocimiento respecto a la importancia de sus roles y responsabilidades.",
    "funciones": [
      "Proteger"
    ],
    "perfiles": [
      "Básico",
      "Estándar",
      "Avanzado"
    ],
    "evidenciaNecesaria": "Registrar una referencia verificable de la organización para este control.",
    "demostracionSugerida": "Describir cómo se verifica el control y su evidencia en la organización."
  },
  {
    "controlId": "GH.3-2",
    "tema": "el personal de seguridad de la información demuestra concientización respecto a la importancia de sus roles y responsabilidades.",
    "funciones": [
      "Proteger"
    ],
    "perfiles": [
      "Básico",
      "Estándar",
      "Avanzado"
    ],
    "evidenciaNecesaria": "Registrar una referencia verificable de la organización para este control.",
    "demostracionSugerida": "Describir cómo se verifica el control y su evidencia en la organización."
  },
  {
    "controlId": "GH.3-3",
    "tema": "están definidos los roles y responsabilidades de los interesados externos.",
    "funciones": [
      "Proteger"
    ],
    "perfiles": [
      "Básico",
      "Estándar",
      "Avanzado"
    ],
    "evidenciaNecesaria": "Registrar una referencia verificable de la organización para este control.",
    "demostracionSugerida": "Describir cómo se verifica el control y su evidencia en la organización."
  },
  {
    "controlId": "GA.1-1",
    "tema": "se confecciona y mantiene un inventario de activos físicos del centro de procesamiento de datos, incluyendo servidores, dispositivos de red, racks, UPS y otros componentes relevantes.",
    "funciones": [
      "Identificar"
    ],
    "perfiles": [
      "Básico",
      "Estándar",
      "Avanzado"
    ],
    "evidenciaNecesaria": "Registrar una referencia verificable de la organización para este control.",
    "demostracionSugerida": "Describir cómo se verifica el control y su evidencia en la organización."
  },
  {
    "controlId": "GA.1-2",
    "tema": "se elabora y mantiene un inventario detallado del software base (ej.: sistemas operativos, servidores de aplicación, servidores de base de datos, hipervisores) y del software de aplicación instalado en los activos del centro de procesamiento de datos.",
    "funciones": [
      "Identificar"
    ],
    "perfiles": [
      "Básico",
      "Estándar",
      "Avanzado"
    ],
    "evidenciaNecesaria": "Registrar una referencia verificable de la organización para este control.",
    "demostracionSugerida": "Describir cómo se verifica el control y su evidencia en la organización."
  },
  {
    "controlId": "GA.1-3",
    "tema": "cada activo registrado en el inventario debe tener un responsable asignado, cuya información debe estar documentada en el sistema de gestión de activos o inventario utilizado.",
    "funciones": [
      "Identificar"
    ],
    "perfiles": [
      "Básico",
      "Estándar",
      "Avanzado"
    ],
    "evidenciaNecesaria": "Registrar una referencia verificable de la organización para este control.",
    "demostracionSugerida": "Describir cómo se verifica el control y su evidencia en la organización."
  },
  {
    "controlId": "GA.1-5",
    "tema": "el inventario debe incluir las plataformas de software y aplicaciones implementadas, independientemente de su ubicación física o modalidad (on premise o en la nube).",
    "funciones": [
      "Identificar"
    ],
    "perfiles": [
      "Básico",
      "Estándar",
      "Avanzado"
    ],
    "evidenciaNecesaria": "Registrar una referencia verificable de la organización para este control.",
    "demostracionSugerida": "Describir cómo se verifica el control y su evidencia en la organización."
  },
  {
    "controlId": "GA.1-6",
    "tema": "se debe llevar un control actualizado del licenciamiento del software instalado, incluyendo información sobre tipo de licencia, vigencia y uso asignado.",
    "funciones": [
      "Proteger"
    ],
    "perfiles": [
      "Básico",
      "Estándar",
      "Avanzado"
    ],
    "evidenciaNecesaria": "Registrar una referencia verificable de la organización para este control.",
    "demostracionSugerida": "Describir cómo se verifica el control y su evidencia en la organización."
  },
  {
    "controlId": "GA.1-7",
    "tema": "el inventario debe estar debidamente documentado y accesible para las personas autorizadas por la organización.",
    "funciones": [
      "Identificar"
    ],
    "perfiles": [
      "Básico",
      "Estándar",
      "Avanzado"
    ],
    "evidenciaNecesaria": "Registrar una referencia verificable de la organización para este control.",
    "demostracionSugerida": "Describir cómo se verifica el control y su evidencia en la organización."
  },
  {
    "controlId": "GA.2-1",
    "tema": "están identificados los activos que contienen información crítica para la organización, en base a criterio institucionalmente definido que establezca qué se considera información crítica o sensible.",
    "funciones": [
      "Identificar"
    ],
    "perfiles": [
      "Básico",
      "Estándar",
      "Avanzado"
    ],
    "evidenciaNecesaria": "Registrar una referencia verificable de la organización para este control.",
    "demostracionSugerida": "Describir cómo se verifica el control y su evidencia en la organización."
  },
  {
    "controlId": "GA.2-2",
    "tema": "cada activo registrado en el inventario debe contar con una etiqueta o atributo que refleje su clasificación según los criterios previamente definidos.",
    "funciones": [
      "Identificar"
    ],
    "perfiles": [
      "Básico",
      "Estándar",
      "Avanzado"
    ],
    "evidenciaNecesaria": "Registrar una referencia verificable de la organización para este control.",
    "demostracionSugerida": "Describir cómo se verifica el control y su evidencia en la organización."
  },
  {
    "controlId": "GA.3-1",
    "tema": "existen pautas del uso aceptable de los activos de la información.",
    "funciones": [
      "Detectar",
      "Proteger"
    ],
    "perfiles": [
      "Básico",
      "Estándar",
      "Avanzado"
    ],
    "evidenciaNecesaria": "Registrar una referencia verificable de la organización para este control.",
    "demostracionSugerida": "Describir cómo se verifica el control y su evidencia en la organización."
  },
  {
    "controlId": "GA.3-2",
    "tema": "toda persona que acceda a activos de información debe aceptar formalmente, previo al acceso, las condiciones de uso establecidas por la organización.",
    "funciones": [
      "Detectar",
      "Proteger"
    ],
    "perfiles": [
      "Básico",
      "Estándar",
      "Avanzado"
    ],
    "evidenciaNecesaria": "Registrar una referencia verificable de la organización para este control.",
    "demostracionSugerida": "Describir cómo se verifica el control y su evidencia en la organización."
  },
  {
    "controlId": "GA.3-3",
    "tema": "se debe restringir el almacenamiento de información sensible en activos que no cuenten con controles adecuados; en caso de ser necesario, se deben aplicar mecanismos de protección como cifrado o control de acceso con MFA.",
    "funciones": [
      "Proteger"
    ],
    "perfiles": [
      "Básico",
      "Estándar",
      "Avanzado"
    ],
    "evidenciaNecesaria": "Registrar una referencia verificable de la organización para este control.",
    "demostracionSugerida": "Describir cómo se verifica el control y su evidencia en la organización."
  },
  {
    "controlId": "GA.4-1",
    "tema": "se realiza difusión sobre la importancia de la protección y uso seguro de los medios extraíbles.",
    "funciones": [
      "Proteger"
    ],
    "perfiles": [
      "Básico",
      "Estándar",
      "Avanzado"
    ],
    "evidenciaNecesaria": "Registrar una referencia verificable de la organización para este control.",
    "demostracionSugerida": "Describir cómo se verifica el control y su evidencia en la organización."
  },
  {
    "controlId": "GA.4-3",
    "tema": "se encuentran elaboradas y difundidas las pautas para el uso seguro de los medios de almacenamiento externos.",
    "funciones": [
      "Proteger"
    ],
    "perfiles": [
      "Básico",
      "Estándar",
      "Avanzado"
    ],
    "evidenciaNecesaria": "Registrar una referencia verificable de la organización para este control.",
    "demostracionSugerida": "Describir cómo se verifica el control y su evidencia en la organización."
  },
  {
    "controlId": "GA.5-1",
    "tema": "están definidas las pautas para la disposición final y borrado seguro de medios de almacenamiento.",
    "funciones": [
      "Identificar",
      "Proteger"
    ],
    "perfiles": [
      "Básico",
      "Estándar",
      "Avanzado"
    ],
    "evidenciaNecesaria": "Registrar una referencia verificable de la organización para este control.",
    "demostracionSugerida": "Describir cómo se verifica el control y su evidencia en la organización."
  },
  {
    "controlId": "GA.5-2",
    "tema": "está difundida la importancia de la eliminación de medios de almacenamientos que ya no serán utilizados.",
    "funciones": [
      "Proteger"
    ],
    "perfiles": [
      "Básico",
      "Estándar",
      "Avanzado"
    ],
    "evidenciaNecesaria": "Registrar una referencia verificable de la organización para este control.",
    "demostracionSugerida": "Describir cómo se verifica el control y su evidencia en la organización."
  },
  {
    "controlId": "CA.1-1",
    "tema": "todos los sistemas requieren autenticación.",
    "funciones": [
      "Proteger"
    ],
    "perfiles": [
      "Básico",
      "Estándar",
      "Avanzado"
    ],
    "evidenciaNecesaria": "Registrar una referencia verificable de la organización para este control.",
    "demostracionSugerida": "Describir cómo se verifica el control y su evidencia en la organización."
  },
  {
    "controlId": "CA.1-2",
    "tema": "el acceso a la red y los sistemas debe realizarse con usuarios nominados.",
    "funciones": [
      "Proteger"
    ],
    "perfiles": [
      "Básico",
      "Estándar",
      "Avanzado"
    ],
    "evidenciaNecesaria": "Registrar una referencia verificable de la organización para este control.",
    "demostracionSugerida": "Describir cómo se verifica el control y su evidencia en la organización."
  },
  {
    "controlId": "CA.1-3",
    "tema": "el uso de usuarios privilegiados se encuentra controlado.",
    "funciones": [
      "Proteger"
    ],
    "perfiles": [
      "Básico",
      "Estándar",
      "Avanzado"
    ],
    "evidenciaNecesaria": "Registrar una referencia verificable de la organización para este control.",
    "demostracionSugerida": "Describir cómo se verifica el control y su evidencia en la organización."
  },
  {
    "controlId": "CA.1-4",
    "tema": "los accesos a aplicaciones se realizan utilizando mecanismos de autenticación seguros.",
    "funciones": [
      "Proteger"
    ],
    "perfiles": [
      "Básico",
      "Estándar",
      "Avanzado"
    ],
    "evidenciaNecesaria": "Registrar una referencia verificable de la organización para este control.",
    "demostracionSugerida": "Describir cómo se verifica el control y su evidencia en la organización."
  },
  {
    "controlId": "CA.1-5",
    "tema": "el uso de usuarios genéricos debe estar fundamentado y autorizado por excepción.",
    "funciones": [
      "Proteger"
    ],
    "perfiles": [
      "Básico",
      "Estándar",
      "Avanzado"
    ],
    "evidenciaNecesaria": "Registrar una referencia verificable de la organización para este control.",
    "demostracionSugerida": "Describir cómo se verifica el control y su evidencia en la organización."
  },
  {
    "controlId": "CA.1-7",
    "tema": "se identifican los casos que requieren autenticación fuerte y se determinan los controles requeridos.",
    "funciones": [
      "Proteger"
    ],
    "perfiles": [
      "Básico",
      "Estándar",
      "Avanzado"
    ],
    "evidenciaNecesaria": "Registrar una referencia verificable de la organización para este control.",
    "demostracionSugerida": "Describir cómo se verifica el control y su evidencia en la organización."
  },
  {
    "controlId": "CA.1-8",
    "tema": "las credenciales de autenticación (contraseñas, certificados, tokens, biometría) están protegidas en reposo y en tránsito mediante mecanismos criptográficos robustos.",
    "funciones": [
      "Proteger"
    ],
    "perfiles": [
      "Básico",
      "Estándar",
      "Avanzado"
    ],
    "evidenciaNecesaria": "Registrar una referencia verificable de la organización para este control.",
    "demostracionSugerida": "Describir cómo se verifica el control y su evidencia en la organización."
  },
  {
    "controlId": "CA.2-1",
    "tema": "la revisión de privilegios se realiza en forma reactiva frente a un cambio o baja, al menos para los sistemas críticos.",
    "funciones": [
      "Proteger"
    ],
    "perfiles": [
      "Básico",
      "Estándar",
      "Avanzado"
    ],
    "evidenciaNecesaria": "Registrar una referencia verificable de la organización para este control.",
    "demostracionSugerida": "Describir cómo se verifica el control y su evidencia en la organización."
  },
  {
    "controlId": "CA.3-1",
    "tema": "se identifican los datos históricos y respaldos que deben ser protegidos mediante mecanismos seguros.",
    "funciones": [
      "Proteger"
    ],
    "perfiles": [
      "Básico",
      "Estándar",
      "Avanzado"
    ],
    "evidenciaNecesaria": "Registrar una referencia verificable de la organización para este control.",
    "demostracionSugerida": "Describir cómo se verifica el control y su evidencia en la organización."
  },
  {
    "controlId": "CA.3-2",
    "tema": "los respaldos y/o datos históricos fuera de línea se almacenan en forma cifrada.",
    "funciones": [
      "Proteger"
    ],
    "perfiles": [
      "Básico",
      "Estándar",
      "Avanzado"
    ],
    "evidenciaNecesaria": "Registrar una referencia verificable de la organización para este control.",
    "demostracionSugerida": "Describir cómo se verifica el control y su evidencia en la organización."
  },
  {
    "controlId": "CA.4-1",
    "tema": "la organización identifica los sistemas y procesos que requieren firma electrónica avanzada.",
    "funciones": [
      "Proteger"
    ],
    "perfiles": [
      "Básico",
      "Estándar",
      "Avanzado"
    ],
    "evidenciaNecesaria": "Registrar una referencia verificable de la organización para este control.",
    "demostracionSugerida": "Describir cómo se verifica el control y su evidencia en la organización."
  },
  {
    "controlId": "CA.4-2",
    "tema": "los sistemas con firma electrónica utilizados por la organización soportan el uso de certificados electrónicos X.509v3 emitidos por prestadores acreditados ante la UCE.",
    "funciones": [
      "Proteger"
    ],
    "perfiles": [
      "Básico",
      "Estándar",
      "Avanzado"
    ],
    "evidenciaNecesaria": "Registrar una referencia verificable de la organización para este control.",
    "demostracionSugerida": "Describir cómo se verifica el control y su evidencia en la organización."
  },
  {
    "controlId": "CA.4-3",
    "tema": "se utilizan protocolos seguros y actualizados, evitando tecnologías criptográficas obsoletas o vulnerables.",
    "funciones": [
      "Proteger"
    ],
    "perfiles": [
      "Básico",
      "Estándar",
      "Avanzado"
    ],
    "evidenciaNecesaria": "Registrar una referencia verificable de la organización para este control.",
    "demostracionSugerida": "Describir cómo se verifica el control y su evidencia en la organización."
  },
  {
    "controlId": "CA.4-4",
    "tema": "deben utilizarse los estándares de codificación de firmas propios de los tipos de documentos firmados (XADES, PDFSignature, etc.).",
    "funciones": [
      "Proteger"
    ],
    "perfiles": [
      "Básico",
      "Estándar",
      "Avanzado"
    ],
    "evidenciaNecesaria": "Registrar una referencia verificable de la organización para este control.",
    "demostracionSugerida": "Describir cómo se verifica el control y su evidencia en la organización."
  },
  {
    "controlId": "CA.4-5",
    "tema": "se debe hacer la validación de certificados a través de OCSP (Online Certificate Status Protocol), CRL (Certificate Revocation List) o equivalente.",
    "funciones": [
      "Proteger"
    ],
    "perfiles": [
      "Básico",
      "Estándar",
      "Avanzado"
    ],
    "evidenciaNecesaria": "Registrar una referencia verificable de la organización para este control.",
    "demostracionSugerida": "Describir cómo se verifica el control y su evidencia en la organización."
  },
  {
    "controlId": "CA.4-6",
    "tema": "la solución incorpora medidas de detección de firmas alteradas o invalidadas, incluyendo trazabilidad del error.",
    "funciones": [
      "Proteger"
    ],
    "perfiles": [
      "Básico",
      "Estándar",
      "Avanzado"
    ],
    "evidenciaNecesaria": "Registrar una referencia verificable de la organización para este control.",
    "demostracionSugerida": "Describir cómo se verifica el control y su evidencia en la organización."
  },
  {
    "controlId": "CA.5-1",
    "tema": "están implementados controles que impiden que un mismo usuario solicite, apruebe y asigne accesos en los sistemas críticos.",
    "funciones": [
      "Proteger"
    ],
    "perfiles": [
      "Básico",
      "Estándar",
      "Avanzado"
    ],
    "evidenciaNecesaria": "Registrar una referencia verificable de la organización para este control.",
    "demostracionSugerida": "Describir cómo se verifica el control y su evidencia en la organización."
  },
  {
    "controlId": "CA.5-2",
    "tema": "la asignación de privilegios es ejecutada por un responsable distinto al que la aprueba.",
    "funciones": [
      "Proteger"
    ],
    "perfiles": [
      "Básico",
      "Estándar",
      "Avanzado"
    ],
    "evidenciaNecesaria": "Registrar una referencia verificable de la organización para este control.",
    "demostracionSugerida": "Describir cómo se verifica el control y su evidencia en la organización."
  },
  {
    "controlId": "CA.6-1",
    "tema": "los derechos de acceso son otorgados con autorización previa.",
    "funciones": [
      "Proteger"
    ],
    "perfiles": [
      "Básico",
      "Estándar",
      "Avanzado"
    ],
    "evidenciaNecesaria": "Registrar una referencia verificable de la organización para este control.",
    "demostracionSugerida": "Describir cómo se verifica el control y su evidencia en la organización."
  },
  {
    "controlId": "SF.1-1",
    "tema": "están identificadas las áreas que requieren control de acceso físico.",
    "funciones": [
      "Detectar",
      "Proteger"
    ],
    "perfiles": [
      "Básico",
      "Estándar",
      "Avanzado"
    ],
    "evidenciaNecesaria": "Registrar una referencia verificable de la organización para este control.",
    "demostracionSugerida": "Describir cómo se verifica el control y su evidencia en la organización."
  },
  {
    "controlId": "SF.1-2",
    "tema": "están implementados los controles de acceso físico a las instalaciones de los centros de procesamiento de datos.",
    "funciones": [
      "Detectar",
      "Proteger"
    ],
    "perfiles": [
      "Básico",
      "Estándar",
      "Avanzado"
    ],
    "evidenciaNecesaria": "Registrar una referencia verificable de la organización para este control.",
    "demostracionSugerida": "Describir cómo se verifica el control y su evidencia en la organización."
  },
  {
    "controlId": "SF.1-3",
    "tema": "se gestionan (evalúan, autorizan y registran) las autorizaciones de acceso al centro de procesamiento de datos.",
    "funciones": [
      "Detectar",
      "Proteger"
    ],
    "perfiles": [
      "Básico",
      "Estándar",
      "Avanzado"
    ],
    "evidenciaNecesaria": "Registrar una referencia verificable de la organización para este control.",
    "demostracionSugerida": "Describir cómo se verifica el control y su evidencia en la organización."
  },
  {
    "controlId": "SF.2-1",
    "tema": "están identificados los riesgos ambientales que pueden afectar al centro de procesamiento de datos.",
    "funciones": [
      "Proteger"
    ],
    "perfiles": [
      "Básico",
      "Estándar",
      "Avanzado"
    ],
    "evidenciaNecesaria": "Registrar una referencia verificable de la organización para este control.",
    "demostracionSugerida": "Describir cómo se verifica el control y su evidencia en la organización."
  },
  {
    "controlId": "SF.2-2",
    "tema": "existen medidas de control del medio ambiente físico en los centros de procesamiento de datos.",
    "funciones": [
      "Proteger"
    ],
    "perfiles": [
      "Básico",
      "Estándar",
      "Avanzado"
    ],
    "evidenciaNecesaria": "Registrar una referencia verificable de la organización para este control.",
    "demostracionSugerida": "Describir cómo se verifica el control y su evidencia en la organización."
  },
  {
    "controlId": "SF.3-1",
    "tema": "se monitorea de forma reactiva o esporádica los sistemas o servicios más críticos.",
    "funciones": [
      "Detectar"
    ],
    "perfiles": [
      "Básico",
      "Estándar",
      "Avanzado"
    ],
    "evidenciaNecesaria": "Registrar una referencia verificable de la organización para este control.",
    "demostracionSugerida": "Describir cómo se verifica el control y su evidencia en la organización."
  },
  {
    "controlId": "SF.3-2",
    "tema": "se registran los logs de las fallas y alertas críticas, y se conserva su historial para revisión.",
    "funciones": [
      "Detectar"
    ],
    "perfiles": [
      "Básico",
      "Estándar",
      "Avanzado"
    ],
    "evidenciaNecesaria": "Registrar una referencia verificable de la organización para este control.",
    "demostracionSugerida": "Describir cómo se verifica el control y su evidencia en la organización."
  },
  {
    "controlId": "SF.4-1",
    "tema": "todos los dispositivos con información sensible disponen de barreras físicas que impiden su extracción o manipulación no autorizada (cerraduras, tapas de seguridad, sensores de apertura, etc.).",
    "funciones": [
      "Proteger"
    ],
    "perfiles": [
      "Básico",
      "Estándar",
      "Avanzado"
    ],
    "evidenciaNecesaria": "Registrar una referencia verificable de la organización para este control.",
    "demostracionSugerida": "Describir cómo se verifica el control y su evidencia en la organización."
  },
  {
    "controlId": "SF.4-2",
    "tema": "al recibir equipos nuevos se inspeccionan, y documenta el estado de los sellos o empaques de fábrica, registrando cualquier indicio de apertura o daño.",
    "funciones": [
      "Identificar"
    ],
    "perfiles": [
      "Básico",
      "Estándar",
      "Avanzado"
    ],
    "evidenciaNecesaria": "Registrar una referencia verificable de la organización para este control.",
    "demostracionSugerida": "Describir cómo se verifica el control y su evidencia en la organización."
  },
  {
    "controlId": "SF.4-5",
    "tema": "los dispositivos de usuario final están configurados para bloquear automáticamente la sesión tras un máximo de 15 minutos, o menos, de inactividad.",
    "funciones": [
      "Proteger"
    ],
    "perfiles": [
      "Básico",
      "Estándar",
      "Avanzado"
    ],
    "evidenciaNecesaria": "Registrar una referencia verificable de la organización para este control.",
    "demostracionSugerida": "Describir cómo se verifica el control y su evidencia en la organización."
  },
  {
    "controlId": "SF.4-6",
    "tema": "se implementa el cierre automático de sesión después de 30 minutos sin actividad, o menos, en los dispositivos de usuario final.",
    "funciones": [
      "Proteger"
    ],
    "perfiles": [
      "Básico",
      "Estándar",
      "Avanzado"
    ],
    "evidenciaNecesaria": "Registrar una referencia verificable de la organización para este control.",
    "demostracionSugerida": "Describir cómo se verifica el control y su evidencia en la organización."
  },
  {
    "controlId": "SF.5-1",
    "tema": "se gestiona y/o realiza el mantenimiento sobre los activos del centro de procesamiento de datos.",
    "funciones": [
      "Proteger"
    ],
    "perfiles": [
      "Básico",
      "Estándar",
      "Avanzado"
    ],
    "evidenciaNecesaria": "Registrar una referencia verificable de la organización para este control.",
    "demostracionSugerida": "Describir cómo se verifica el control y su evidencia en la organización."
  },
  {
    "controlId": "SF.5-2",
    "tema": "se aprueba el alta y baja de los usuarios que realizan mantenimiento de forma remota a los activos informáticos del centro de procesamiento de datos.",
    "funciones": [
      "Proteger"
    ],
    "perfiles": [
      "Básico",
      "Estándar",
      "Avanzado"
    ],
    "evidenciaNecesaria": "Registrar una referencia verificable de la organización para este control.",
    "demostracionSugerida": "Describir cómo se verifica el control y su evidencia en la organización."
  },
  {
    "controlId": "SO.1-1",
    "tema": "el software de base y aplicaciones críticas se encuentran actualizados a versiones sin vulnerabilidades críticas.",
    "funciones": [
      "Identificar"
    ],
    "perfiles": [
      "Básico",
      "Estándar",
      "Avanzado"
    ],
    "evidenciaNecesaria": "Registrar una referencia verificable de la organización para este control.",
    "demostracionSugerida": "Describir cómo se verifica el control y su evidencia en la organización."
  },
  {
    "controlId": "SO.1-2",
    "tema": "se tienen identificados aquellos activos que por su tecnología no pueden ser actualizados, detallando los controles compensatorios implementados.",
    "funciones": [
      "Identificar"
    ],
    "perfiles": [
      "Básico",
      "Estándar",
      "Avanzado"
    ],
    "evidenciaNecesaria": "Registrar una referencia verificable de la organización para este control.",
    "demostracionSugerida": "Describir cómo se verifica el control y su evidencia en la organización."
  },
  {
    "controlId": "SO.2-1",
    "tema": "se han establecido mecanismos para comunicar los cambios en el ámbito tecnológico a las partes interesadas.",
    "funciones": [
      "Identificar",
      "Proteger"
    ],
    "perfiles": [
      "Básico",
      "Estándar",
      "Avanzado"
    ],
    "evidenciaNecesaria": "Registrar una referencia verificable de la organización para este control.",
    "demostracionSugerida": "Describir cómo se verifica el control y su evidencia en la organización."
  },
  {
    "controlId": "SO.2-2",
    "tema": "los cambios tecnológicos son previamente autorizados por los responsables de los activos.",
    "funciones": [
      "Identificar",
      "Proteger"
    ],
    "perfiles": [
      "Básico",
      "Estándar",
      "Avanzado"
    ],
    "evidenciaNecesaria": "Registrar una referencia verificable de la organización para este control.",
    "demostracionSugerida": "Describir cómo se verifica el control y su evidencia en la organización."
  },
  {
    "controlId": "SO.3-1",
    "tema": "la capacidad actual instalada es suficiente para garantizar la prestación de los servicios críticos.",
    "funciones": [
      "Gobernar",
      "Proteger"
    ],
    "perfiles": [
      "Básico",
      "Estándar",
      "Avanzado"
    ],
    "evidenciaNecesaria": "Registrar una referencia verificable de la organización para este control.",
    "demostracionSugerida": "Describir cómo se verifica el control y su evidencia en la organización."
  },
  {
    "controlId": "SO.3-2",
    "tema": "ante eventos de saturación o cuellos de botella se toman medidas ad-hoc para restaurar la capacidad operativa.",
    "funciones": [
      "Proteger"
    ],
    "perfiles": [
      "Básico",
      "Estándar",
      "Avanzado"
    ],
    "evidenciaNecesaria": "Registrar una referencia verificable de la organización para este control.",
    "demostracionSugerida": "Describir cómo se verifica el control y su evidencia en la organización."
  },
  {
    "controlId": "SO.3-3",
    "tema": "se toman en cuenta las necesidades del negocio al momento de dimensionar los servicios críticos.",
    "funciones": [
      "Proteger"
    ],
    "perfiles": [
      "Básico",
      "Estándar",
      "Avanzado"
    ],
    "evidenciaNecesaria": "Registrar una referencia verificable de la organización para este control.",
    "demostracionSugerida": "Describir cómo se verifica el control y su evidencia en la organización."
  },
  {
    "controlId": "SO.3-4",
    "tema": "se realizan mediciones objetivas para detectar problemas de capacidad.",
    "funciones": [
      "Proteger"
    ],
    "perfiles": [
      "Básico",
      "Estándar",
      "Avanzado"
    ],
    "evidenciaNecesaria": "Registrar una referencia verificable de la organización para este control.",
    "demostracionSugerida": "Describir cómo se verifica el control y su evidencia en la organización."
  },
  {
    "controlId": "SO.4-1",
    "tema": "el entorno de producción se encuentra separado del resto de los entornos.",
    "funciones": [
      "Proteger"
    ],
    "perfiles": [
      "Básico",
      "Estándar",
      "Avanzado"
    ],
    "evidenciaNecesaria": "Registrar una referencia verificable de la organización para este control.",
    "demostracionSugerida": "Describir cómo se verifica el control y su evidencia en la organización."
  },
  {
    "controlId": "SO.5-1",
    "tema": "todos los equipos del personal cuentan con solución antimalware.",
    "funciones": [
      "Detectar"
    ],
    "perfiles": [
      "Básico",
      "Estándar",
      "Avanzado"
    ],
    "evidenciaNecesaria": "Registrar una referencia verificable de la organización para este control.",
    "demostracionSugerida": "Describir cómo se verifica el control y su evidencia en la organización."
  },
  {
    "controlId": "SO.5-2",
    "tema": "las soluciones a los problemas detectados se realizan en forma ad-hoc.",
    "funciones": [
      "Detectar"
    ],
    "perfiles": [
      "Básico",
      "Estándar",
      "Avanzado"
    ],
    "evidenciaNecesaria": "Registrar una referencia verificable de la organización para este control.",
    "demostracionSugerida": "Describir cómo se verifica el control y su evidencia en la organización."
  },
  {
    "controlId": "SO.6-1",
    "tema": "se realizan respaldos periódicos de al menos los activos de información del centro de procesamiento de datos (aplicaciones, bases de datos, máquinas virtuales, etc.).",
    "funciones": [
      "Proteger",
      "Recuperar"
    ],
    "perfiles": [
      "Básico",
      "Estándar",
      "Avanzado"
    ],
    "evidenciaNecesaria": "Registrar una referencia verificable de la organización para este control.",
    "demostracionSugerida": "Describir cómo se verifica el control y su evidencia en la organización."
  },
  {
    "controlId": "SO.6-2",
    "tema": "los respaldos se almacenan en lugares seguros y con acceso restringido.",
    "funciones": [
      "Proteger"
    ],
    "perfiles": [
      "Básico",
      "Estándar",
      "Avanzado"
    ],
    "evidenciaNecesaria": "Registrar una referencia verificable de la organización para este control.",
    "demostracionSugerida": "Describir cómo se verifica el control y su evidencia en la organización."
  },
  {
    "controlId": "SO.6-3",
    "tema": "se establece el grado (completo, diferencial, etc.) y los requisitos de retención de los respaldos.",
    "funciones": [
      "Proteger"
    ],
    "perfiles": [
      "Básico",
      "Estándar",
      "Avanzado"
    ],
    "evidenciaNecesaria": "Registrar una referencia verificable de la organización para este control.",
    "demostracionSugerida": "Describir cómo se verifica el control y su evidencia en la organización."
  },
  {
    "controlId": "SO.6-4",
    "tema": "los respaldos son probados regularmente.",
    "funciones": [
      "Proteger",
      "Recuperar"
    ],
    "perfiles": [
      "Básico",
      "Estándar",
      "Avanzado"
    ],
    "evidenciaNecesaria": "Registrar una referencia verificable de la organización para este control.",
    "demostracionSugerida": "Describir cómo se verifica el control y su evidencia en la organización."
  },
  {
    "controlId": "SO.6-5",
    "tema": "los respaldos se almacenan en medios inmutables o fuera de línea, para evitar posibles compromisos de ransomware.",
    "funciones": [
      "Proteger"
    ],
    "perfiles": [
      "Básico",
      "Estándar",
      "Avanzado"
    ],
    "evidenciaNecesaria": "Registrar una referencia verificable de la organización para este control.",
    "demostracionSugerida": "Describir cómo se verifica el control y su evidencia en la organización."
  },
  {
    "controlId": "SO.7-1",
    "tema": "están configurados los registros de auditoría y eventos para todos los sistemas definidos como críticos.",
    "funciones": [
      "Detectar",
      "Proteger"
    ],
    "perfiles": [
      "Básico",
      "Estándar",
      "Avanzado"
    ],
    "evidenciaNecesaria": "Registrar una referencia verificable de la organización para este control.",
    "demostracionSugerida": "Describir cómo se verifica el control y su evidencia en la organización."
  },
  {
    "controlId": "SO.7-2",
    "tema": "se analiza el impacto de los eventos que afectan a los sistemas y servicios más críticos, dentro o fuera del centro de procesamiento de datos.",
    "funciones": [
      "Detectar"
    ],
    "perfiles": [
      "Básico",
      "Estándar",
      "Avanzado"
    ],
    "evidenciaNecesaria": "Registrar una referencia verificable de la organización para este control.",
    "demostracionSugerida": "Describir cómo se verifica el control y su evidencia en la organización."
  },
  {
    "controlId": "SO.7-3",
    "tema": "existe personal con tareas asignadas para la detección de eventos a nivel de sistemas base y de protección perimetral.",
    "funciones": [
      "Detectar"
    ],
    "perfiles": [
      "Básico",
      "Estándar",
      "Avanzado"
    ],
    "evidenciaNecesaria": "Registrar una referencia verificable de la organización para este control.",
    "demostracionSugerida": "Describir cómo se verifica el control y su evidencia en la organización."
  },
  {
    "controlId": "SO.8-1",
    "tema": "están definidas las pautas para la instalación de software.",
    "funciones": [
      "Proteger"
    ],
    "perfiles": [
      "Básico",
      "Estándar",
      "Avanzado"
    ],
    "evidenciaNecesaria": "Registrar una referencia verificable de la organización para este control.",
    "demostracionSugerida": "Describir cómo se verifica el control y su evidencia en la organización."
  },
  {
    "controlId": "SO.8-2",
    "tema": "las pautas de instalación de software fueron difundidas al personal.",
    "funciones": [
      "Proteger"
    ],
    "perfiles": [
      "Básico",
      "Estándar",
      "Avanzado"
    ],
    "evidenciaNecesaria": "Registrar una referencia verificable de la organización para este control.",
    "demostracionSugerida": "Describir cómo se verifica el control y su evidencia en la organización."
  },
  {
    "controlId": "SC.6-1",
    "tema": "los nuevos proveedores de servicios deben firmar acuerdos de confidencialidad o no divulgación (NDA) antes del inicio de la relación contractual.",
    "funciones": [
      "Gobernar"
    ],
    "perfiles": [
      "Básico",
      "Estándar",
      "Avanzado"
    ],
    "evidenciaNecesaria": "Registrar una referencia verificable de la organización para este control.",
    "demostracionSugerida": "Describir cómo se verifica el control y su evidencia en la organización."
  },
  {
    "controlId": "SC.6-2",
    "tema": "todo nuevo personal incorporado debe estar cubierto por cláusulas confidencialidad y no divulgación, ya sea en acuerdos, estatuto o normativa interna.",
    "funciones": [
      "Gobernar"
    ],
    "perfiles": [
      "Básico",
      "Estándar",
      "Avanzado"
    ],
    "evidenciaNecesaria": "Registrar una referencia verificable de la organización para este control.",
    "demostracionSugerida": "Describir cómo se verifica el control y su evidencia en la organización."
  },
  {
    "controlId": "SC.6-3",
    "tema": "la obligación de confidencialidad y no divulgación se extiende a todo el personal de la organización, independientemente de su rol o tipo de contratación.",
    "funciones": [
      "Gobernar"
    ],
    "perfiles": [
      "Básico",
      "Estándar",
      "Avanzado"
    ],
    "evidenciaNecesaria": "Registrar una referencia verificable de la organización para este control.",
    "demostracionSugerida": "Describir cómo se verifica el control y su evidencia en la organización."
  },
  {
    "controlId": "SC.6-4",
    "tema": "todos los proveedores que deban acceder a información confidencial de la organización deben tener firmado un acuerdo de no divulgación.",
    "funciones": [
      "Gobernar",
      "Proteger"
    ],
    "perfiles": [
      "Básico",
      "Estándar",
      "Avanzado"
    ],
    "evidenciaNecesaria": "Registrar una referencia verificable de la organización para este control.",
    "demostracionSugerida": "Describir cómo se verifica el control y su evidencia en la organización."
  },
  {
    "controlId": "SC.12-1",
    "tema": "el servicio de Webmail de la organización se implementa exclusivamente sobre el protocolo HTTPS.",
    "funciones": [
      "Proteger"
    ],
    "perfiles": [
      "Básico",
      "Estándar",
      "Avanzado"
    ],
    "evidenciaNecesaria": "Registrar una referencia verificable de la organización para este control.",
    "demostracionSugerida": "Describir cómo se verifica el control y su evidencia en la organización."
  },
  {
    "controlId": "SC.12-2",
    "tema": "el acceso al Webmail institucional está restringido únicamente al servicio provisto por la organización, prohibiendo el acceso a cuentas institucionales desde Webmail externos.",
    "funciones": [
      "Proteger"
    ],
    "perfiles": [
      "Básico",
      "Estándar",
      "Avanzado"
    ],
    "evidenciaNecesaria": "Registrar una referencia verificable de la organización para este control.",
    "demostracionSugerida": "Describir cómo se verifica el control y su evidencia en la organización."
  },
  {
    "controlId": "SC.12-3",
    "tema": "los certificados digitales utilizados para el servicio de Webmail son válidos, vigentes y emitidos por una Autoridad Certificadora de confianza.",
    "funciones": [
      "Proteger"
    ],
    "perfiles": [
      "Básico",
      "Estándar",
      "Avanzado"
    ],
    "evidenciaNecesaria": "Registrar una referencia verificable de la organización para este control.",
    "demostracionSugerida": "Describir cómo se verifica el control y su evidencia en la organización."
  },
  {
    "controlId": "SC.12-4",
    "tema": "las configuraciones del servicio de Webmail bloquean el uso de protocolos inseguros o versiones obsoletas de TLS/SSL.",
    "funciones": [
      "Proteger"
    ],
    "perfiles": [
      "Básico",
      "Estándar",
      "Avanzado"
    ],
    "evidenciaNecesaria": "Registrar una referencia verificable de la organización para este control.",
    "demostracionSugerida": "Describir cómo se verifica el control y su evidencia en la organización."
  },
  {
    "controlId": "SC.13-1",
    "tema": "la red se encuentra segmentada al menos en redes con contacto directo con redes externas (por ejemplo, Internet) y redes privadas de la organización.",
    "funciones": [
      "Proteger"
    ],
    "perfiles": [
      "Básico",
      "Estándar",
      "Avanzado"
    ],
    "evidenciaNecesaria": "Registrar una referencia verificable de la organización para este control.",
    "demostracionSugerida": "Describir cómo se verifica el control y su evidencia en la organización."
  },
  {
    "controlId": "SC.13-2",
    "tema": "están identificados y documentados los principales servicios de red utilizados por la organización.",
    "funciones": [
      "Identificar",
      "Proteger"
    ],
    "perfiles": [
      "Básico",
      "Estándar",
      "Avanzado"
    ],
    "evidenciaNecesaria": "Registrar una referencia verificable de la organización para este control.",
    "demostracionSugerida": "Describir cómo se verifica el control y su evidencia en la organización."
  },
  {
    "controlId": "SC.13-3",
    "tema": "se mantiene un inventario actualizado de las interconexiones con otras entidades.",
    "funciones": [
      "Proteger"
    ],
    "perfiles": [
      "Básico",
      "Estándar",
      "Avanzado"
    ],
    "evidenciaNecesaria": "Registrar una referencia verificable de la organización para este control.",
    "demostracionSugerida": "Describir cómo se verifica el control y su evidencia en la organización."
  },
  {
    "controlId": "SC.14-1",
    "tema": "se implementan controles criptográficos para proteger los datos en tránsito.",
    "funciones": [
      "Proteger"
    ],
    "perfiles": [
      "Básico",
      "Estándar",
      "Avanzado"
    ],
    "evidenciaNecesaria": "Registrar una referencia verificable de la organización para este control.",
    "demostracionSugerida": "Describir cómo se verifica el control y su evidencia en la organización."
  },
  {
    "controlId": "SC.14-2",
    "tema": "los datos en tránsito de todas las aplicaciones y sistemas se encuentran protegidos mediante un mismo conjunto reducido de tecnologías y prácticas criptográficas.",
    "funciones": [
      "Proteger"
    ],
    "perfiles": [
      "Básico",
      "Estándar",
      "Avanzado"
    ],
    "evidenciaNecesaria": "Registrar una referencia verificable de la organización para este control.",
    "demostracionSugerida": "Describir cómo se verifica el control y su evidencia en la organización."
  },
  {
    "controlId": "SC.15-1",
    "tema": "existe un inventario de sitios Web institucionales.",
    "funciones": [
      "Identificar"
    ],
    "perfiles": [
      "Básico",
      "Estándar",
      "Avanzado"
    ],
    "evidenciaNecesaria": "Registrar una referencia verificable de la organización para este control.",
    "demostracionSugerida": "Describir cómo se verifica el control y su evidencia en la organización."
  },
  {
    "controlId": "SC.15-2",
    "tema": "todas las aplicaciones Web disponibles en Internet se encuentran protegidas mediante el uso de WAF, al menos configurados en modo “detección”.",
    "funciones": [
      "Detectar"
    ],
    "perfiles": [
      "Básico",
      "Estándar",
      "Avanzado"
    ],
    "evidenciaNecesaria": "Registrar una referencia verificable de la organización para este control.",
    "demostracionSugerida": "Describir cómo se verifica el control y su evidencia en la organización."
  },
  {
    "controlId": "AD.1-1",
    "tema": "se cuenta con lineamientos generales para el desarrollo de los sistemas incluyendo principios básicos de la gestión de proyectos.",
    "funciones": [
      "Proteger"
    ],
    "perfiles": [
      "Básico",
      "Estándar",
      "Avanzado"
    ],
    "evidenciaNecesaria": "Registrar una referencia verificable de la organización para este control.",
    "demostracionSugerida": "Describir cómo se verifica el control y su evidencia en la organización."
  },
  {
    "controlId": "AD.2-1",
    "tema": "se cuenta con lineamientos generales para la adquisición de sistemas o servicios de tecnología.",
    "funciones": [
      "Gobernar"
    ],
    "perfiles": [
      "Básico",
      "Estándar",
      "Avanzado"
    ],
    "evidenciaNecesaria": "Registrar una referencia verificable de la organización para este control.",
    "demostracionSugerida": "Describir cómo se verifica el control y su evidencia en la organización."
  },
  {
    "controlId": "AD.2-2",
    "tema": "los requisitos de seguridad de la información se incluyen en las solicitudes y evaluaciones de compra.",
    "funciones": [
      "Gobernar",
      "Identificar"
    ],
    "perfiles": [
      "Básico",
      "Estándar",
      "Avanzado"
    ],
    "evidenciaNecesaria": "Registrar una referencia verificable de la organización para este control.",
    "demostracionSugerida": "Describir cómo se verifica el control y su evidencia en la organización."
  },
  {
    "controlId": "RP.1-1",
    "tema": "se identifican todos los participantes de la cadena de suministro relacionados con los activos y servicios críticos, incluyendo un punto de contacto operativo designado por cada proveedor.",
    "funciones": [
      "Gobernar",
      "Identificar"
    ],
    "perfiles": [
      "Básico",
      "Estándar",
      "Avanzado"
    ],
    "evidenciaNecesaria": "Registrar una referencia verificable de la organización para este control.",
    "demostracionSugerida": "Describir cómo se verifica el control y su evidencia en la organización."
  },
  {
    "controlId": "RP.1-2",
    "tema": "se cuenta con acuerdos de nivel de servicio (SLA) firmados con proveedores que prestan servicios críticos.",
    "funciones": [
      "Gobernar",
      "Identificar"
    ],
    "perfiles": [
      "Básico",
      "Estándar",
      "Avanzado"
    ],
    "evidenciaNecesaria": "Registrar una referencia verificable de la organización para este control.",
    "demostracionSugerida": "Describir cómo se verifica el control y su evidencia en la organización."
  },
  {
    "controlId": "RP.2-1",
    "tema": "se definen métricas e indicadores para el seguimiento y control de los proveedores, mínimamente para los proveedores críticos.",
    "funciones": [
      "Detectar",
      "Gobernar"
    ],
    "perfiles": [
      "Básico",
      "Estándar",
      "Avanzado"
    ],
    "evidenciaNecesaria": "Registrar una referencia verificable de la organización para este control.",
    "demostracionSugerida": "Describir cómo se verifica el control y su evidencia en la organización."
  },
  {
    "controlId": "GI.1-1",
    "tema": "se encuentran identificados los puntos de contacto inicial para la recepción de eventos de seguridad.",
    "funciones": [
      "Gobernar",
      "Responder"
    ],
    "perfiles": [
      "Básico",
      "Estándar",
      "Avanzado"
    ],
    "evidenciaNecesaria": "Registrar una referencia verificable de la organización para este control.",
    "demostracionSugerida": "Describir cómo se verifica el control y su evidencia en la organización."
  },
  {
    "controlId": "GI.2-1",
    "tema": "los eventos anómalos o potencialmente anómalos se comunican a referentes con capacidad de decisión y articulación de respuestas.",
    "funciones": [
      "Detectar",
      "Responder"
    ],
    "perfiles": [
      "Básico",
      "Estándar",
      "Avanzado"
    ],
    "evidenciaNecesaria": "Registrar una referencia verificable de la organización para este control.",
    "demostracionSugerida": "Describir cómo se verifica el control y su evidencia en la organización."
  },
  {
    "controlId": "GI.2-2",
    "tema": "se han definido lineamientos para la categorización de los incidentes según su tipo y criticidad.",
    "funciones": [
      "Detectar",
      "Responder"
    ],
    "perfiles": [
      "Básico",
      "Estándar",
      "Avanzado"
    ],
    "evidenciaNecesaria": "Registrar una referencia verificable de la organización para este control.",
    "demostracionSugerida": "Describir cómo se verifica el control y su evidencia en la organización."
  },
  {
    "controlId": "GI.3-1",
    "tema": "los incidentes de seguridad informática se reportan al CERTuy y/o al equipo de respuesta que corresponda de acuerdo a los criterios establecidos por éste.",
    "funciones": [
      "Responder"
    ],
    "perfiles": [
      "Básico",
      "Estándar",
      "Avanzado"
    ],
    "evidenciaNecesaria": "Registrar una referencia verificable de la organización para este control.",
    "demostracionSugerida": "Describir cómo se verifica el control y su evidencia en la organización."
  },
  {
    "controlId": "GI.3-2",
    "tema": "los incidentes de seguridad que involucre datos personales son reportados a la Unidad Reguladora y de Control de Datos Personales (URCDP), conforme a los plazos y requisitos establecidos por la normativa vigente.",
    "funciones": [
      "Responder"
    ],
    "perfiles": [
      "Básico",
      "Estándar",
      "Avanzado"
    ],
    "evidenciaNecesaria": "Registrar una referencia verificable de la organización para este control.",
    "demostracionSugerida": "Describir cómo se verifica el control y su evidencia en la organización."
  },
  {
    "controlId": "GI.3-3",
    "tema": "los incidentes de seguridad que pueda corresponder a un delito son denunciados ante la Dirección General de Cibercrimen.",
    "funciones": [
      "Responder"
    ],
    "perfiles": [
      "Básico",
      "Estándar",
      "Avanzado"
    ],
    "evidenciaNecesaria": "Registrar una referencia verificable de la organización para este control.",
    "demostracionSugerida": "Describir cómo se verifica el control y su evidencia en la organización."
  },
  {
    "controlId": "GI.3-4",
    "tema": "se lleva un registro de las comunicaciones realizadas ante incidentes, incluyendo hora, contenido y destinatarios.",
    "funciones": [
      "Responder"
    ],
    "perfiles": [
      "Básico",
      "Estándar",
      "Avanzado"
    ],
    "evidenciaNecesaria": "Registrar una referencia verificable de la organización para este control.",
    "demostracionSugerida": "Describir cómo se verifica el control y su evidencia en la organización."
  },
  {
    "controlId": "GI.4-1",
    "tema": "los incidentes de seguridad se reportan internamente de acuerdo a lineamientos preestablecidos.",
    "funciones": [
      "Gobernar",
      "Responder"
    ],
    "perfiles": [
      "Básico",
      "Estándar",
      "Avanzado"
    ],
    "evidenciaNecesaria": "Registrar una referencia verificable de la organización para este control.",
    "demostracionSugerida": "Describir cómo se verifica el control y su evidencia en la organización."
  },
  {
    "controlId": "GI.4-2",
    "tema": "el personal ha sido instruido sobre los mecanismos y canales habilitados para reportar incidentes.",
    "funciones": [
      "Gobernar",
      "Responder"
    ],
    "perfiles": [
      "Básico",
      "Estándar",
      "Avanzado"
    ],
    "evidenciaNecesaria": "Registrar una referencia verificable de la organización para este control.",
    "demostracionSugerida": "Describir cómo se verifica el control y su evidencia en la organización."
  },
  {
    "controlId": "GI.4-3",
    "tema": "los incidentes son registrados.",
    "funciones": [
      "Responder"
    ],
    "perfiles": [
      "Básico",
      "Estándar",
      "Avanzado"
    ],
    "evidenciaNecesaria": "Registrar una referencia verificable de la organización para este control.",
    "demostracionSugerida": "Describir cómo se verifica el control y su evidencia en la organización."
  },
  {
    "controlId": "GI.5-1",
    "tema": "se han definido los mecanismos de respuesta a incidentes.",
    "funciones": [
      "Recuperar",
      "Responder"
    ],
    "perfiles": [
      "Básico",
      "Estándar",
      "Avanzado"
    ],
    "evidenciaNecesaria": "Registrar una referencia verificable de la organización para este control.",
    "demostracionSugerida": "Describir cómo se verifica el control y su evidencia en la organización."
  },
  {
    "controlId": "GI.5-2",
    "tema": "los incidentes son atendidos y se aplican medidas para mitigar sus consecuencias.",
    "funciones": [
      "Responder"
    ],
    "perfiles": [
      "Básico",
      "Estándar",
      "Avanzado"
    ],
    "evidenciaNecesaria": "Registrar una referencia verificable de la organización para este control.",
    "demostracionSugerida": "Describir cómo se verifica el control y su evidencia en la organización."
  },
  {
    "controlId": "GI.6-1",
    "tema": "se cuenta con un mecanismo para identificar, registrar y analizar lecciones aprendidas de los incidentes de seguridad de la información en el centro de procesamiento de datos.",
    "funciones": [
      "Identificar",
      "Recuperar"
    ],
    "perfiles": [
      "Básico",
      "Estándar",
      "Avanzado"
    ],
    "evidenciaNecesaria": "Registrar una referencia verificable de la organización para este control.",
    "demostracionSugerida": "Describir cómo se verifica el control y su evidencia en la organización."
  },
  {
    "controlId": "CO.1-1",
    "tema": "el centro de procesamiento de datos cuenta con UPS y componentes redundantes en lo que refiere a conexión eléctrica.",
    "funciones": [
      "Proteger"
    ],
    "perfiles": [
      "Básico",
      "Estándar",
      "Avanzado"
    ],
    "evidenciaNecesaria": "Registrar una referencia verificable de la organización para este control.",
    "demostracionSugerida": "Describir cómo se verifica el control y su evidencia en la organización."
  },
  {
    "controlId": "CO.1-2",
    "tema": "el centro de procesamiento de datos cuenta con componentes redundantes de acondicionamiento térmico.",
    "funciones": [
      "Proteger"
    ],
    "perfiles": [
      "Básico",
      "Estándar",
      "Avanzado"
    ],
    "evidenciaNecesaria": "Registrar una referencia verificable de la organización para este control.",
    "demostracionSugerida": "Describir cómo se verifica el control y su evidencia en la organización."
  },
  {
    "controlId": "CO.2-1",
    "tema": "el centro de procesamiento de datos cuenta con componentes redundantes en lo que refiere a infraestructura de comunicaciones.",
    "funciones": [
      "Proteger"
    ],
    "perfiles": [
      "Básico",
      "Estándar",
      "Avanzado"
    ],
    "evidenciaNecesaria": "Registrar una referencia verificable de la organización para este control.",
    "demostracionSugerida": "Describir cómo se verifica el control y su evidencia en la organización."
  },
  {
    "controlId": "CO.4-1",
    "tema": "se cuenta con ciertas medidas de contingencia y recuperación para los sistemas que dan soporte a los servicios críticos.",
    "funciones": [
      "Recuperar"
    ],
    "perfiles": [
      "Básico",
      "Estándar",
      "Avanzado"
    ],
    "evidenciaNecesaria": "Registrar una referencia verificable de la organización para este control.",
    "demostracionSugerida": "Describir cómo se verifica el control y su evidencia en la organización."
  },
  {
    "controlId": "CO.4-2",
    "tema": "están identificados un conjunto de amenazas que podrían afectar la continuidad operativa.",
    "funciones": [
      "Recuperar"
    ],
    "perfiles": [
      "Básico",
      "Estándar",
      "Avanzado"
    ],
    "evidenciaNecesaria": "Registrar una referencia verificable de la organización para este control.",
    "demostracionSugerida": "Describir cómo se verifica el control y su evidencia en la organización."
  },
  {
    "controlId": "CO.4-3",
    "tema": "existen respaldos de información de los sistemas que dan soporte a los servicios críticos.",
    "funciones": [
      "Recuperar",
      "Responder"
    ],
    "perfiles": [
      "Básico",
      "Estándar",
      "Avanzado"
    ],
    "evidenciaNecesaria": "Registrar una referencia verificable de la organización para este control.",
    "demostracionSugerida": "Describir cómo se verifica el control y su evidencia en la organización."
  },
  {
    "controlId": "CO.4-5",
    "tema": "se ha identificado el orden de prelación para la recuperación en base a la dependencia de los servicios.",
    "funciones": [
      "Recuperar",
      "Responder"
    ],
    "perfiles": [
      "Básico",
      "Estándar",
      "Avanzado"
    ],
    "evidenciaNecesaria": "Registrar una referencia verificable de la organización para este control.",
    "demostracionSugerida": "Describir cómo se verifica el control y su evidencia en la organización."
  },
  {
    "controlId": "CO.5-1",
    "tema": "está designado un responsable o equipo para la identificación de métricas de recuperación para procesos críticos.",
    "funciones": [
      "Gobernar",
      "Recuperar"
    ],
    "perfiles": [
      "Básico",
      "Estándar",
      "Avanzado"
    ],
    "evidenciaNecesaria": "Registrar una referencia verificable de la organización para este control.",
    "demostracionSugerida": "Describir cómo se verifica el control y su evidencia en la organización."
  },
  {
    "controlId": "CO.5-2",
    "tema": "se han definido formalmente las ventanas de tiempo máximo soportadas por el negocio sin poder operar (MTD), para cada sistema que soporte un proceso crítico.",
    "funciones": [
      "Gobernar"
    ],
    "perfiles": [
      "Básico",
      "Estándar",
      "Avanzado"
    ],
    "evidenciaNecesaria": "Registrar una referencia verificable de la organización para este control.",
    "demostracionSugerida": "Describir cómo se verifica el control y su evidencia en la organización."
  },
  {
    "controlId": "CO.5-3",
    "tema": "se ha determinado el RTO (Recovery Time Objective) para cada sistema que soporte un proceso crítico.",
    "funciones": [
      "Gobernar",
      "Recuperar"
    ],
    "perfiles": [
      "Básico",
      "Estándar",
      "Avanzado"
    ],
    "evidenciaNecesaria": "Registrar una referencia verificable de la organización para este control.",
    "demostracionSugerida": "Describir cómo se verifica el control y su evidencia en la organización."
  },
  {
    "controlId": "CO.5-4",
    "tema": "se ha definido el RPO (Recovery Point Objective) para cada sistema que soporte un proceso crítico.",
    "funciones": [
      "Gobernar",
      "Recuperar"
    ],
    "perfiles": [
      "Básico",
      "Estándar",
      "Avanzado"
    ],
    "evidenciaNecesaria": "Registrar una referencia verificable de la organización para este control.",
    "demostracionSugerida": "Describir cómo se verifica el control y su evidencia en la organización."
  },
  {
    "controlId": "CO.6-1",
    "tema": "la comunicación externa de las situaciones de crisis o incidentes mayores es llevada a cabo exclusivamente por la Dirección o por quien ésta haya determinado.",
    "funciones": [
      "Recuperar"
    ],
    "perfiles": [
      "Básico",
      "Estándar",
      "Avanzado"
    ],
    "evidenciaNecesaria": "Registrar una referencia verificable de la organización para este control.",
    "demostracionSugerida": "Describir cómo se verifica el control y su evidencia en la organización."
  },
  {
    "controlId": "CO.6-2",
    "tema": "las áreas técnicas pueden realizar comunicaciones externas sólo si cuentan con autorización expresa de la Dirección o por quien ésta haya determinado.",
    "funciones": [
      "Recuperar"
    ],
    "perfiles": [
      "Básico",
      "Estándar",
      "Avanzado"
    ],
    "evidenciaNecesaria": "Registrar una referencia verificable de la organización para este control.",
    "demostracionSugerida": "Describir cómo se verifica el control y su evidencia en la organización."
  },
  {
    "controlId": "CN.1-1",
    "tema": "se identifican los requisitos normativos relacionados a seguridad de la información y ciberseguridad, protección de datos personales, acceso a la información pública, propiedad intelectual, y otras obligaciones legales, contractuales o políticas que resulten exigibles para la organización.",
    "funciones": [
      "Gobernar"
    ],
    "perfiles": [
      "Básico",
      "Estándar",
      "Avanzado"
    ],
    "evidenciaNecesaria": "Registrar una referencia verificable de la organización para este control.",
    "demostracionSugerida": "Describir cómo se verifica el control y su evidencia en la organización."
  },
  {
    "controlId": "CN.2-1",
    "tema": "se han realizado análisis de brechas para detectar el nivel de cumplimiento del presente marco.",
    "funciones": [
      "Identificar"
    ],
    "perfiles": [
      "Básico",
      "Estándar",
      "Avanzado"
    ],
    "evidenciaNecesaria": "Registrar una referencia verificable de la organización para este control.",
    "demostracionSugerida": "Describir cómo se verifica el control y su evidencia en la organización."
  },
  {
    "controlId": "CN.2-2",
    "tema": "en función de las brechas detectadas se elabora un portafolio de proyectos a incluir en el plan de seguridad de la información.",
    "funciones": [
      "Identificar"
    ],
    "perfiles": [
      "Básico",
      "Estándar",
      "Avanzado"
    ],
    "evidenciaNecesaria": "Registrar una referencia verificable de la organización para este control.",
    "demostracionSugerida": "Describir cómo se verifica el control y su evidencia en la organización."
  },
  {
    "controlId": "CN.3-1",
    "tema": "se realizan revisiones puntuales de los sistemas de información con recursos propios o con apoyo externo.",
    "funciones": [
      "Identificar"
    ],
    "perfiles": [
      "Básico",
      "Estándar",
      "Avanzado"
    ],
    "evidenciaNecesaria": "Registrar una referencia verificable de la organización para este control.",
    "demostracionSugerida": "Describir cómo se verifica el control y su evidencia en la organización."
  },
  {
    "controlId": "CN.4-1",
    "tema": "se lleva control del licenciamiento de software de equipos servidores.",
    "funciones": [
      "Identificar"
    ],
    "perfiles": [
      "Básico",
      "Estándar",
      "Avanzado"
    ],
    "evidenciaNecesaria": "Registrar una referencia verificable de la organización para este control.",
    "demostracionSugerida": "Describir cómo se verifica el control y su evidencia en la organización."
  },
  {
    "controlId": "CN.4-2",
    "tema": "se han definido responsables para la gestión del ciclo de vida del licenciamiento, incluyendo adquisición, asignación, renovación y baja.",
    "funciones": [
      "Proteger"
    ],
    "perfiles": [
      "Básico",
      "Estándar",
      "Avanzado"
    ],
    "evidenciaNecesaria": "Registrar una referencia verificable de la organización para este control.",
    "demostracionSugerida": "Describir cómo se verifica el control y su evidencia en la organización."
  },
  {
    "controlId": "CN.4-3",
    "tema": "se lleva control del licenciamiento de software de equipos personales.",
    "funciones": [
      "Identificar"
    ],
    "perfiles": [
      "Básico",
      "Estándar",
      "Avanzado"
    ],
    "evidenciaNecesaria": "Registrar una referencia verificable de la organización para este control.",
    "demostracionSugerida": "Describir cómo se verifica el control y su evidencia en la organización."
  },
  {
    "controlId": "PD.1-1",
    "tema": "se lleva un inventario actualizado de bases de datos personales, incluyendo responsables, categoría de datos y sistemas que las soportan.",
    "funciones": [
      "Gobernar"
    ],
    "perfiles": [
      "Básico",
      "Estándar",
      "Avanzado"
    ],
    "evidenciaNecesaria": "Registrar una referencia verificable de la organización para este control.",
    "demostracionSugerida": "Describir cómo se verifica el control y su evidencia en la organización."
  },
  {
    "controlId": "PD.1-2",
    "tema": "todas las bases de datos que contienen datos personales están registradas ante la URCDP.",
    "funciones": [
      "Gobernar"
    ],
    "perfiles": [
      "Básico",
      "Estándar",
      "Avanzado"
    ],
    "evidenciaNecesaria": "Registrar una referencia verificable de la organización para este control.",
    "demostracionSugerida": "Describir cómo se verifica el control y su evidencia en la organización."
  },
  {
    "controlId": "PD.2-1",
    "tema": "se cuenta con mecanismos para recibir solicitudes expresas de los titulares de corrección manual de datos personales.",
    "funciones": [
      "Gobernar"
    ],
    "perfiles": [
      "Básico",
      "Estándar",
      "Avanzado"
    ],
    "evidenciaNecesaria": "Registrar una referencia verificable de la organización para este control.",
    "demostracionSugerida": "Describir cómo se verifica el control y su evidencia en la organización."
  },
  {
    "controlId": "PD.2-2",
    "tema": "la organización establece qué datos personales son necesarios para cada trámite o servicio, y limita su recolección únicamente a esa información.",
    "funciones": [
      "Gobernar"
    ],
    "perfiles": [
      "Básico",
      "Estándar",
      "Avanzado"
    ],
    "evidenciaNecesaria": "Registrar una referencia verificable de la organización para este control.",
    "demostracionSugerida": "Describir cómo se verifica el control y su evidencia en la organización."
  },
  {
    "controlId": "PD.3-1",
    "tema": "se han eliminado de forma ad-hoc datos personales que ya no eran necesarios para el fin con el que fueron recolectados.",
    "funciones": [
      "Identificar"
    ],
    "perfiles": [
      "Básico",
      "Estándar",
      "Avanzado"
    ],
    "evidenciaNecesaria": "Registrar una referencia verificable de la organización para este control.",
    "demostracionSugerida": "Describir cómo se verifica el control y su evidencia en la organización."
  },
  {
    "controlId": "PD.3-2",
    "tema": "se documenta la finalidad del tratamiento de datos personales en todos los procesos que los recolectan.",
    "funciones": [
      "Identificar"
    ],
    "perfiles": [
      "Básico",
      "Estándar",
      "Avanzado"
    ],
    "evidenciaNecesaria": "Registrar una referencia verificable de la organización para este control.",
    "demostracionSugerida": "Describir cómo se verifica el control y su evidencia en la organización."
  },
  {
    "controlId": "PD.4-1",
    "tema": "cuando corresponde, se incluye una cláusula de consentimiento libre, previa e informada en los medios utilizados para recabar los datos personales (formularios, grabaciones, sitios web, etc.).",
    "funciones": [
      "Gobernar"
    ],
    "perfiles": [
      "Básico",
      "Estándar",
      "Avanzado"
    ],
    "evidenciaNecesaria": "Registrar una referencia verificable de la organización para este control.",
    "demostracionSugerida": "Describir cómo se verifica el control y su evidencia en la organización."
  },
  {
    "controlId": "PD.4-2",
    "tema": "se conservan registros que evidencien el consentimiento otorgado por los titulares, siempre que sea exigido por la normativa.",
    "funciones": [
      "Gobernar"
    ],
    "perfiles": [
      "Básico",
      "Estándar",
      "Avanzado"
    ],
    "evidenciaNecesaria": "Registrar una referencia verificable de la organización para este control.",
    "demostracionSugerida": "Describir cómo se verifica el control y su evidencia en la organización."
  },
  {
    "controlId": "PD.5-1",
    "tema": "se han restringido los accesos a los datos personales mediante usuarios nominados y aplicando el principio de mínimo privilegio.",
    "funciones": [
      "Proteger"
    ],
    "perfiles": [
      "Básico",
      "Estándar",
      "Avanzado"
    ],
    "evidenciaNecesaria": "Registrar una referencia verificable de la organización para este control.",
    "demostracionSugerida": "Describir cómo se verifica el control y su evidencia en la organización."
  },
  {
    "controlId": "PD.5-2",
    "tema": "se han implementado medidas para restringir el acceso no autorizado a documentos físicos que contienen datos personales.",
    "funciones": [
      "Proteger"
    ],
    "perfiles": [
      "Básico",
      "Estándar",
      "Avanzado"
    ],
    "evidenciaNecesaria": "Registrar una referencia verificable de la organización para este control.",
    "demostracionSugerida": "Describir cómo se verifica el control y su evidencia en la organización."
  },
  {
    "controlId": "PD.5-3",
    "tema": "se implementan medidas técnicas y organizativas necesarias para preservar la integridad, confidencialidad y disponibilidad de la información, garantizando así la seguridad de los datos personales.",
    "funciones": [
      "Proteger"
    ],
    "perfiles": [
      "Básico",
      "Estándar",
      "Avanzado"
    ],
    "evidenciaNecesaria": "Registrar una referencia verificable de la organización para este control.",
    "demostracionSugerida": "Describir cómo se verifica el control y su evidencia en la organización."
  },
  {
    "controlId": "PD.5-4",
    "tema": "se mantiene un registro de incidentes de seguridad que involucren datos personales, incluyendo la fecha y tipo de evento.",
    "funciones": [
      "Responder"
    ],
    "perfiles": [
      "Básico",
      "Estándar",
      "Avanzado"
    ],
    "evidenciaNecesaria": "Registrar una referencia verificable de la organización para este control.",
    "demostracionSugerida": "Describir cómo se verifica el control y su evidencia en la organización."
  },
  {
    "controlId": "PD.6-1",
    "tema": "el acceso a datos personales está limitado únicamente a las personas que realizan tareas directamente asociadas con la finalidad específica para la cual dichos datos fueron recabados.",
    "funciones": [
      "Proteger"
    ],
    "perfiles": [
      "Básico",
      "Estándar",
      "Avanzado"
    ],
    "evidenciaNecesaria": "Registrar una referencia verificable de la organización para este control.",
    "demostracionSugerida": "Describir cómo se verifica el control y su evidencia en la organización."
  },
  {
    "controlId": "PD.7-1",
    "tema": "la organización ha definido criterios para incorporar medidas de privacidad por diseño y por defecto en la construcción o mejora de procesos, servicios o sistemas.",
    "funciones": [
      "Identificar"
    ],
    "perfiles": [
      "Básico",
      "Estándar",
      "Avanzado"
    ],
    "evidenciaNecesaria": "Registrar una referencia verificable de la organización para este control.",
    "demostracionSugerida": "Describir cómo se verifica el control y su evidencia en la organización."
  },
  {
    "controlId": "PD.8-1",
    "tema": "se reciben y atienden las solicitudes relacionadas con los derechos sobre datos personales de los usuarios.",
    "funciones": [
      "Gobernar"
    ],
    "perfiles": [
      "Básico",
      "Estándar",
      "Avanzado"
    ],
    "evidenciaNecesaria": "Registrar una referencia verificable de la organización para este control.",
    "demostracionSugerida": "Describir cómo se verifica el control y su evidencia en la organización."
  },
  {
    "controlId": "PD.8-2",
    "tema": "se han gestionado respuestas a solicitudes de titulares dentro del plazo legal.",
    "funciones": [
      "Gobernar"
    ],
    "perfiles": [
      "Básico",
      "Estándar",
      "Avanzado"
    ],
    "evidenciaNecesaria": "Registrar una referencia verificable de la organización para este control.",
    "demostracionSugerida": "Describir cómo se verifica el control y su evidencia en la organización."
  },
  {
    "controlId": "PS.1-4",
    "tema": "la política se encuentra disponible en un sitio accesible.",
    "funciones": [
      "Gobernar"
    ],
    "perfiles": [
      "Estándar",
      "Avanzado"
    ],
    "evidenciaNecesaria": "Registrar una referencia verificable de la organización para este control.",
    "demostracionSugerida": "Describir cómo se verifica el control y su evidencia en la organización."
  },
  {
    "controlId": "OR.1-3",
    "tema": "está designado formalmente el RSI.",
    "funciones": [
      "Gobernar"
    ],
    "perfiles": [
      "Estándar",
      "Avanzado"
    ],
    "evidenciaNecesaria": "Registrar una referencia verificable de la organización para este control.",
    "demostracionSugerida": "Describir cómo se verifica el control y su evidencia en la organización."
  },
  {
    "controlId": "OR.1-4",
    "tema": "las responsabilidades del RSI están documentadas e incluyen: la gestión de seguridad de la información, gestión de incidentes, gestión de riesgos de seguridad, entre otras.",
    "funciones": [
      "Gobernar"
    ],
    "perfiles": [
      "Estándar",
      "Avanzado"
    ],
    "evidenciaNecesaria": "Registrar una referencia verificable de la organización para este control.",
    "demostracionSugerida": "Describir cómo se verifica el control y su evidencia en la organización."
  },
  {
    "controlId": "OR.2-2",
    "tema": "el CSI se reúne periódicamente y documenta dichas reuniones.",
    "funciones": [
      "Gobernar"
    ],
    "perfiles": [
      "Estándar",
      "Avanzado"
    ],
    "evidenciaNecesaria": "Registrar una referencia verificable de la organización para este control.",
    "demostracionSugerida": "Describir cómo se verifica el control y su evidencia en la organización."
  },
  {
    "controlId": "OR.3-3",
    "tema": "el punto de contacto oficial es conocido por todo el personal.",
    "funciones": [
      "Gobernar"
    ],
    "perfiles": [
      "Estándar",
      "Avanzado"
    ],
    "evidenciaNecesaria": "Registrar una referencia verificable de la organización para este control.",
    "demostracionSugerida": "Describir cómo se verifica el control y su evidencia en la organización."
  },
  {
    "controlId": "OR.4-2",
    "tema": "se incluye al RSI o a quien éste designe en la etapa de planificación o inicio de los proyectos.",
    "funciones": [
      "Proteger"
    ],
    "perfiles": [
      "Estándar",
      "Avanzado"
    ],
    "evidenciaNecesaria": "Registrar una referencia verificable de la organización para este control.",
    "demostracionSugerida": "Describir cómo se verifica el control y su evidencia en la organización."
  },
  {
    "controlId": "OR.4-3",
    "tema": "los contratos y pliegos vinculados a los proyectos contemplan cláusulas de seguridad.",
    "funciones": [
      "Proteger"
    ],
    "perfiles": [
      "Estándar",
      "Avanzado"
    ],
    "evidenciaNecesaria": "Registrar una referencia verificable de la organización para este control.",
    "demostracionSugerida": "Describir cómo se verifica el control y su evidencia en la organización."
  },
  {
    "controlId": "PL.1-3",
    "tema": "los objetivos forman parte de un plan de acción de seguridad de la información.",
    "funciones": [
      "Gobernar"
    ],
    "perfiles": [
      "Estándar",
      "Avanzado"
    ],
    "evidenciaNecesaria": "Registrar una referencia verificable de la organización para este control.",
    "demostracionSugerida": "Describir cómo se verifica el control y su evidencia en la organización."
  },
  {
    "controlId": "PL.1-4",
    "tema": "los objetivos están documentados y aprobados por el CSI.",
    "funciones": [
      "Gobernar"
    ],
    "perfiles": [
      "Estándar",
      "Avanzado"
    ],
    "evidenciaNecesaria": "Registrar una referencia verificable de la organización para este control.",
    "demostracionSugerida": "Describir cómo se verifica el control y su evidencia en la organización."
  },
  {
    "controlId": "GR.1-2",
    "tema": "se cuenta con una metodología de evaluación de riesgos de seguridad de la información definida y documentada.",
    "funciones": [
      "Gobernar"
    ],
    "perfiles": [
      "Estándar",
      "Avanzado"
    ],
    "evidenciaNecesaria": "Registrar una referencia verificable de la organización para este control.",
    "demostracionSugerida": "Describir cómo se verifica el control y su evidencia en la organización."
  },
  {
    "controlId": "GR.3-2",
    "tema": "se elaboran planes de tratamiento para los riesgos de seguridad de la información que excedan los niveles de tolerancia definidos por la organización.",
    "funciones": [
      "Gobernar",
      "Identificar"
    ],
    "perfiles": [
      "Estándar",
      "Avanzado"
    ],
    "evidenciaNecesaria": "Registrar una referencia verificable de la organización para este control.",
    "demostracionSugerida": "Describir cómo se verifica el control y su evidencia en la organización."
  },
  {
    "controlId": "GR.3-3",
    "tema": "cada plan de tratamiento identifica las acciones necesarias, el responsable de su ejecución y el plazo previsto.",
    "funciones": [
      "Gobernar",
      "Identificar"
    ],
    "perfiles": [
      "Estándar",
      "Avanzado"
    ],
    "evidenciaNecesaria": "Registrar una referencia verificable de la organización para este control.",
    "demostracionSugerida": "Describir cómo se verifica el control y su evidencia en la organización."
  },
  {
    "controlId": "GR.4-1",
    "tema": "la organización ha identificado y documentado sus fuentes confiables de inteligencia de amenazas, incluyendo al menos CERTuy y fuentes oficiales, comunitarias o sectoriales.",
    "funciones": [
      "Detectar",
      "Identificar"
    ],
    "perfiles": [
      "Estándar",
      "Avanzado"
    ],
    "evidenciaNecesaria": "Registrar una referencia verificable de la organización para este control.",
    "demostracionSugerida": "Describir cómo se verifica el control y su evidencia en la organización."
  },
  {
    "controlId": "GR.4-2",
    "tema": "el personal de seguridad recibe capacitación sobre el uso de inteligencia de amenazas.",
    "funciones": [
      "Detectar",
      "Identificar"
    ],
    "perfiles": [
      "Estándar",
      "Avanzado"
    ],
    "evidenciaNecesaria": "Registrar una referencia verificable de la organización para este control.",
    "demostracionSugerida": "Describir cómo se verifica el control y su evidencia en la organización."
  },
  {
    "controlId": "GR.4-3",
    "tema": "la organización recibe periódicamente información de amenazas a través de sus fuentes confiables, la misma se registra para su posterior análisis.",
    "funciones": [
      "Detectar",
      "Identificar"
    ],
    "perfiles": [
      "Estándar",
      "Avanzado"
    ],
    "evidenciaNecesaria": "Registrar una referencia verificable de la organización para este control.",
    "demostracionSugerida": "Describir cómo se verifica el control y su evidencia en la organización."
  },
  {
    "controlId": "GA.2-3",
    "tema": "los activos que almacenan o procesan información deben estar clasificados de acuerdo con los criterios establecidos en el procedimiento de clasificación.",
    "funciones": [
      "Identificar"
    ],
    "perfiles": [
      "Estándar",
      "Avanzado"
    ],
    "evidenciaNecesaria": "Registrar una referencia verificable de la organización para este control.",
    "demostracionSugerida": "Describir cómo se verifica el control y su evidencia en la organización."
  },
  {
    "controlId": "GA.2-4",
    "tema": "la herramienta de inventario de activos debe permitir registrar, consultar y mantener la clasificación de la información asociada a cada activo.",
    "funciones": [
      "Identificar"
    ],
    "perfiles": [
      "Estándar",
      "Avanzado"
    ],
    "evidenciaNecesaria": "Registrar una referencia verificable de la organización para este control.",
    "demostracionSugerida": "Describir cómo se verifica el control y su evidencia en la organización."
  },
  {
    "controlId": "CA.1-6",
    "tema": "existen pautas definidas para la realización de altas, bajas y modificaciones de acceso lógico que además incluyen aprobaciones.",
    "funciones": [
      "Proteger"
    ],
    "perfiles": [
      "Estándar",
      "Avanzado"
    ],
    "evidenciaNecesaria": "Registrar una referencia verificable de la organización para este control.",
    "demostracionSugerida": "Describir cómo se verifica el control y su evidencia en la organización."
  },
  {
    "controlId": "SF.1-4",
    "tema": "están establecidos perímetros de seguridad en el centro de procesamiento de datos y las áreas seguras.",
    "funciones": [
      "Detectar",
      "Proteger"
    ],
    "perfiles": [
      "Estándar",
      "Avanzado"
    ],
    "evidenciaNecesaria": "Registrar una referencia verificable de la organización para este control.",
    "demostracionSugerida": "Describir cómo se verifica el control y su evidencia en la organización."
  },
  {
    "controlId": "SF.1-5",
    "tema": "están implementados controles de acceso físico para otras áreas definidas como seguras.",
    "funciones": [
      "Detectar",
      "Proteger"
    ],
    "perfiles": [
      "Estándar",
      "Avanzado"
    ],
    "evidenciaNecesaria": "Registrar una referencia verificable de la organización para este control.",
    "demostracionSugerida": "Describir cómo se verifica el control y su evidencia en la organización."
  },
  {
    "controlId": "SF.1-6",
    "tema": "se gestionan (evalúan, autorizan y registran) las autorizaciones de acceso a las áreas definidas como seguras.",
    "funciones": [
      "Detectar",
      "Proteger"
    ],
    "perfiles": [
      "Estándar",
      "Avanzado"
    ],
    "evidenciaNecesaria": "Registrar una referencia verificable de la organización para este control.",
    "demostracionSugerida": "Describir cómo se verifica el control y su evidencia en la organización."
  },
  {
    "controlId": "SF.1-7",
    "tema": "se lleva un registro de accesos físicos al centro de procesamiento de datos y áreas seguras.",
    "funciones": [
      "Detectar",
      "Proteger"
    ],
    "perfiles": [
      "Estándar",
      "Avanzado"
    ],
    "evidenciaNecesaria": "Registrar una referencia verificable de la organización para este control.",
    "demostracionSugerida": "Describir cómo se verifica el control y su evidencia en la organización."
  },
  {
    "controlId": "SF.2-3",
    "tema": "están instalados sistemas de detección y extinción de incendios con mantenimiento periódico.",
    "funciones": [
      "Proteger"
    ],
    "perfiles": [
      "Estándar",
      "Avanzado"
    ],
    "evidenciaNecesaria": "Registrar una referencia verificable de la organización para este control.",
    "demostracionSugerida": "Describir cómo se verifica el control y su evidencia en la organización."
  },
  {
    "controlId": "SF.2-4",
    "tema": "se implementan herramientas automatizadas que apoyan el monitoreo de los controles relacionados al medio ambiente físico.",
    "funciones": [
      "Proteger"
    ],
    "perfiles": [
      "Estándar",
      "Avanzado"
    ],
    "evidenciaNecesaria": "Registrar una referencia verificable de la organización para este control.",
    "demostracionSugerida": "Describir cómo se verifica el control y su evidencia en la organización."
  },
  {
    "controlId": "SF.2-5",
    "tema": "está implementado un sistema de climatización que regula la temperatura y humedad.",
    "funciones": [
      "Proteger"
    ],
    "perfiles": [
      "Estándar",
      "Avanzado"
    ],
    "evidenciaNecesaria": "Registrar una referencia verificable de la organización para este control.",
    "demostracionSugerida": "Describir cómo se verifica el control y su evidencia en la organización."
  },
  {
    "controlId": "SF.3-3",
    "tema": "se monitorea de forma automatizada los activos críticos del centro de procesamiento de datos, generando alertas ante la detección de problemas.",
    "funciones": [
      "Detectar"
    ],
    "perfiles": [
      "Estándar",
      "Avanzado"
    ],
    "evidenciaNecesaria": "Registrar una referencia verificable de la organización para este control.",
    "demostracionSugerida": "Describir cómo se verifica el control y su evidencia en la organización."
  },
  {
    "controlId": "SF.3-4",
    "tema": "existen funciones integradas en los dispositivos que permiten el monitoreo de las amenazas típicas (alimentación eléctrica, enfriamiento, etc.).",
    "funciones": [
      "Detectar"
    ],
    "perfiles": [
      "Estándar",
      "Avanzado"
    ],
    "evidenciaNecesaria": "Registrar una referencia verificable de la organización para este control.",
    "demostracionSugerida": "Describir cómo se verifica el control y su evidencia en la organización."
  },
  {
    "controlId": "SF.3-5",
    "tema": "se definen notificaciones de alertas (correo, SMS, etc.) al personal designado.",
    "funciones": [
      "Detectar"
    ],
    "perfiles": [
      "Estándar",
      "Avanzado"
    ],
    "evidenciaNecesaria": "Registrar una referencia verificable de la organización para este control.",
    "demostracionSugerida": "Describir cómo se verifica el control y su evidencia en la organización."
  },
  {
    "controlId": "SF.4-3",
    "tema": "se deshabilitan los puertos no utilizados (USB, serie, módulos de expansión, etc.) en los dispositivos del centro de procesamiento de datos.",
    "funciones": [
      "Proteger"
    ],
    "perfiles": [
      "Estándar",
      "Avanzado"
    ],
    "evidenciaNecesaria": "Registrar una referencia verificable de la organización para este control.",
    "demostracionSugerida": "Describir cómo se verifica el control y su evidencia en la organización."
  },
  {
    "controlId": "SO.1-3",
    "tema": "está definido un plan documentado para la gestión de las vulnerabilidades y parches.",
    "funciones": [
      "Identificar"
    ],
    "perfiles": [
      "Estándar",
      "Avanzado"
    ],
    "evidenciaNecesaria": "Registrar una referencia verificable de la organización para este control.",
    "demostracionSugerida": "Describir cómo se verifica el control y su evidencia en la organización."
  },
  {
    "controlId": "SO.1-4",
    "tema": "se reciben notificaciones de vulnerabilidades por parte del CERTuy u otras organizaciones y se analizan.",
    "funciones": [
      "Identificar"
    ],
    "perfiles": [
      "Estándar",
      "Avanzado"
    ],
    "evidenciaNecesaria": "Registrar una referencia verificable de la organización para este control.",
    "demostracionSugerida": "Describir cómo se verifica el control y su evidencia en la organización."
  },
  {
    "controlId": "SO.1-5",
    "tema": "las vulnerabilidades son evaluadas, clasificadas, y priorizadas según la criticidad identificada.",
    "funciones": [
      "Identificar"
    ],
    "perfiles": [
      "Estándar",
      "Avanzado"
    ],
    "evidenciaNecesaria": "Registrar una referencia verificable de la organización para este control.",
    "demostracionSugerida": "Describir cómo se verifica el control y su evidencia en la organización."
  },
  {
    "controlId": "SO.4-4",
    "tema": "se evita el uso de datos reales de producción en ambientes de prueba; en caso de ser necesarios, se aplican controles de acceso adecuados al nivel de confidencialidad de la información.",
    "funciones": [
      "Proteger"
    ],
    "perfiles": [
      "Estándar",
      "Avanzado"
    ],
    "evidenciaNecesaria": "Registrar una referencia verificable de la organización para este control.",
    "demostracionSugerida": "Describir cómo se verifica el control y su evidencia en la organización."
  },
  {
    "controlId": "SO.5-3",
    "tema": "los servidores cuentan con una solución antimalware, salvo excepciones justificadas.",
    "funciones": [
      "Detectar"
    ],
    "perfiles": [
      "Estándar",
      "Avanzado"
    ],
    "evidenciaNecesaria": "Registrar una referencia verificable de la organización para este control.",
    "demostracionSugerida": "Describir cómo se verifica el control y su evidencia en la organización."
  },
  {
    "controlId": "SO.5-4",
    "tema": "se encuentran configurados chequeos periódicos en los equipos del personal.",
    "funciones": [
      "Detectar"
    ],
    "perfiles": [
      "Estándar",
      "Avanzado"
    ],
    "evidenciaNecesaria": "Registrar una referencia verificable de la organización para este control.",
    "demostracionSugerida": "Describir cómo se verifica el control y su evidencia en la organización."
  },
  {
    "controlId": "SO.7-4",
    "tema": "se cuenta con herramientas para la centralización de logs.",
    "funciones": [
      "Proteger"
    ],
    "perfiles": [
      "Estándar",
      "Avanzado"
    ],
    "evidenciaNecesaria": "Registrar una referencia verificable de la organización para este control.",
    "demostracionSugerida": "Describir cómo se verifica el control y su evidencia en la organización."
  },
  {
    "controlId": "SO.7-5",
    "tema": "los registros están protegidos contra accesos no autorizados y posibles alteraciones.",
    "funciones": [
      "Detectar",
      "Proteger"
    ],
    "perfiles": [
      "Estándar",
      "Avanzado"
    ],
    "evidenciaNecesaria": "Registrar una referencia verificable de la organización para este control.",
    "demostracionSugerida": "Describir cómo se verifica el control y su evidencia en la organización."
  },
  {
    "controlId": "SO.7-6",
    "tema": "se establecen los umbrales tolerables de los activos (por ejemplo, tiempo de espera tolerable para una aplicación Web).",
    "funciones": [
      "Detectar"
    ],
    "perfiles": [
      "Estándar",
      "Avanzado"
    ],
    "evidenciaNecesaria": "Registrar una referencia verificable de la organización para este control.",
    "demostracionSugerida": "Describir cómo se verifica el control y su evidencia en la organización."
  },
  {
    "controlId": "SO.7-7",
    "tema": "los sistemas que soportan los servicios críticos emiten alertas de eventos de forma independiente, basados en las pautas establecidas por el apetito de riesgo de la organización.",
    "funciones": [
      "Detectar"
    ],
    "perfiles": [
      "Estándar",
      "Avanzado"
    ],
    "evidenciaNecesaria": "Registrar una referencia verificable de la organización para este control.",
    "demostracionSugerida": "Describir cómo se verifica el control y su evidencia en la organización."
  },
  {
    "controlId": "SO.7-10",
    "tema": "se establecen los requisitos de retención de los registros de auditoría.",
    "funciones": [
      "Proteger"
    ],
    "perfiles": [
      "Estándar",
      "Avanzado"
    ],
    "evidenciaNecesaria": "Registrar una referencia verificable de la organización para este control.",
    "demostracionSugerida": "Describir cómo se verifica el control y su evidencia en la organización."
  },
  {
    "controlId": "SO.7-11",
    "tema": "los relojes de todos los sistemas deben estar sincronizados (servidores, aplicaciones, etc.)",
    "funciones": [
      "Proteger"
    ],
    "perfiles": [
      "Estándar",
      "Avanzado"
    ],
    "evidenciaNecesaria": "Registrar una referencia verificable de la organización para este control.",
    "demostracionSugerida": "Describir cómo se verifica el control y su evidencia en la organización."
  },
  {
    "controlId": "SO.8-3",
    "tema": "la posibilidad de instalar software en los equipos queda restringida a los usuarios que se encuentran autorizados para ese fin.",
    "funciones": [
      "Proteger"
    ],
    "perfiles": [
      "Estándar",
      "Avanzado"
    ],
    "evidenciaNecesaria": "Registrar una referencia verificable de la organización para este control.",
    "demostracionSugerida": "Describir cómo se verifica el control y su evidencia en la organización."
  },
  {
    "controlId": "SO.8-4",
    "tema": "se asegura una estricta segregación entre las utilidades del sistema y el software de aplicaciones, limitando el acceso a las utilidades del sistema.",
    "funciones": [
      "Proteger"
    ],
    "perfiles": [
      "Estándar",
      "Avanzado"
    ],
    "evidenciaNecesaria": "Registrar una referencia verificable de la organización para este control.",
    "demostracionSugerida": "Describir cómo se verifica el control y su evidencia en la organización."
  },
  {
    "controlId": "SC.12-6",
    "tema": "se generan alertas ante intentos de acceso no autorizados al Webmail.",
    "funciones": [
      "Detectar"
    ],
    "perfiles": [
      "Estándar",
      "Avanzado"
    ],
    "evidenciaNecesaria": "Registrar una referencia verificable de la organización para este control.",
    "demostracionSugerida": "Describir cómo se verifica el control y su evidencia en la organización."
  },
  {
    "controlId": "SC.15-3",
    "tema": "el WAF de producción ha evolucionado de modo detección a modo bloqueo.",
    "funciones": [
      "Detectar"
    ],
    "perfiles": [
      "Estándar",
      "Avanzado"
    ],
    "evidenciaNecesaria": "Registrar una referencia verificable de la organización para este control.",
    "demostracionSugerida": "Describir cómo se verifica el control y su evidencia en la organización."
  },
  {
    "controlId": "AD.1-2",
    "tema": "se incorporan principios de desarrollo seguro en los proyectos de desarrollo de sistemas.",
    "funciones": [
      "Proteger"
    ],
    "perfiles": [
      "Estándar",
      "Avanzado"
    ],
    "evidenciaNecesaria": "Registrar una referencia verificable de la organización para este control.",
    "demostracionSugerida": "Describir cómo se verifica el control y su evidencia en la organización."
  },
  {
    "controlId": "AD.1-3",
    "tema": "se cuenta con mecanismos para el control de versiones y revisión de código.",
    "funciones": [
      "Proteger"
    ],
    "perfiles": [
      "Estándar",
      "Avanzado"
    ],
    "evidenciaNecesaria": "Registrar una referencia verificable de la organización para este control.",
    "demostracionSugerida": "Describir cómo se verifica el control y su evidencia en la organización."
  },
  {
    "controlId": "AD.1-4",
    "tema": "se sistematizan las actividades de prueba, incluyendo casos de prueba orientados a las validaciones de seguridad.",
    "funciones": [
      "Proteger"
    ],
    "perfiles": [
      "Estándar",
      "Avanzado"
    ],
    "evidenciaNecesaria": "Registrar una referencia verificable de la organización para este control.",
    "demostracionSugerida": "Describir cómo se verifica el control y su evidencia en la organización."
  },
  {
    "controlId": "AD.2-3",
    "tema": "se evalúa la capacidad de los proveedores para cumplir con los requisitos de seguridad antes de la contratación.",
    "funciones": [
      "Gobernar",
      "Identificar"
    ],
    "perfiles": [
      "Estándar",
      "Avanzado"
    ],
    "evidenciaNecesaria": "Registrar una referencia verificable de la organización para este control.",
    "demostracionSugerida": "Describir cómo se verifica el control y su evidencia en la organización."
  },
  {
    "controlId": "RP.1-3",
    "tema": "se implementan mecanismos para identificar y gestionar los riesgos asociados a los participantes de la cadena de suministro que intervienen en los activos y servicios críticos de la organización.",
    "funciones": [
      "Gobernar",
      "Identificar"
    ],
    "perfiles": [
      "Estándar",
      "Avanzado"
    ],
    "evidenciaNecesaria": "Registrar una referencia verificable de la organización para este control.",
    "demostracionSugerida": "Describir cómo se verifica el control y su evidencia en la organización."
  },
  {
    "controlId": "RP.1-4",
    "tema": "los contratos con proveedores críticos deben incluir cláusulas que obliguen a notificar de forma oportuna cualquier incidente de seguridad, confirmado o sospechado, que pueda afectar a la organización.",
    "funciones": [
      "Gobernar"
    ],
    "perfiles": [
      "Estándar",
      "Avanzado"
    ],
    "evidenciaNecesaria": "Registrar una referencia verificable de la organización para este control.",
    "demostracionSugerida": "Describir cómo se verifica el control y su evidencia en la organización."
  },
  {
    "controlId": "RP.1-5",
    "tema": "los contratos deben establecer claramente la responsabilidad del proveedor en la protección de la información de la organización y en la implementación de las medidas de respuesta acordadas.",
    "funciones": [
      "Gobernar"
    ],
    "perfiles": [
      "Estándar",
      "Avanzado"
    ],
    "evidenciaNecesaria": "Registrar una referencia verificable de la organización para este control.",
    "demostracionSugerida": "Describir cómo se verifica el control y su evidencia en la organización."
  },
  {
    "controlId": "RP.2-2",
    "tema": "los contratos y acuerdos con proveedores críticos incluyen cláusulas que permiten su revisión o ajuste en caso de cambios en los servicios prestados, en las tecnologías utilizadas o en las normativas aplicables.",
    "funciones": [
      "Gobernar"
    ],
    "perfiles": [
      "Estándar",
      "Avanzado"
    ],
    "evidenciaNecesaria": "Registrar una referencia verificable de la organización para este control.",
    "demostracionSugerida": "Describir cómo se verifica el control y su evidencia en la organización."
  },
  {
    "controlId": "GI.1-2",
    "tema": "se identifican los potenciales actores internos y externos ante un incidente y se registran sus datos de contacto.",
    "funciones": [
      "Gobernar",
      "Responder"
    ],
    "perfiles": [
      "Estándar",
      "Avanzado"
    ],
    "evidenciaNecesaria": "Registrar una referencia verificable de la organización para este control.",
    "demostracionSugerida": "Describir cómo se verifica el control y su evidencia en la organización."
  },
  {
    "controlId": "GI.1-3",
    "tema": "se cuenta con herramientas que apoyan la gestión de los incidentes.",
    "funciones": [
      "Responder"
    ],
    "perfiles": [
      "Estándar",
      "Avanzado"
    ],
    "evidenciaNecesaria": "Registrar una referencia verificable de la organización para este control.",
    "demostracionSugerida": "Describir cómo se verifica el control y su evidencia en la organización."
  },
  {
    "controlId": "GI.2-3",
    "tema": "está definido cuando una serie de eventos o una notificación conforman un incidente.",
    "funciones": [
      "Detectar",
      "Responder"
    ],
    "perfiles": [
      "Estándar",
      "Avanzado"
    ],
    "evidenciaNecesaria": "Registrar una referencia verificable de la organización para este control.",
    "demostracionSugerida": "Describir cómo se verifica el control y su evidencia en la organización."
  },
  {
    "controlId": "GI.2-4",
    "tema": "está definido cuando una serie de eventos o una notificación conforman un delito conforme la normativa vigente.",
    "funciones": [
      "Detectar",
      "Responder"
    ],
    "perfiles": [
      "Estándar",
      "Avanzado"
    ],
    "evidenciaNecesaria": "Registrar una referencia verificable de la organización para este control.",
    "demostracionSugerida": "Describir cómo se verifica el control y su evidencia en la organización."
  },
  {
    "controlId": "GI.2-5",
    "tema": "los incidentes identificados se clasifican utilizando una escala formal de severidad y criticidad.",
    "funciones": [
      "Detectar",
      "Responder"
    ],
    "perfiles": [
      "Estándar",
      "Avanzado"
    ],
    "evidenciaNecesaria": "Registrar una referencia verificable de la organización para este control.",
    "demostracionSugerida": "Describir cómo se verifica el control y su evidencia en la organización."
  },
  {
    "controlId": "GI.2-6",
    "tema": "están definidas las acciones y tiempos de respuesta asociados a cada categoría según severidad.",
    "funciones": [
      "Detectar",
      "Responder"
    ],
    "perfiles": [
      "Estándar",
      "Avanzado"
    ],
    "evidenciaNecesaria": "Registrar una referencia verificable de la organización para este control.",
    "demostracionSugerida": "Describir cómo se verifica el control y su evidencia en la organización."
  },
  {
    "controlId": "GI.4-4",
    "tema": "los registros de incidentes permiten trazabilidad completa de su evolución, desde la detección hasta el cierre.",
    "funciones": [
      "Detectar",
      "Gobernar",
      "Responder"
    ],
    "perfiles": [
      "Estándar",
      "Avanzado"
    ],
    "evidenciaNecesaria": "Registrar una referencia verificable de la organización para este control.",
    "demostracionSugerida": "Describir cómo se verifica el control y su evidencia en la organización."
  },
  {
    "controlId": "GI.5-3",
    "tema": "ante un incidente de seguridad de la información en la organización, se realiza un análisis forense.",
    "funciones": [
      "Responder"
    ],
    "perfiles": [
      "Estándar",
      "Avanzado"
    ],
    "evidenciaNecesaria": "Registrar una referencia verificable de la organización para este control.",
    "demostracionSugerida": "Describir cómo se verifica el control y su evidencia en la organización."
  },
  {
    "controlId": "GI.5-4",
    "tema": "se han definido pautas establecidas para garantizar la cadena de custodia.",
    "funciones": [
      "Responder"
    ],
    "perfiles": [
      "Estándar",
      "Avanzado"
    ],
    "evidenciaNecesaria": "Registrar una referencia verificable de la organización para este control.",
    "demostracionSugerida": "Describir cómo se verifica el control y su evidencia en la organización."
  },
  {
    "controlId": "CO.1-3",
    "tema": "el centro de procesamiento de datos cuenta con generador eléctrico capaz de alimentar a todos los componentes críticos.",
    "funciones": [
      "Proteger"
    ],
    "perfiles": [
      "Estándar",
      "Avanzado"
    ],
    "evidenciaNecesaria": "Registrar una referencia verificable de la organización para este control.",
    "demostracionSugerida": "Describir cómo se verifica el control y su evidencia en la organización."
  },
  {
    "controlId": "CO.1-4",
    "tema": "los sistemas de climatización del centro de procesamiento de datos están alimentados por líneas de energía respaldadas por el generador eléctrico.",
    "funciones": [
      "Proteger"
    ],
    "perfiles": [
      "Estándar",
      "Avanzado"
    ],
    "evidenciaNecesaria": "Registrar una referencia verificable de la organización para este control.",
    "demostracionSugerida": "Describir cómo se verifica el control y su evidencia en la organización."
  },
  {
    "controlId": "CO.2-2",
    "tema": "la organización dispone de conectividad a internet a través de múltiples enlaces o proveedores.",
    "funciones": [
      "Proteger"
    ],
    "perfiles": [
      "Estándar",
      "Avanzado"
    ],
    "evidenciaNecesaria": "Registrar una referencia verificable de la organización para este control.",
    "demostracionSugerida": "Describir cómo se verifica el control y su evidencia en la organización."
  },
  {
    "controlId": "CO.2-3",
    "tema": "los equipos de red críticos del centro de procesamiento de datos están configurados con mecanismos de detección automática de fallos.",
    "funciones": [
      "Proteger"
    ],
    "perfiles": [
      "Estándar",
      "Avanzado"
    ],
    "evidenciaNecesaria": "Registrar una referencia verificable de la organización para este control.",
    "demostracionSugerida": "Describir cómo se verifica el control y su evidencia en la organización."
  },
  {
    "controlId": "CO.6-3",
    "tema": "se ha comunicado quién es el vocero designado y a través de qué canales debe ser contactado.",
    "funciones": [
      "Recuperar"
    ],
    "perfiles": [
      "Estándar",
      "Avanzado"
    ],
    "evidenciaNecesaria": "Registrar una referencia verificable de la organización para este control.",
    "demostracionSugerida": "Describir cómo se verifica el control y su evidencia en la organización."
  },
  {
    "controlId": "CN.3-2",
    "tema": "se realizan pruebas de intrusión (ethical hacking) de los sistemas críticos de la organización en forma periódica o como parte de un cambio significativo en ellos, con recursos propios o con apoyo externo.",
    "funciones": [
      "Identificar"
    ],
    "perfiles": [
      "Estándar",
      "Avanzado"
    ],
    "evidenciaNecesaria": "Registrar una referencia verificable de la organización para este control.",
    "demostracionSugerida": "Describir cómo se verifica el control y su evidencia en la organización."
  },
  {
    "controlId": "CN.3-3",
    "tema": "el resultado de las pruebas se comunica a las partes interesadas.",
    "funciones": [
      "Identificar"
    ],
    "perfiles": [
      "Estándar",
      "Avanzado"
    ],
    "evidenciaNecesaria": "Registrar una referencia verificable de la organización para este control.",
    "demostracionSugerida": "Describir cómo se verifica el control y su evidencia en la organización."
  },
  {
    "controlId": "PS.1-3",
    "tema": "la política define los responsables de su cumplimiento.",
    "funciones": [
      "Gobernar"
    ],
    "perfiles": [
      "Avanzado"
    ],
    "evidenciaNecesaria": "Registrar una referencia verificable de la organización para este control.",
    "demostracionSugerida": "Describir cómo se verifica el control y su evidencia en la organización."
  },
  {
    "controlId": "OR.5-4",
    "tema": "las pautas de uso son comunicadas al personal y partes interesadas.",
    "funciones": [
      "Proteger"
    ],
    "perfiles": [
      "Avanzado"
    ],
    "evidenciaNecesaria": "Registrar una referencia verificable de la organización para este control.",
    "demostracionSugerida": "Describir cómo se verifica el control y su evidencia en la organización."
  },
  {
    "controlId": "OR.6-2",
    "tema": "se registra cada conexión remota como mínimo: hora, fecha, usuario, activo, etc.",
    "funciones": [
      "Proteger"
    ],
    "perfiles": [
      "Avanzado"
    ],
    "evidenciaNecesaria": "Registrar una referencia verificable de la organización para este control.",
    "demostracionSugerida": "Describir cómo se verifica el control y su evidencia en la organización."
  },
  {
    "controlId": "OR.6-3",
    "tema": "se otorga el acceso remoto con base en una lista blanca de todos los recursos disponibles.",
    "funciones": [
      "Proteger"
    ],
    "perfiles": [
      "Avanzado"
    ],
    "evidenciaNecesaria": "Registrar una referencia verificable de la organización para este control.",
    "demostracionSugerida": "Describir cómo se verifica el control y su evidencia en la organización."
  },
  {
    "controlId": "OR.6-5",
    "tema": "se requiere la aprobación explícita del responsable del activo antes de habilitar el acceso remoto.",
    "funciones": [
      "Proteger"
    ],
    "perfiles": [
      "Avanzado"
    ],
    "evidenciaNecesaria": "Registrar una referencia verificable de la organización para este control.",
    "demostracionSugerida": "Describir cómo se verifica el control y su evidencia en la organización."
  },
  {
    "controlId": "GR.2-2",
    "tema": "Las amenazas, vulnerabilidades y controles existentes en la organización están documentados.",
    "funciones": [
      "Identificar"
    ],
    "perfiles": [
      "Avanzado"
    ],
    "evidenciaNecesaria": "Registrar una referencia verificable de la organización para este control.",
    "demostracionSugerida": "Describir cómo se verifica el control y su evidencia en la organización."
  },
  {
    "controlId": "GR.2-3",
    "tema": "Se cuenta con un inventario de riesgos de seguridad de la información que incluye riesgos asociados a todos los activos de información (se incluyen riesgos positivos).",
    "funciones": [
      "Gobernar",
      "Identificar"
    ],
    "perfiles": [
      "Avanzado"
    ],
    "evidenciaNecesaria": "Registrar una referencia verificable de la organización para este control.",
    "demostracionSugerida": "Describir cómo se verifica el control y su evidencia en la organización."
  },
  {
    "controlId": "GR.2-4",
    "tema": "El apetito de riesgo y la tolerancia al riesgo se ha definido formalmente por el negocio.",
    "funciones": [
      "Gobernar"
    ],
    "perfiles": [
      "Avanzado"
    ],
    "evidenciaNecesaria": "Registrar una referencia verificable de la organización para este control.",
    "demostracionSugerida": "Describir cómo se verifica el control y su evidencia en la organización."
  },
  {
    "controlId": "GR.2-5",
    "tema": "Se incorporan riesgos vinculados a la cadena de suministro.",
    "funciones": [
      "Gobernar"
    ],
    "perfiles": [
      "Avanzado"
    ],
    "evidenciaNecesaria": "Registrar una referencia verificable de la organización para este control.",
    "demostracionSugerida": "Describir cómo se verifica el control y su evidencia en la organización."
  },
  {
    "controlId": "GR.4-4",
    "tema": "están asignados los responsables de recibir, filtrar y analizar la inteligencia de amenazas.",
    "funciones": [
      "Detectar",
      "Identificar"
    ],
    "perfiles": [
      "Avanzado"
    ],
    "evidenciaNecesaria": "Registrar una referencia verificable de la organización para este control.",
    "demostracionSugerida": "Describir cómo se verifica el control y su evidencia en la organización."
  },
  {
    "controlId": "GR.4-5",
    "tema": "se realiza un análisis del impacto potencial de las amenazas emergentes sobre la organización.",
    "funciones": [
      "Detectar",
      "Identificar"
    ],
    "perfiles": [
      "Avanzado"
    ],
    "evidenciaNecesaria": "Registrar una referencia verificable de la organización para este control.",
    "demostracionSugerida": "Describir cómo se verifica el control y su evidencia en la organización."
  },
  {
    "controlId": "GR.4-6",
    "tema": "la inteligencia de amenazas se utiliza como insumo para el análisis de riesgos de seguridad de la información.",
    "funciones": [
      "Detectar",
      "Identificar"
    ],
    "perfiles": [
      "Avanzado"
    ],
    "evidenciaNecesaria": "Registrar una referencia verificable de la organización para este control.",
    "demostracionSugerida": "Describir cómo se verifica el control y su evidencia en la organización."
  },
  {
    "controlId": "GH.1-2",
    "tema": "las responsabilidades del personal respecto a la seguridad de la información están documentadas.",
    "funciones": [
      "Gobernar"
    ],
    "perfiles": [
      "Avanzado"
    ],
    "evidenciaNecesaria": "Registrar una referencia verificable de la organización para este control.",
    "demostracionSugerida": "Describir cómo se verifica el control y su evidencia en la organización."
  },
  {
    "controlId": "GH.1-3",
    "tema": "las responsabilidades en seguridad de la información son comunicadas al personal al momento de su incorporación.",
    "funciones": [
      "Gobernar"
    ],
    "perfiles": [
      "Avanzado"
    ],
    "evidenciaNecesaria": "Registrar una referencia verificable de la organización para este control.",
    "demostracionSugerida": "Describir cómo se verifica el control y su evidencia en la organización."
  },
  {
    "controlId": "GH.3-4",
    "tema": "se realizan actividades de concientización específicas para usuarios privilegiados con cierta periodicidad.",
    "funciones": [
      "Proteger"
    ],
    "perfiles": [
      "Avanzado"
    ],
    "evidenciaNecesaria": "Registrar una referencia verificable de la organización para este control.",
    "demostracionSugerida": "Describir cómo se verifica el control y su evidencia en la organización."
  },
  {
    "controlId": "GH.3-5",
    "tema": "se realizan con cierta periodicidad actividades de concientización para el personal de seguridad de la información.",
    "funciones": [
      "Proteger"
    ],
    "perfiles": [
      "Avanzado"
    ],
    "evidenciaNecesaria": "Registrar una referencia verificable de la organización para este control.",
    "demostracionSugerida": "Describir cómo se verifica el control y su evidencia en la organización."
  },
  {
    "controlId": "GH.3-6",
    "tema": "se realizan actividades de concientización para interesados externos.",
    "funciones": [
      "Proteger"
    ],
    "perfiles": [
      "Avanzado"
    ],
    "evidenciaNecesaria": "Registrar una referencia verificable de la organización para este control.",
    "demostracionSugerida": "Describir cómo se verifica el control y su evidencia en la organización."
  },
  {
    "controlId": "GH.3-7",
    "tema": "la alta gerencia participa de las actividades de concientización.",
    "funciones": [
      "Proteger"
    ],
    "perfiles": [
      "Avanzado"
    ],
    "evidenciaNecesaria": "Registrar una referencia verificable de la organización para este control.",
    "demostracionSugerida": "Describir cómo se verifica el control y su evidencia en la organización."
  },
  {
    "controlId": "GA.1-4",
    "tema": "el inventario de activos físicos debe incluir todos los dispositivos utilizados dentro y fuera del centro de procesamiento de datos, tales como estaciones de trabajo (PCs), dispositivos de almacenamiento extraíble, impresoras, dispositivos de red, entre otros.",
    "funciones": [
      "Identificar"
    ],
    "perfiles": [
      "Avanzado"
    ],
    "evidenciaNecesaria": "Registrar una referencia verificable de la organización para este control.",
    "demostracionSugerida": "Describir cómo se verifica el control y su evidencia en la organización."
  },
  {
    "controlId": "GA.3-4",
    "tema": "se aplican restricciones técnicas o administrativas que limitan acciones no autorizadas sobre los activos, como la instalación de software no autorizado o el cambio de configuraciones críticas.",
    "funciones": [
      "Proteger"
    ],
    "perfiles": [
      "Avanzado"
    ],
    "evidenciaNecesaria": "Registrar una referencia verificable de la organización para este control.",
    "demostracionSugerida": "Describir cómo se verifica el control y su evidencia en la organización."
  },
  {
    "controlId": "GA.4-2",
    "tema": "están identificados y documentados los tipos de medios de almacenamiento externos permitidos para su uso dentro de la organización.",
    "funciones": [
      "Identificar"
    ],
    "perfiles": [
      "Avanzado"
    ],
    "evidenciaNecesaria": "Registrar una referencia verificable de la organización para este control.",
    "demostracionSugerida": "Describir cómo se verifica el control y su evidencia en la organización."
  },
  {
    "controlId": "GA.4-4",
    "tema": "los medios de almacenamiento externo se encuentran inventariados y clasificados según la clasificación de su información y sus características.",
    "funciones": [
      "Identificar"
    ],
    "perfiles": [
      "Avanzado"
    ],
    "evidenciaNecesaria": "Registrar una referencia verificable de la organización para este control.",
    "demostracionSugerida": "Describir cómo se verifica el control y su evidencia en la organización."
  },
  {
    "controlId": "GA.5-3",
    "tema": "están definidos responsables o ubicaciones específicas para la eliminación segura de medios de almacenamiento.",
    "funciones": [
      "Identificar",
      "Proteger"
    ],
    "perfiles": [
      "Avanzado"
    ],
    "evidenciaNecesaria": "Registrar una referencia verificable de la organización para este control.",
    "demostracionSugerida": "Describir cómo se verifica el control y su evidencia en la organización."
  },
  {
    "controlId": "GA.5-4",
    "tema": "están establecidos los criterios para determinar cuándo corresponde la destrucción lógica y/o física de la información.",
    "funciones": [
      "Proteger"
    ],
    "perfiles": [
      "Avanzado"
    ],
    "evidenciaNecesaria": "Registrar una referencia verificable de la organización para este control.",
    "demostracionSugerida": "Describir cómo se verifica el control y su evidencia en la organización."
  },
  {
    "controlId": "CA.2-2",
    "tema": "está establecida la periodicidad con la que se realizan las revisiones de los privilegios y la validez de las cuentas asociadas.",
    "funciones": [
      "Proteger"
    ],
    "perfiles": [
      "Avanzado"
    ],
    "evidenciaNecesaria": "Registrar una referencia verificable de la organización para este control.",
    "demostracionSugerida": "Describir cómo se verifica el control y su evidencia en la organización."
  },
  {
    "controlId": "CA.2-3",
    "tema": "están definidos los responsables de la revisión de privilegios y de la validez de las cuentas en cada sistema.",
    "funciones": [
      "Proteger"
    ],
    "perfiles": [
      "Avanzado"
    ],
    "evidenciaNecesaria": "Registrar una referencia verificable de la organización para este control.",
    "demostracionSugerida": "Describir cómo se verifica el control y su evidencia en la organización."
  },
  {
    "controlId": "CA.2-4",
    "tema": "se mantiene un inventario de usuarios con permisos y privilegios elevados, validando también la vigencia de las cuentas.",
    "funciones": [
      "Proteger"
    ],
    "perfiles": [
      "Avanzado"
    ],
    "evidenciaNecesaria": "Registrar una referencia verificable de la organización para este control.",
    "demostracionSugerida": "Describir cómo se verifica el control y su evidencia en la organización."
  },
  {
    "controlId": "CA.5-3",
    "tema": "se aplican mecanismos preventivos para evitar su asignación conjunta, salvo justificación formal y aprobación excepcional de roles en conflicto.",
    "funciones": [
      "Proteger"
    ],
    "perfiles": [
      "Avanzado"
    ],
    "evidenciaNecesaria": "Registrar una referencia verificable de la organización para este control.",
    "demostracionSugerida": "Describir cómo se verifica el control y su evidencia en la organización."
  },
  {
    "controlId": "CA.5-4",
    "tema": "está limitada la cantidad de usuarios con privilegios administrativos, siguiendo criterios establecidos.",
    "funciones": [
      "Proteger"
    ],
    "perfiles": [
      "Avanzado"
    ],
    "evidenciaNecesaria": "Registrar una referencia verificable de la organización para este control.",
    "demostracionSugerida": "Describir cómo se verifica el control y su evidencia en la organización."
  },
  {
    "controlId": "CA.5-5",
    "tema": "la segregación de funciones abarca también los diferentes entornos de la organización, evitando que una persona realice actividades en más de un entorno al menos de que esté debidamente justificado y documentado.",
    "funciones": [
      "Proteger"
    ],
    "perfiles": [
      "Avanzado"
    ],
    "evidenciaNecesaria": "Registrar una referencia verificable de la organización para este control.",
    "demostracionSugerida": "Describir cómo se verifica el control y su evidencia en la organización."
  },
  {
    "controlId": "CA.5-6",
    "tema": "el personal de administración de accesos no es el mismo que el que realiza la auditoría sobre dichos accesos.",
    "funciones": [
      "Proteger"
    ],
    "perfiles": [
      "Avanzado"
    ],
    "evidenciaNecesaria": "Registrar una referencia verificable de la organización para este control.",
    "demostracionSugerida": "Describir cómo se verifica el control y su evidencia en la organización."
  },
  {
    "controlId": "CA.5-7",
    "tema": "están identificados, documentados y gestionados los posibles conflictos entre roles o combinaciones de privilegios.",
    "funciones": [
      "Proteger"
    ],
    "perfiles": [
      "Avanzado"
    ],
    "evidenciaNecesaria": "Registrar una referencia verificable de la organización para este control.",
    "demostracionSugerida": "Describir cómo se verifica el control y su evidencia en la organización."
  },
  {
    "controlId": "CA.5-8",
    "tema": "están definidos y documentados los criterios para autorizar privilegios administrativos.",
    "funciones": [
      "Proteger"
    ],
    "perfiles": [
      "Avanzado"
    ],
    "evidenciaNecesaria": "Registrar una referencia verificable de la organización para este control.",
    "demostracionSugerida": "Describir cómo se verifica el control y su evidencia en la organización."
  },
  {
    "controlId": "CA.5-9",
    "tema": "están definidos y documentados los criterios para determinar cuántos usuarios con privilegios de administrador deben existir por sistema o entorno.",
    "funciones": [
      "Proteger"
    ],
    "perfiles": [
      "Avanzado"
    ],
    "evidenciaNecesaria": "Registrar una referencia verificable de la organización para este control.",
    "demostracionSugerida": "Describir cómo se verifica el control y su evidencia en la organización."
  },
  {
    "controlId": "CA.5-10",
    "tema": "la segregación de funciones está incluida en el procedimiento formal de control de acceso lógico.",
    "funciones": [
      "Proteger"
    ],
    "perfiles": [
      "Avanzado"
    ],
    "evidenciaNecesaria": "Registrar una referencia verificable de la organización para este control.",
    "demostracionSugerida": "Describir cómo se verifica el control y su evidencia en la organización."
  },
  {
    "controlId": "CA.6-2",
    "tema": "el uso de dispositivos externos requiere identificación (inventariado y responsable) y autentificación (permiso de acceso por el rol del usuario o algún otro método).",
    "funciones": [
      "Proteger"
    ],
    "perfiles": [
      "Avanzado"
    ],
    "evidenciaNecesaria": "Registrar una referencia verificable de la organización para este control.",
    "demostracionSugerida": "Describir cómo se verifica el control y su evidencia en la organización."
  },
  {
    "controlId": "CA.6-3",
    "tema": "las autorizaciones de derechos de acceso son registradas.",
    "funciones": [
      "Proteger"
    ],
    "perfiles": [
      "Avanzado"
    ],
    "evidenciaNecesaria": "Registrar una referencia verificable de la organización para este control.",
    "demostracionSugerida": "Describir cómo se verifica el control y su evidencia en la organización."
  },
  {
    "controlId": "CA.6-4",
    "tema": "el acceso a los activos de información identificados como críticos debe requerir autenticación con múltiple factor (MFA).",
    "funciones": [
      "Proteger"
    ],
    "perfiles": [
      "Avanzado"
    ],
    "evidenciaNecesaria": "Registrar una referencia verificable de la organización para este control.",
    "demostracionSugerida": "Describir cómo se verifica el control y su evidencia en la organización."
  },
  {
    "controlId": "CA.6-5",
    "tema": "se aplica el principio de menor privilegio para la asignación de permisos.",
    "funciones": [
      "Proteger"
    ],
    "perfiles": [
      "Avanzado"
    ],
    "evidenciaNecesaria": "Registrar una referencia verificable de la organización para este control.",
    "demostracionSugerida": "Describir cómo se verifica el control y su evidencia en la organización."
  },
  {
    "controlId": "CA.6-6",
    "tema": "se define un procedimiento de acceso lógico a redes, recursos y sistemas de información.",
    "funciones": [
      "Proteger"
    ],
    "perfiles": [
      "Avanzado"
    ],
    "evidenciaNecesaria": "Registrar una referencia verificable de la organización para este control.",
    "demostracionSugerida": "Describir cómo se verifica el control y su evidencia en la organización."
  },
  {
    "controlId": "SF.4-4",
    "tema": "se instalan sellos o cintas de seguridad con código único en los puntos de acceso al interior de los chasis, de manera que cualquier manipulación quede registrada.",
    "funciones": [
      "Identificar"
    ],
    "perfiles": [
      "Avanzado"
    ],
    "evidenciaNecesaria": "Registrar una referencia verificable de la organización para este control.",
    "demostracionSugerida": "Describir cómo se verifica el control y su evidencia en la organización."
  },
  {
    "controlId": "SF.5-3",
    "tema": "se establecen planes de mantenimiento para las dependencias de los componentes críticos.",
    "funciones": [
      "Proteger"
    ],
    "perfiles": [
      "Avanzado"
    ],
    "evidenciaNecesaria": "Registrar una referencia verificable de la organización para este control.",
    "demostracionSugerida": "Describir cómo se verifica el control y su evidencia en la organización."
  },
  {
    "controlId": "SF.5-4",
    "tema": "se establecen los planes anuales de mantenimiento.",
    "funciones": [
      "Proteger"
    ],
    "perfiles": [
      "Avanzado"
    ],
    "evidenciaNecesaria": "Registrar una referencia verificable de la organización para este control.",
    "demostracionSugerida": "Describir cómo se verifica el control y su evidencia en la organización."
  },
  {
    "controlId": "SF.5-5",
    "tema": "se gestiona el acceso a los usuarios autorizados para realizar las tareas de mantenimiento programado.",
    "funciones": [
      "Proteger"
    ],
    "perfiles": [
      "Avanzado"
    ],
    "evidenciaNecesaria": "Registrar una referencia verificable de la organización para este control.",
    "demostracionSugerida": "Describir cómo se verifica el control y su evidencia en la organización."
  },
  {
    "controlId": "SO.2-3",
    "tema": "se definen el versionado, las líneas base de configuración y los lineamientos de hardenizado de los productos de software.",
    "funciones": [
      "Proteger"
    ],
    "perfiles": [
      "Avanzado"
    ],
    "evidenciaNecesaria": "Registrar una referencia verificable de la organización para este control.",
    "demostracionSugerida": "Describir cómo se verifica el control y su evidencia en la organización."
  },
  {
    "controlId": "SO.2-4",
    "tema": "los cambios de configuración sobre infraestructura crítica requieren validación previa mediante pruebas en ambientes controlados.",
    "funciones": [
      "Identificar",
      "Proteger"
    ],
    "perfiles": [
      "Avanzado"
    ],
    "evidenciaNecesaria": "Registrar una referencia verificable de la organización para este control.",
    "demostracionSugerida": "Describir cómo se verifica el control y su evidencia en la organización."
  },
  {
    "controlId": "SO.4-2",
    "tema": "se cuenta con plataformas adecuadas e independientes que soportan el ciclo de vida de desarrollo de los sistemas.",
    "funciones": [
      "Proteger"
    ],
    "perfiles": [
      "Avanzado"
    ],
    "evidenciaNecesaria": "Registrar una referencia verificable de la organización para este control.",
    "demostracionSugerida": "Describir cómo se verifica el control y su evidencia en la organización."
  },
  {
    "controlId": "SO.4-3",
    "tema": "se implementan controles para el pasaje entre los ambientes.",
    "funciones": [
      "Proteger"
    ],
    "perfiles": [
      "Avanzado"
    ],
    "evidenciaNecesaria": "Registrar una referencia verificable de la organización para este control.",
    "demostracionSugerida": "Describir cómo se verifica el control y su evidencia en la organización."
  },
  {
    "controlId": "SO.7-8",
    "tema": "se automatizan alertas ante eventos de seguridad de la información. Por ejemplo, permiten alertar cuando los usuarios realizan conexiones fuera de la organización, y la conexión e instalación de dispositivos o software no autorizado en equipos de la organización.",
    "funciones": [
      "Detectar"
    ],
    "perfiles": [
      "Avanzado"
    ],
    "evidenciaNecesaria": "Registrar una referencia verificable de la organización para este control.",
    "demostracionSugerida": "Describir cómo se verifica el control y su evidencia en la organización."
  },
  {
    "controlId": "SO.7-9",
    "tema": "se han definido las responsabilidades y la participación de los roles de TI en las actividades de monitoreo, incluyendo aquellas basadas en herramientas automatizadas.",
    "funciones": [
      "Detectar"
    ],
    "perfiles": [
      "Avanzado"
    ],
    "evidenciaNecesaria": "Registrar una referencia verificable de la organización para este control.",
    "demostracionSugerida": "Describir cómo se verifica el control y su evidencia en la organización."
  },
  {
    "controlId": "SC.12-5",
    "tema": "se revisan periódicamente los registros de acceso para verificar que no existan conexiones desde servicios de Webmail externos no autorizados.",
    "funciones": [
      "Proteger"
    ],
    "perfiles": [
      "Avanzado"
    ],
    "evidenciaNecesaria": "Registrar una referencia verificable de la organización para este control.",
    "demostracionSugerida": "Describir cómo se verifica el control y su evidencia en la organización."
  },
  {
    "controlId": "SC.13-4",
    "tema": "se segmenta la red en función de las necesidades de la organización.",
    "funciones": [
      "Proteger"
    ],
    "perfiles": [
      "Avanzado"
    ],
    "evidenciaNecesaria": "Registrar una referencia verificable de la organización para este control.",
    "demostracionSugerida": "Describir cómo se verifica el control y su evidencia en la organización."
  },
  {
    "controlId": "SC.13-5",
    "tema": "se genera una postura de manejo de tráfico por defecto entre segmentos.",
    "funciones": [
      "Proteger"
    ],
    "perfiles": [
      "Avanzado"
    ],
    "evidenciaNecesaria": "Registrar una referencia verificable de la organización para este control.",
    "demostracionSugerida": "Describir cómo se verifica el control y su evidencia en la organización."
  },
  {
    "controlId": "SC.13-6",
    "tema": "las conexiones con otras entidades están formalmente autorizadas mediante acuerdos de seguridad de interconexión que describen interfaz, requisitos de seguridad y datos intercambiados.",
    "funciones": [
      "Identificar"
    ],
    "perfiles": [
      "Avanzado"
    ],
    "evidenciaNecesaria": "Registrar una referencia verificable de la organización para este control.",
    "demostracionSugerida": "Describir cómo se verifica el control y su evidencia en la organización."
  },
  {
    "controlId": "SC.13-7",
    "tema": "los proveedores de servicios de red cuentan con acuerdos de nivel de servicio (SLA) y cláusulas de seguridad.",
    "funciones": [
      "Identificar"
    ],
    "perfiles": [
      "Avanzado"
    ],
    "evidenciaNecesaria": "Registrar una referencia verificable de la organización para este control.",
    "demostracionSugerida": "Describir cómo se verifica el control y su evidencia en la organización."
  },
  {
    "controlId": "GI.5-5",
    "tema": "se han definido pautas para contener el daño y minimizar el riesgo en el entorno operativo.",
    "funciones": [
      "Responder"
    ],
    "perfiles": [
      "Avanzado"
    ],
    "evidenciaNecesaria": "Registrar una referencia verificable de la organización para este control.",
    "demostracionSugerida": "Describir cómo se verifica el control y su evidencia en la organización."
  },
  {
    "controlId": "GI.5-6",
    "tema": "se cuenta con planes de remediación de los incidentes.",
    "funciones": [
      "Responder"
    ],
    "perfiles": [
      "Avanzado"
    ],
    "evidenciaNecesaria": "Registrar una referencia verificable de la organización para este control.",
    "demostracionSugerida": "Describir cómo se verifica el control y su evidencia en la organización."
  },
  {
    "controlId": "GI.6-2",
    "tema": "se cuenta con un mecanismo para identificar, registrar y analizar lecciones aprendidas de los incidentes de seguridad de la información en toda la organización.",
    "funciones": [
      "Identificar",
      "Recuperar"
    ],
    "perfiles": [
      "Avanzado"
    ],
    "evidenciaNecesaria": "Registrar una referencia verificable de la organización para este control.",
    "demostracionSugerida": "Describir cómo se verifica el control y su evidencia en la organización."
  },
  {
    "controlId": "CO.4-4",
    "tema": "existen planes formales de contingencia operativa y de recuperación ante desastres, validados por la alta dirección.",
    "funciones": [
      "Recuperar"
    ],
    "perfiles": [
      "Avanzado"
    ],
    "evidenciaNecesaria": "Registrar una referencia verificable de la organización para este control.",
    "demostracionSugerida": "Describir cómo se verifica el control y su evidencia en la organización."
  },
  {
    "controlId": "CN.1-2",
    "tema": "el delegado de protección de datos personales trabaja de manera coordinada con el RSI y/o CSI.",
    "funciones": [
      "Gobernar"
    ],
    "perfiles": [
      "Avanzado"
    ],
    "evidenciaNecesaria": "Registrar una referencia verificable de la organización para este control.",
    "demostracionSugerida": "Describir cómo se verifica el control y su evidencia en la organización."
  },
  {
    "controlId": "CN.2-3",
    "tema": "se realiza anualmente una auditoría interna sobre el cumplimiento del presente marco.",
    "funciones": [
      "Identificar"
    ],
    "perfiles": [
      "Avanzado"
    ],
    "evidenciaNecesaria": "Registrar una referencia verificable de la organización para este control.",
    "demostracionSugerida": "Describir cómo se verifica el control y su evidencia en la organización."
  },
  {
    "controlId": "PD.1-3",
    "tema": "se cuenta con un estudio de la normativa vigente que debe cumplir cada base de datos registrada.",
    "funciones": [
      "Gobernar"
    ],
    "perfiles": [
      "Avanzado"
    ],
    "evidenciaNecesaria": "Registrar una referencia verificable de la organización para este control.",
    "demostracionSugerida": "Describir cómo se verifica el control y su evidencia en la organización."
  },
  {
    "controlId": "PD.2-3",
    "tema": "se lleva un registro documentado de todas las solicitudes recibidas por parte de los titulares de datos personales, relativas a la actualización, eliminación o rectificación de sus datos, incluyendo el plazo en que cada solicitud fue atendida.",
    "funciones": [
      "Gobernar"
    ],
    "perfiles": [
      "Avanzado"
    ],
    "evidenciaNecesaria": "Registrar una referencia verificable de la organización para este control.",
    "demostracionSugerida": "Describir cómo se verifica el control y su evidencia en la organización."
  },
  {
    "controlId": "PD.2-4",
    "tema": "cuando el titular de los datos personales se encuentra presente, se procede a validar la exactitud de los datos y, en caso de corresponder, se actualizan los datos en los sistemas correspondientes en ese mismo momento.",
    "funciones": [
      "Gobernar"
    ],
    "perfiles": [
      "Avanzado"
    ],
    "evidenciaNecesaria": "Registrar una referencia verificable de la organización para este control.",
    "demostracionSugerida": "Describir cómo se verifica el control y su evidencia en la organización."
  },
  {
    "controlId": "PD.3-3",
    "tema": "se han establecido criterios sobre cuánto tiempo se conservarán los datos personales en función de su finalidad.",
    "funciones": [
      "Identificar"
    ],
    "perfiles": [
      "Avanzado"
    ],
    "evidenciaNecesaria": "Registrar una referencia verificable de la organización para este control.",
    "demostracionSugerida": "Describir cómo se verifica el control y su evidencia en la organización."
  },
  {
    "controlId": "PD.3-4",
    "tema": "se mantienen registros de las eliminaciones o anonimizaciones de datos personales, acorde al procedimiento.",
    "funciones": [
      "Identificar"
    ],
    "perfiles": [
      "Avanzado"
    ],
    "evidenciaNecesaria": "Registrar una referencia verificable de la organización para este control.",
    "demostracionSugerida": "Describir cómo se verifica el control y su evidencia en la organización."
  },
  {
    "controlId": "PD.4-3",
    "tema": "se verifica, previo al tratamiento de datos personales, si el consentimiento del titular es requerido según lo establecido por la normativa vigente.",
    "funciones": [
      "Gobernar"
    ],
    "perfiles": [
      "Avanzado"
    ],
    "evidenciaNecesaria": "Registrar una referencia verificable de la organización para este control.",
    "demostracionSugerida": "Describir cómo se verifica el control y su evidencia en la organización."
  },
  {
    "controlId": "PD.4-4",
    "tema": "los mecanismos que requieren consentimiento informado garantizan que la opción de aceptar o rechazar esté claramente visible y no preseleccionada.",
    "funciones": [
      "Gobernar"
    ],
    "perfiles": [
      "Avanzado"
    ],
    "evidenciaNecesaria": "Registrar una referencia verificable de la organización para este control.",
    "demostracionSugerida": "Describir cómo se verifica el control y su evidencia en la organización."
  },
  {
    "controlId": "PD.4-5",
    "tema": "cuando el tratamiento se basa en el consentimiento, se han definido mecanismos que permiten a los titulares revocar el consentimiento otorgado en cualquier momento, sin afectar la licitud del tratamiento previo.",
    "funciones": [
      "Gobernar"
    ],
    "perfiles": [
      "Avanzado"
    ],
    "evidenciaNecesaria": "Registrar una referencia verificable de la organización para este control.",
    "demostracionSugerida": "Describir cómo se verifica el control y su evidencia en la organización."
  },
  {
    "controlId": "PD.6-2",
    "tema": "están definidos y documentados los roles autorizados a acceder a datos personales y las finalidades permitidas para su uso.",
    "funciones": [
      "Gobernar"
    ],
    "perfiles": [
      "Avanzado"
    ],
    "evidenciaNecesaria": "Registrar una referencia verificable de la organización para este control.",
    "demostracionSugerida": "Describir cómo se verifica el control y su evidencia en la organización."
  },
  {
    "controlId": "PD.6-3",
    "tema": "los contratos, reglamentos o políticas internas contemplan sanciones explícitas ante el uso o divulgación indebida de datos personales.",
    "funciones": [
      "Gobernar"
    ],
    "perfiles": [
      "Avanzado"
    ],
    "evidenciaNecesaria": "Registrar una referencia verificable de la organización para este control.",
    "demostracionSugerida": "Describir cómo se verifica el control y su evidencia en la organización."
  },
  {
    "controlId": "PD.6-4",
    "tema": "el personal autorizado a tratar datos personales está sujeto a compromisos de confidencialidad, los cuales pueden formalizarse mediante cláusulas en contratos, reglamentos internos, políticas institucionales o documentos específicos firmados, según corresponda al vínculo con la organización.",
    "funciones": [
      "Gobernar"
    ],
    "perfiles": [
      "Avanzado"
    ],
    "evidenciaNecesaria": "Registrar una referencia verificable de la organización para este control.",
    "demostracionSugerida": "Describir cómo se verifica el control y su evidencia en la organización."
  },
  {
    "controlId": "PD.7-2",
    "tema": "el delegado de protección de datos personales asesora en el diseño e implementación de medidas técnicas y organizativas destinadas a incorporar los principios de privacidad por diseño y por defecto en la organización.",
    "funciones": [
      "Identificar"
    ],
    "perfiles": [
      "Avanzado"
    ],
    "evidenciaNecesaria": "Registrar una referencia verificable de la organización para este control.",
    "demostracionSugerida": "Describir cómo se verifica el control y su evidencia en la organización."
  },
  {
    "controlId": "PD.8-3",
    "tema": "se encuentra asignado personal encargado de recibir, procesar y responder las solicitudes vinculadas a los derechos de los titulares.",
    "funciones": [
      "Gobernar"
    ],
    "perfiles": [
      "Avanzado"
    ],
    "evidenciaNecesaria": "Registrar una referencia verificable de la organización para este control.",
    "demostracionSugerida": "Describir cómo se verifica el control y su evidencia en la organización."
  },
  {
    "controlId": "PD.8-4",
    "tema": "las solicitudes y su tratamiento son registrados.",
    "funciones": [
      "Gobernar"
    ],
    "perfiles": [
      "Avanzado"
    ],
    "evidenciaNecesaria": "Registrar una referencia verificable de la organización para este control.",
    "demostracionSugerida": "Describir cómo se verifica el control y su evidencia en la organización."
  }
];
