export type CampoUrcdp = {
  id: string;
  etiqueta: string;
  grupo: string;
  tipo?: 'email' | 'number' | 'datetime-local';
  opcional?: boolean;
};
export const CAMPOS_BASE: CampoUrcdp[] = [
  {
    id: 'responsable',
    etiqueta: 'Responsable del tratamiento e identificación (RUT/documento)',
    grupo: 'Responsables',
  },
  {
    id: 'contacto',
    etiqueta: 'Domicilio y teléfono del responsable',
    grupo: 'Responsables',
  },
  {
    id: 'correo',
    etiqueta: 'Correo del responsable',
    grupo: 'Responsables',
    tipo: 'email',
  },
  {
    id: 'encargado',
    etiqueta:
      'Encargado o terceros: identificación, domicilio y contacto; indicar si no corresponde',
    grupo: 'Responsables',
  },
  {
    id: 'delegado',
    etiqueta:
      'Delegado de protección de datos y contacto; indicar si no corresponde',
    grupo: 'Responsables',
  },
  {
    id: 'contactoTecnico',
    etiqueta: 'Contacto técnico y entidad de la que depende',
    grupo: 'Responsables',
  },
  {
    id: 'ubicacion',
    etiqueta: 'Ubicación física, proveedor y ubicaciones alternativas',
    grupo: 'Registro',
  },
  {
    id: 'inscripcion',
    etiqueta:
      'Número o estado de inscripción declarado; indicar si está pendiente',
    grupo: 'Registro',
  },
  {
    id: 'finalidad',
    etiqueta: 'Finalidad y fundamento del tratamiento',
    grupo: 'Registro',
  },
  {
    id: 'datosPersonales',
    etiqueta: 'Tipos de datos personales, sensibles o especialmente protegidos',
    grupo: 'Registro',
  },
  { id: 'titulares', etiqueta: 'Categorías de titulares', grupo: 'Registro' },
  {
    id: 'cantidad',
    etiqueta: 'Cantidad de titulares (estimada)',
    grupo: 'Registro',
    tipo: 'number',
  },
  {
    id: 'origen',
    etiqueta: 'Origen y procedimiento de obtención de los datos',
    grupo: 'Registro',
  },
  {
    id: 'conservacion',
    etiqueta: 'Plazo de conservación y eliminación',
    grupo: 'Registro',
  },
  {
    id: 'cesiones',
    etiqueta: 'Destinatarios, cesiones y motivos; indicar si no hay',
    grupo: 'Registro',
  },
  {
    id: 'transferencias',
    etiqueta:
      'Transferencias internacionales: países, destinatarios y garantías; indicar si no hay',
    grupo: 'Registro',
  },
  {
    id: 'derechos',
    etiqueta: 'Unidad, dirección y medios para ejercer derechos',
    grupo: 'Registro',
  },
  {
    id: 'soporte',
    etiqueta: 'Soporte y descripción técnica de la base; activos relacionados',
    grupo: 'Registro',
  },
  {
    id: 'accesos',
    etiqueta: 'Medidas de control de acceso y confidencialidad',
    grupo: 'Medidas de seguridad',
  },
  {
    id: 'proteccion',
    etiqueta: 'Cifrado y protección de almacenamiento y comunicaciones',
    grupo: 'Medidas de seguridad',
  },
  {
    id: 'respaldo',
    etiqueta: 'Respaldos, pruebas de restauración y continuidad',
    grupo: 'Medidas de seguridad',
  },
  {
    id: 'fisica',
    etiqueta: 'Seguridad física y gestión de soportes',
    grupo: 'Medidas de seguridad',
  },
  {
    id: 'monitoreo',
    etiqueta: 'Monitoreo, vulnerabilidades y respuesta a incidentes',
    grupo: 'Medidas de seguridad',
  },
  {
    id: 'organizacion',
    etiqueta: 'Políticas, capacitación y obligaciones de terceros',
    grupo: 'Medidas de seguridad',
  },
  {
    id: 'evidencias',
    etiqueta: 'Referencias verificables de evidencias y fecha de revisión',
    grupo: 'Medidas de seguridad',
  },
  {
    id: 'pendientes',
    etiqueta: 'Medidas pendientes y plan de mejora; indicar si no hay',
    grupo: 'Medidas de seguridad',
  },
];
export const CAMPOS_BRECHA: CampoUrcdp[] = [
  {
    id: 'comunicante',
    etiqueta: 'Comunicante: nombre, identificación, calidad y contacto',
    grupo: 'Identificación del comunicante',
  },
  {
    id: 'inicio',
    etiqueta: 'Fecha de ocurrencia: exacta, estimada o desconocida',
    grupo: 'Cronología',
  },
  {
    id: 'deteccion',
    etiqueta: 'Fecha de detección y circunstancias',
    grupo: 'Cronología',
  },
  {
    id: 'conocimiento',
    etiqueta: 'Fecha y hora de conocimiento por el responsable (hora local)',
    grupo: 'Cronología',
    tipo: 'datetime-local',
  },
  {
    id: 'naturaleza',
    etiqueta: 'Naturaleza y medio de la vulneración',
    grupo: 'Afectación',
  },
  {
    id: 'datosAfectados',
    etiqueta: 'Tipos de datos afectados',
    grupo: 'Afectación',
  },
  {
    id: 'titularesAfectados',
    etiqueta: 'Categorías de titulares afectados',
    grupo: 'Afectación',
  },
  {
    id: 'cantidadAfectados',
    etiqueta: 'Cantidad estimada de titulares afectados',
    grupo: 'Afectación',
    tipo: 'number',
  },
  {
    id: 'consecuencias',
    etiqueta: 'Posibles consecuencias y afectación de derechos',
    grupo: 'Afectación',
  },
  {
    id: 'preventivas',
    etiqueta: 'Medidas preventivas existentes antes de la brecha',
    grupo: 'Respuesta',
  },
  {
    id: 'mitigacion',
    etiqueta:
      'Procedimiento iniciado y medidas para minimizar el impacto; razones si no se inició',
    grupo: 'Respuesta',
  },
  {
    id: 'comunicacionTitulares',
    etiqueta:
      'Comunicación a titulares: decisión y justificación, fecha, cantidad y medios',
    grupo: 'Comunicación',
  },
  {
    id: 'envio',
    etiqueta: 'Fecha y hora de presentación ante URCDP (hora local)',
    grupo: 'Comunicación',
    tipo: 'datetime-local',
    opcional: true,
  },
  {
    id: 'constancia',
    etiqueta: 'Canal y referencia de constancia de presentación',
    grupo: 'Comunicación',
    opcional: true,
  },
  {
    id: 'demora',
    etiqueta: 'Motivos de presentación tardía, cuando corresponda',
    grupo: 'Comunicación',
    opcional: true,
  },
  {
    id: 'resolucion',
    etiqueta: 'Fecha y hora de resolución (hora local)',
    grupo: 'Informe posterior',
    tipo: 'datetime-local',
    opcional: true,
  },
  {
    id: 'detalleFinal',
    etiqueta: 'Detalle final de lo sucedido y medidas adoptadas',
    grupo: 'Informe posterior',
  },
  {
    id: 'prevencionFutura',
    etiqueta: 'Medidas para evitar recurrencia',
    grupo: 'Informe posterior',
  },
];
