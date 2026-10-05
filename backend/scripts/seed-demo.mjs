import { config } from 'dotenv';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import pg from 'pg';

config({ path: fileURLToPath(new URL('../.env', import.meta.url)) });
// Identificadores estables: una segunda ejecución no duplica ni pisa la demo.
const id = (key) => {
  const h = createHash('sha256').update(`rsi-demo-logistica-v1:${key}`).digest('hex');
  return `${h.slice(0, 8)}-${h.slice(8, 12)}-4${h.slice(13, 16)}-a${h.slice(17, 20)}-${h.slice(20, 32)}`;
};
const rows = [];
const add = (table, key, data) => { rows.push({ table, data: { id: id(key), ...data } }); return id(key); };
const org = add('organizaciones', 'org', {
  nombre: 'Logística del Ceibo — Demo',
  alcanceSgsi: 'Empresa ficticia de distribución con oficina en Montevideo y depósito en Canelones. El alcance comprende recepción de pedidos, planificación de entregas, facturación y soporte tecnológico. Escenario simulado: datos sintéticos para demostración; personas, incidentes y evidencias no representan hechos reales.',
});
const units = [
  ['direccion', 'Dirección general', 'AREA', null],
  ['operaciones', 'Operaciones y distribución', 'DEPARTAMENTO', 'direccion'],
  ['tecnologia', 'Tecnología y seguridad', 'DEPARTAMENTO', 'direccion'],
  ['administracion', 'Administración y finanzas', 'DEPARTAMENTO', 'direccion'],
];
for (const [key, nombre, tipo, parent] of units) add('unidades_organizativas', key, { organizacionId: org, nombre, tipo, unidadPadreId: parent ? id(parent) : null });
const people = [
  ['laura', 'Laura Méndez', 'Gerenta general', 'direccion', 'laura.mendez'],
  ['martin', 'Martín Pereira', 'Coordinador de operaciones', 'operaciones', 'martin.pereira'],
  ['sofia', 'Sofía Rodríguez', 'Analista de distribución', 'operaciones', 'sofia.rodriguez'],
  ['lucia', 'Lucía Fernández', 'Responsable de seguridad de la información', 'tecnologia', 'lucia.fernandez'],
  ['nicolas', 'Nicolás Silva', 'Administrador de infraestructura', 'tecnologia', 'nicolas.silva'],
  ['valentina', 'Valentina Costa', 'Responsable de administración', 'administracion', 'valentina.costa'],
];
for (const [key, nombre, cargo, unit, email] of people) add('trabajadores', key, { nombre, cargo, unidadOrganizativaId: id(unit), correo: `${email}@ceibo.example` });
const assets = [
  ['erp', 'Sistema de pedidos y distribución', 'APLICACION', 'CRITICA', 'CONFIDENCIAL', 'operaciones', 'martin', 'Centraliza pedidos, rutas y confirmaciones de entrega. Una interrupción impide emitir hojas de reparto y actualizar el estado de los envíos.'],
  ['db', 'Base de datos de clientes y entregas', 'INFORMACION', 'CRITICA', 'CONFIDENCIAL', 'tecnologia', 'nicolas', 'Contiene domicilios de entrega, contactos comerciales e historial de pedidos. Acceso restringido a la aplicación y al personal de infraestructura autorizado.'],
  ['correo', 'Correo corporativo', 'SERVICIO', 'ALTA', 'INTERNO', 'tecnologia', 'lucia', 'Servicio utilizado para coordinar entregas, recibir facturas y comunicarse con proveedores. Las cuentas administrativas requieren autenticación multifactor.'],
  ['notebook', 'Notebook de administración ADM-03', 'HARDWARE', 'MEDIA', 'CONFIDENCIAL', 'administracion', 'valentina', 'Equipo asignado a conciliaciones bancarias y facturación. Se utiliza en oficina y durante jornadas de trabajo remoto.'],
  ['backup', 'Repositorio de respaldos del depósito', 'HARDWARE', 'ALTA', 'CONFIDENCIAL', 'tecnologia', 'nicolas', 'Almacena copias nocturnas de la base de datos y documentos operativos. La restauración se verifica mensualmente en un entorno aislado.'],
];
for (const [key, nombre, tipo, criticidad, clasificacion, unit, person, descripcion] of assets) add('activos', key, { nombre, tipo, criticidad, clasificacion, descripcion, unidadOrganizativaId: id(unit), responsableId: id(person) });
const processes = [
  ['pedidos', 'Gestión de pedidos y entregas', 'Validar el pedido, asignar una ruta y registrar la conformidad de entrega. Las diferencias se comunican al coordinador antes del cierre diario.', 'martin', ['erp', 'db']],
  ['accesos', 'Altas, cambios y bajas de acceso', 'El responsable del área solicita el acceso; seguridad valida el perfil y tecnología ejecuta el cambio. Las bajas se procesan al finalizar la relación laboral.', 'lucia', ['correo', 'erp']],
  ['restauracion', 'Respaldo y recuperación de información', 'Revisar las copias diarias, investigar fallas y ejecutar una restauración mensual. Documentar duración y validación funcional de los datos recuperados.', 'nicolas', ['db', 'backup']],
];
for (const [key, nombre, descripcion, person] of processes) {
  add('procesos', key, { organizacionId: org, nombre, descripcion, responsableId: id(person), estado: 'ACTIVO', version: '1.0', fechaRevision: '2026-12-15' });
  for (const [p, role] of [[person, 'R'], ['laura', 'A'], ['valentina', 'C'], ['sofia', 'I']]) add('asignaciones_raci', `${key}-${role}`, { procesoId: id(key), trabajadorId: id(p), tipoResponsabilidad: role });
}
const risks = [
  ['ransom', 'Interrupción del reparto por cifrado del sistema', 'Un archivo malicioso podría cifrar la aplicación y detener la planificación de entregas durante la jornada.', 'erp', 3, 5, 'martin', 'EN_TRATAMIENTO', 'Se espera reducir la probabilidad con segmentación y respaldos aislados. Pendiente de validar la recuperación.'],
  ['fraude', 'Pago a una cuenta bancaria suplantada', 'Un atacante podría hacerse pasar por un proveedor y solicitar un cambio de cuenta a través de correo electrónico.', 'correo', 4, 4, 'valentina', 'ABIERTO', 'Pendiente de evaluar después de implantar la confirmación telefónica con un contacto conocido.'],
  ['perdida', 'Exposición de información por pérdida de un equipo', 'La pérdida de la notebook fuera de la oficina podría exponer reportes financieros y datos de clientes.', 'notebook', 2, 4, 'lucia', 'EN_TRATAMIENTO', 'El cifrado reduce la exposición; resta verificar la cobertura de todos los equipos portátiles.'],
];
for (const [key, nombre, descripcion, asset, probabilidad, impacto, person, estado, riesgoResidual] of risks) add('riesgos', key, { activoId: id(asset), nombre, descripcion, probabilidad, impacto, responsableId: id(person), estado, riesgoResidual, tratamiento: 'MITIGAR', aceptado: false });
const vulns = [
  ['v1', 'Acceso administrativo sin segundo factor', 'La cuenta técnica del sistema de pedidos utiliza solo contraseña. Incorporar un segundo factor y retirar el acceso compartido.', 'erp', 8.1, 15, 'ABIERTA', 'Habilitar MFA, crear cuentas nominativas y comprobar el acceso con cada responsable.'],
  ['v2', 'Respaldos accesibles desde la red de usuarios', 'El repositorio admite conexiones desde estaciones de trabajo. Una cuenta comprometida podría alcanzar las copias disponibles.', 'backup', 7.5, 30, 'EN_TRATAMIENTO', 'Restringir el acceso al servidor de respaldos y mantener una copia desconectada. Validar una restauración antes de cerrar.'],
  ['v3', 'Bloqueo automático de pantalla deshabilitado', 'La revisión del equipo de administración detectó que la sesión permanecía abierta sin actividad.', 'notebook', 4.3, 30, 'CERRADA', 'Se aplicó bloqueo a los cinco minutos y se verificó su funcionamiento en la revisión del 30 de septiembre.'],
];
for (const [key, nombre, descripcion, asset, cvss, sla, estado, planRemediacion] of vulns) add('vulnerabilidades', key, { activoId: id(asset), nombre, descripcion, cvss, sla, estado, planRemediacion, responsableId: id('nicolas') });
const incidents = [
  ['i1', 'Correo con solicitud de cambio de cuenta de proveedor', 'Administración recibió una solicitud inusual de cambio de cuenta. La firma y el dominio del remitente no coinciden con el contacto habitual. No se efectuaron pagos.', 'correo', 'ALTA', 'CONTENIDO', null, ['Se recibió el reporte y se preservó el mensaje original.', 'Se bloqueó el remitente y se suspendió la solicitud de pago hasta confirmar con el proveedor.']],
  ['i2', 'Demora en la generación de hojas de reparto', 'El sistema de pedidos presentó demoras al iniciar la jornada. Operaciones informa que tres rutas esperan sus documentos de salida.', 'erp', 'MEDIA', 'ABIERTO', null, ['Se registró el aviso de operaciones y se inició la revisión de capacidad y registros del servicio.']],
  ['i3', 'Falla de la copia nocturna de la base de datos', 'La tarea de respaldo finalizó por falta de espacio. Se conservó la copia válida del día anterior y se inició una ejecución manual tras liberar archivos temporales.', 'backup', 'MEDIA', 'CERRADO', 'Agregar una alerta de capacidad al 80 % y revisar semanalmente la retención para detectar el problema antes de la ventana de respaldo.', ['La revisión matinal detectó el fallo de la tarea programada.', 'Se preservó la última copia válida y se suspendió la limpieza automática.', 'Se corrigió la retención y se liberó espacio temporal.', 'Se ejecutó una copia nueva y se restauró en el entorno de validación.', 'Se verificaron pedidos y clientes recuperados; se documentaron las acciones preventivas.']],
];
for (const [key, titulo, descripcion, asset, severidad, estado, leccionesAprendidas, actions] of incidents) {
  add('incidentes', key, { activoId: id(asset), titulo, descripcion, severidad, estado, leccionesAprendidas, responsableId: id('lucia') });
  actions.forEach((descripcion, i) => add('acciones_incidente', `${key}-accion-${i}`, { incidenteId: id(key), estado: ['ABIERTO', 'CONTENIDO', 'ERRADICADO', 'RECUPERADO', 'CERRADO'][i], descripcion, fecha: `2026-10-01T${String(9 + i).padStart(2, '0')}:00:00Z` }));
}
for (const [key, titulo, descripcion] of [
  ['p1', 'Política de control de acceso', 'Cada persona utiliza una cuenta individual y recibe los permisos mínimos para su función. Los responsables revisan accesos trimestralmente y comunican bajas a tecnología el mismo día.'],
  ['p2', 'Política de respaldo y recuperación', 'La información operativa se respalda cada noche. Se mantiene una copia aislada y se verifica mensualmente la recuperación de pedidos y clientes. Los fallos se reportan a seguridad.'],
]) add('politicas', key, { organizacionId: org, titulo, descripcion, responsableId: id('lucia'), version: '1.0', estado: 'ACTIVA', fechaRevision: '2027-03-01' });
for (const [key, politica, nombre, descripcion] of [
  ['pr1', 'p1', 'Baja de una cuenta al finalizar la relación laboral', 'Recibir la solicitud autorizada, revocar sesiones, deshabilitar la cuenta y retirar permisos compartidos. Confirmar la baja al responsable del área y conservar el registro de ejecución.'],
  ['pr2', 'p2', 'Verificación mensual de restauración', 'Seleccionar la última copia válida, restaurarla en un entorno aislado y contrastar una muestra de pedidos. Registrar tiempos, errores y conformidad de operaciones antes de eliminar la copia temporal.'],
]) add('procedimientos', key, { organizacionId: org, politicaId: id(politica), nombre, descripcion, responsableId: id('nicolas'), version: '1.0', estado: 'ACTIVO', fechaRevision: '2026-12-15' });
for (const [key, risk, nombre, descripcion] of [
  ['plan1', 'ransom', 'Aislamiento y validación de respaldos', 'Separar el repositorio de la red de usuarios y demostrar la recuperación del sistema de pedidos dentro de una jornada laboral.'],
  ['plan2', 'fraude', 'Verificación de cambios de cuenta de proveedores', 'Exigir confirmación por un canal conocido y aprobación de una segunda persona antes de modificar datos bancarios o liberar pagos.'],
]) add('planes', key, { organizacionId: org, riesgoId: id(risk), responsableId: id(key === 'plan1' ? 'nicolas' : 'valentina'), nombre, descripcion, tipo: 'TRATAMIENTO', estado: 'EN_CURSO', fechaInicio: '2026-10-01', fechaFin: '2026-10-30' });
for (const [key, plan, nombre, person, fechaObjetivo] of [
  ['h1', 'plan1', 'Restringir el acceso de red al repositorio', 'nicolas', '2026-10-09'],
  ['h2', 'plan1', 'Validar recuperación con operaciones', 'martin', '2026-10-23'],
  ['h3', 'plan2', 'Aprobar el circuito de doble validación', 'valentina', '2026-10-16'],
]) add('hitos_planes', key, { planId: id(plan), nombre, descripcion: 'Registrar el resultado y la conformidad del responsable antes de completar el hito.', responsableId: id(person), fechaObjetivo, estado: 'PENDIENTE' });
for (const [key, nombre, descripcion, links] of [
  ['e1', 'Acta de revisión de accesos de septiembre', 'Registro simulado: se revisaron los permisos de operaciones y administración, y se identificaron cuentas que requieren segundo factor. No se adjunta un acta real.', { politicaId: id('p1') }],
  ['e2', 'Resultado de restauración de la copia nocturna', 'Registro simulado: la copia se restauró en un entorno aislado y operaciones validó una muestra de pedidos. No se adjunta un informe real.', { incidenteId: id('i3'), politicaId: id('p2') }],
  ['e3', 'Verificación de bloqueo de pantalla en ADM-03', 'Registro simulado de la comprobación del bloqueo automático a los cinco minutos de inactividad. No se adjunta una captura real.', { vulnerabilidadId: id('v3') }],
]) add('evidencias', key, { organizacionId: org, nombre, descripcion, tipo: 'DOCUMENTO', responsableId: id('lucia'), fechaRegistro: '2026-10-01T15:00:00Z', ...links });

const client = new pg.Client({ connectionString: process.env.DATABASE_URL });
try {
  if (!process.env.DATABASE_URL) throw new Error('Falta DATABASE_URL en backend/.env.');
  await client.connect();
  await client.query('BEGIN');
  await client.query('SELECT pg_advisory_xact_lock(20261002, 1)');
  const existing = await client.query('SELECT id FROM organizaciones WHERE id = $1', [org]);
  if (existing.rowCount) {
    console.log('La demo Logística del Ceibo ya existe. No se modificó ningún registro.');
  } else {
    for (const { table, data } of rows) {
      const keys = Object.keys(data);
      await client.query(`INSERT INTO "${table}" (${keys.map(k => `"${k}"`).join(',')}) VALUES (${keys.map((_, i) => `$${i + 1}`).join(',')})`, Object.values(data));
    }
    for (const [unit, person] of [['direccion', 'laura'], ['operaciones', 'martin'], ['tecnologia', 'lucia'], ['administracion', 'valentina']]) {
      await client.query('UPDATE unidades_organizativas SET "responsableId" = $1 WHERE id = $2', [id(person), id(unit)]);
    }
    // Prisma ordena esta relación por nombre de modelo: Activo=A, Proceso=B.
    for (const [key, , , , assetKeys] of processes) for (const asset of assetKeys) {
      await client.query('INSERT INTO "_ActivoToProceso" ("A", "B") VALUES ($1, $2)', [id(asset), id(key)]);
    }
    console.log(`Demo creada: ${rows.length} registros y 6 vínculos entre procesos y activos.`);
  }
  await client.query('COMMIT');
} catch (error) {
  await client.query('ROLLBACK').catch(() => {});
  console.error(`No se cargó la demo: ${error.message}`);
  process.exitCode = 1;
} finally {
  await client.end();
}
