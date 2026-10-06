// Síntesis del curso, no catálogo oficial completo.
export const REQUERIMIENTOS_BCU = [
  {
    controlId: 'BCU-01',
    tema: 'Política formal de seguridad',
    descripcion: 'Aprobada por la dirección, comunicada, revisada.',
  },
  {
    controlId: 'BCU-02',
    tema: 'Responsable de Seguridad de la Información (RSI)',
    descripcion: 'Rol designado con autoridad y recursos.',
  },
  {
    controlId: 'BCU-03',
    tema: 'Análisis de riesgos periódico',
    descripcion: 'Metodología ISO 31000, documentado y revisado por dirección.',
  },
  {
    controlId: 'BCU-04',
    tema: 'Gestión de accesos y privilegios',
    descripcion: 'Mínimo privilegio; revisión periódica.',
  },
  {
    controlId: 'BCU-05',
    tema: 'Autenticación de dos factores',
    descripcion:
      'Obligatoria para transferencias, pagos a terceros y operaciones de alto valor.',
  },
  {
    controlId: 'BCU-06',
    tema: 'Controles criptográficos',
    descripcion: 'Uso de criptografía robusta y gestión de claves.',
  },
  {
    controlId: 'BCU-07',
    tema: 'Backups diarios',
    descripcion: 'Copia diaria de los datos críticos.',
  },
  {
    controlId: 'BCU-08',
    tema: 'Copia fuera del centro de procesamiento',
    descripcion: 'Respaldo en ubicación física separada del sitio principal.',
  },
  {
    controlId: 'BCU-09',
    tema: 'Restauración validada periódicamente',
    descripcion: 'Pruebas de restauración documentadas.',
  },
  {
    controlId: 'BCU-10',
    tema: 'Monitoreo de cambios en datos sensibles',
    descripcion:
      'Registro y control de cambios en identificación, dirección, teléfono y correo de clientes.',
  },
  {
    controlId: 'BCU-11',
    tema: 'Sistema de detección y prevención de intrusiones',
    descripcion: 'IDS/IPS y monitoreo de eventos.',
  },
  {
    controlId: 'BCU-12',
    tema: 'Gestión de vulnerabilidades y parches',
    descripcion: 'Escaneos periódicos, remediación con plazos.',
  },
  {
    controlId: 'BCU-13',
    tema: 'Gestión de incidentes y notificación',
    descripcion:
      'Procedimiento, escalamiento y notificación de incidentes relevantes al BCU.',
  },
  {
    controlId: 'BCU-14',
    tema: 'Plan de continuidad',
    descripcion: 'BCP/DRP probado; RTO/RPO definidos.',
  },
  {
    controlId: 'BCU-15',
    tema: 'Capacitación y concientización',
    descripcion: 'Programa continuo para el personal.',
  },
  {
    controlId: 'BCU-16',
    tema: 'Logs y retención',
    descripcion: 'Registro de eventos con retención definida.',
  },
  {
    controlId: 'BCU-17',
    tema: 'Gestión de proveedores y terceros',
    descripcion: 'Evaluar la seguridad de terceros (incluidos SaaS).',
  },
  {
    controlId: 'BCU-18',
    tema: 'Reporte de madurez MCU 5.0',
    descripcion: 'Trimestral según Comunicación vigente.',
  },
] as const;
