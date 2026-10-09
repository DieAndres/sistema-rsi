import { useEffect, useId, useRef, useState } from 'react'
import { apiFetch, obtenerUsuarioActual } from '../../../shared/api/apiGet'
import type { Trabajador, Unidad } from '../../organizacion/types/organizacion'
import type { Activo } from '../api/seguridadApi'
import './importar-csv.css'

type Tipo = 'activos' | 'vulnerabilidades' | 'riesgos' | 'incidentes'
type VistaPrevia = { total: number; validos: number; filas: { fila: number; datos: Record<string, string>; errores: string[] }[] }
type Props = { tipo: Tipo; organizacionId: string; organizacionNombre: string; unidades: Unidad[]; trabajadores: Trabajador[]; activos?: Activo[]; alImportar: () => Promise<void> }

async function solicitar<T>(ruta: string, cuerpo?: unknown): Promise<T> {
  const respuesta = await apiFetch(ruta, cuerpo === undefined ? {} : { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(cuerpo) })
  if (!respuesta.ok) {
    const error = await respuesta.json().catch(() => null) as { message?: string | string[] } | null
    throw new Error(Array.isArray(error?.message) ? error.message.join(' ') : error?.message || 'No se pudo procesar el archivo. Intentá nuevamente.')
  }
  return respuesta.json() as Promise<T>
}

function descargar(nombre: string, filas: string[][]) {
  // Evita que nombres de referencias se interpreten como fórmulas al abrirlos en Excel.
  const celda = (valor: string) => `"${(/^[=+@\-\t\r]/.test(valor) ? `'${valor}` : valor).replaceAll('"', '""')}"`
  const url = URL.createObjectURL(new Blob(['\uFEFF', filas.map(f => f.map(celda).join(',')).join('\r\n')], { type: 'text/csv;charset=utf-8' }))
  const enlace = document.createElement('a'); enlace.href = url; enlace.download = nombre; enlace.click()
  URL.revokeObjectURL(url)
}

export function ImportarCsv(props: Props) {
  const [abierto, setAbierto] = useState(false)
  if (!['ADMINISTRADOR', 'RSI'].includes(obtenerUsuarioActual()?.rol ?? '')) return null
  return <><button type="button" disabled={!props.organizacionId} onClick={() => setAbierto(true)}>Importar CSV</button>{abierto && <PanelImportar {...props} alCerrar={() => setAbierto(false)} />}</>
}

function PanelImportar({ tipo, organizacionId, organizacionNombre, unidades, trabajadores, activos = [], alImportar, alCerrar }: Props & { alCerrar: () => void }) {
  const dialogo = useRef<HTMLDialogElement>(null)
  const id = useId()
  const [csv, setCsv] = useState('')
  const [archivo, setArchivo] = useState('')
  const [vista, setVista] = useState<VistaPrevia | null>(null)
  const [ocupado, setOcupado] = useState(false)
  const [error, setError] = useState('')
  const [resultado, setResultado] = useState('')
  const ruta = `/api/v1/seguridad/importaciones/${tipo}`
  useEffect(() => {
    const dialog = dialogo.current!
    const focoAnterior = document.activeElement
    dialog.showModal()
    return () => { dialog.close(); if (focoAnterior instanceof HTMLElement) focoAnterior.focus() }
  }, [])

  async function plantilla() {
    setOcupado(true); setError('')
    try {
      const { columnas } = await solicitar<{ columnas: string[] }>(`${ruta}/plantilla`)
      const ejemplo: Record<string, string> = { unidadOrganizativaId: unidades[0]?.id ?? '', activoId: activos[0]?.id ?? '', nombre: 'Ejemplo: reemplazar antes de importar', titulo: 'Ejemplo: reemplazar antes de importar', tipo: 'HW', clasificacion: 'INTERNO', criticidad: 'MEDIA', probabilidad: '2', impacto: '3', tratamiento: 'MITIGAR', aceptado: 'false', cvss: '7.5', sla: '30', severidad: 'MEDIA' }
      descargar(`plantilla-${tipo}.csv`, [columnas, columnas.map(c => ejemplo[c] ?? '')])
    } catch (e) { setError((e as Error).message) }
    finally { setOcupado(false) }
  }
  async function seleccionar(file?: File) {
    setCsv(''); setArchivo(''); setVista(null); setError(''); setResultado('')
    if (!file) return
    if (!file.name.toLowerCase().endsWith('.csv') || file.size > 64 * 1024) { setError('Seleccioná un archivo CSV de hasta 64 KB.'); return }
    setOcupado(true)
    try { setCsv(await file.text()); setArchivo(file.name) }
    catch { setError('No se pudo leer el archivo.') }
    finally { setOcupado(false) }
  }
  async function validar() {
    setOcupado(true); setError(''); setVista(null)
    try { setVista(await solicitar<VistaPrevia>(`${ruta}/validar`, { organizacionId, csv })) }
    catch (e) { setError((e as Error).message) }
    finally { setOcupado(false) }
  }
  async function importar() {
    if (!vista || vista.validos !== vista.total || ocupado || resultado) return
    setOcupado(true); setError('')
    try {
      const registros = await solicitar<{ id: string }[]>(`${ruta}/confirmar`, { organizacionId, csv })
      setResultado(`${registros.length} registros importados correctamente.`); setVista(null); setCsv('')
      window.dispatchEvent(new CustomEvent('rsi-notificacion', { detail: `${registros.length} registros importados correctamente.` }))
      try { await alImportar() } catch { setError('La importación se guardó. No se pudo actualizar el listado; recargá la página.') }
    } catch (e) { setError((e as Error).message); setVista(null) }
    finally { setOcupado(false) }
  }
  return <dialog ref={dialogo} className="asistente-dialogo importacion-dialogo" aria-labelledby={id} onCancel={e => { e.preventDefault(); if (!ocupado) alCerrar() }}>
    <header className="asistente-encabezado"><div><p className="sobretitulo">IMPORTACIÓN CSV</p><h2 id={id}>Importar {tipo}</h2></div><button type="button" aria-label="Cerrar importador" disabled={ocupado} onClick={alCerrar}>✕</button></header>
    <div className="asistente-cuerpo">
      <p>Organización: <strong>{organizacionNombre}</strong>. Máximo 500 registros y 64 KB. Se crearán registros nuevos; los duplicados se rechazan.</p>
      <p>Descargá la plantilla, reemplazá la fila de ejemplo y guardala como CSV UTF-8. Se admite coma o punto y coma como separador.</p>
      <p>Campos obligatorios: {tipo === 'activos' ? 'unidadOrganizativaId, nombre, tipo y clasificacion' : tipo === 'riesgos' ? 'activoId, nombre, probabilidad e impacto' : tipo === 'incidentes' ? 'activoId, titulo y severidad' : 'activoId y nombre'}. Los demás pueden quedar vacíos.</p>
      <div className="importacion-acciones"><button type="button" disabled={ocupado} onClick={() => void plantilla()}>Descargar plantilla</button><button type="button" disabled={ocupado} onClick={() => descargar('referencias-importacion.csv', [['entidad', 'id', 'nombre'], ...unidades.map(u => ['unidad', u.id, u.nombre]), ...activos.map(a => ['activo', a.id, a.nombre]), ...trabajadores.map(t => ['responsable', t.id, t.nombre])])}>Descargar IDs de referencia</button></div>
      <p className="importacion-ayuda">{tipo === 'activos' ? 'Tipo: HW, SW, DATO o SERVICIO. Clasificación: PUBLICO, INTERNO, CONFIDENCIAL o SECRETO. Criticidad: BAJA, MEDIA, ALTA o CRITICA.' : tipo === 'riesgos' ? 'Probabilidad e impacto: enteros de 1 a 5. Tratamiento: MITIGAR, TRANSFERIR, EVITAR o ACEPTAR. Aceptado: true o false.' : tipo === 'vulnerabilidades' ? 'CVSS: de 0 a 10 (decimal con punto). SLA: entero mayor o igual a 0, en días.' : 'Severidad: BAJA, MEDIA, ALTA o CRITICA. Todos los incidentes comienzan en ABIERTO con historial de detección.'}</p>
      <label className="importacion-archivo">Archivo CSV<input type="file" accept=".csv,text/csv" disabled={ocupado} onChange={e => void seleccionar(e.target.files?.[0])} /></label>
      {archivo && <p>{archivo}</p>}
      {error && <p role="alert" className="mensaje mensaje-error">{error}</p>}
      {resultado && <p role="status" className="mensaje">{resultado}</p>}
      {vista && <section aria-label="Vista previa"><h3>{vista.validos} de {vista.total} registros válidos</h3><p>{vista.validos === vista.total ? 'Revisá la vista previa y confirmá la carga. Se guardará el archivo completo.' : 'Corregí los errores y volvé a seleccionar el archivo. No se guardó ningún registro.'}</p><div className="importacion-tabla"><table><thead><tr><th>Fila</th><th>Datos</th><th>Validación</th></tr></thead><tbody>{vista.filas.map(f => <tr key={f.fila}><td>{f.fila}</td><td><dl>{Object.entries(f.datos).filter(([, valor]) => valor).map(([campo, valor]) => <div key={campo}><dt>{campo}</dt><dd>{valor}</dd></div>)}</dl></td><td>{f.errores.length ? <ul>{f.errores.map((e, i) => <li key={i}>{e}</li>)}</ul> : 'Válido'}</td></tr>)}</tbody></table></div></section>}
    </div>
    <footer className="asistente-pie"><button type="button" disabled={ocupado} onClick={alCerrar}>{resultado ? 'Cerrar' : 'Cancelar'}</button>{!resultado && <><button type="button" disabled={!csv || ocupado} onClick={() => void validar()}>{ocupado ? 'Procesando…' : 'Validar archivo'}</button><button type="button" className="boton-principal" disabled={!vista || vista.validos !== vista.total || ocupado} onClick={() => void importar()}>Confirmar importación</button></>}</footer>
  </dialog>
}
