import { useEffect, useState } from 'react'
import { Asistente } from '../../../shared/Asistente'
import { apiRequest } from '../../organizacion/api/organizacionApi'
import { exportarUrcdp } from '../api/exportacionesApi'
import { notificarGuardado } from '../../../shared/notificar'

type Tipo = 'registro' | 'medidas' | 'brecha'
type Campo = { id: string; etiqueta: string; grupo: string; tipo?: 'email' | 'number' | 'datetime-local'; opcional?: boolean }
type Base = { id: string; nombre: string; datos: Record<string, string> }
type Brecha = { id: string; baseId: string; incidenteId: string; datos: Record<string, string>; base: { nombre: string }; incidente: { titulo: string } }
type Fichas = { bases: Base[]; brechas: Brecha[]; incidentes: { id: string; titulo: string }[]; camposBase: Campo[]; camposBrecha: Campo[] }
const ayudaGrupos: Record<string, string> = {
  Responsables: 'Quién está a cargo de los datos y cómo contactarlo.',
  Registro: 'Qué información guardás, para qué la usás y por cuánto tiempo.',
  'Medidas de seguridad': 'Cómo protegés los datos. Incluí evidencia y mejoras pendientes.',
  'Identificación del comunicante': 'Quién prepara la comunicación de este incidente.',
  Cronología: 'Cuándo ocurrió, se detectó y tomó conocimiento la organización.',
  Afectación: 'Qué datos quedaron afectados, a quiénes y con qué consecuencias.',
  Respuesta: 'Qué medidas se tomaron para contener el problema.',
  Comunicación: 'Qué se informó a los afectados y si ya se presentó ante URCDP.',
  'Informe posterior': 'Completá esta sección cuando el incidente esté resuelto.',
}
function horaLocal(valor: string) {
  if (!valor) return ''
  const fecha = new Date(valor)
  return new Date(fecha.getTime() - fecha.getTimezoneOffset() * 60000).toISOString().slice(0, 16)
}

export function UrcdpPanel({ organizacionId, tipo, ocupado, alExportar, alCambiar }: { organizacionId: string; tipo: Tipo; ocupado: boolean; alCambiar: () => void; alExportar: (nombre: string, accion: () => Promise<{ contenido: string }>) => void }) {
  const [fichas, setFichas] = useState<Fichas | null>(null)
  const [baseId, setBaseId] = useState('')
  const [brechaId, setBrechaId] = useState('')
  const [etapa, setEtapa] = useState('inicial')
  const [editor, setEditor] = useState<'base' | 'brecha' | null>(null)
  const [editando, setEditando] = useState('')
  const [nombre, setNombre] = useState('')
  const [baseFormulario, setBaseFormulario] = useState('')
  const [incidenteId, setIncidenteId] = useState('')
  const [datos, setDatos] = useState<Record<string, string>>({})
  const [error, setError] = useState('')
  const ruta = `/api/v1/exportaciones/organizaciones/${organizacionId}/urcdp`
  useEffect(() => {
    const abortador = new AbortController()
    void apiRequest<Fichas>(ruta, { method: 'GET', signal: abortador.signal }).then((actual) => { setFichas(actual); setBaseId(actual.bases[0]?.id ?? ''); setBrechaId(actual.brechas[0]?.id ?? '') }).catch(() => { if (!abortador.signal.aborted) setError('No se pudieron cargar las fichas URCDP.') })
    return () => abortador.abort()
  }, [ruta])
  function abrir(clase: 'base' | 'brecha', editar = false) {
    const base = fichas?.bases.find((b) => b.id === baseId)
    const brecha = fichas?.brechas.find((b) => b.id === brechaId)
    const registro = editar ? (clase === 'base' ? base : brecha) : null
    setEditando(registro?.id ?? ''); setNombre(clase === 'base' && editar ? base?.nombre ?? '' : '')
    setBaseFormulario(clase === 'brecha' && editar ? brecha?.baseId ?? '' : baseId)
    setIncidenteId(clase === 'brecha' && editar ? brecha?.incidenteId ?? '' : '')
    setDatos(registro?.datos ?? {}); setError(''); setEditor(clase)
  }
  async function guardar(evento: React.FormEvent) {
    evento.preventDefault()
    const recurso = editor === 'base' ? 'bases-personales' : 'notificaciones-urcdp'
    try {
      const registro = await apiRequest<{ id: string }>(`${ruta}/${recurso}${editando ? `/${editando}` : ''}`, { method: editando ? 'PUT' : 'POST', body: JSON.stringify(editor === 'base' ? { nombre, datos } : { baseId: baseFormulario, incidenteId, datos }) })
      const actual = await apiRequest<Fichas>(ruta, { method: 'GET' })
      setFichas(actual)
      if (editor === 'base') setBaseId(registro.id); else setBrechaId(registro.id)
      setEditor(null); setError(''); alCambiar(); notificarGuardado()
    } catch (fallo) { setError(fallo instanceof Error ? fallo.message : 'No se pudo guardar la ficha.') }
  }
  const esBrecha = tipo === 'brecha'
  const campos = editor === 'base' ? fichas?.camposBase ?? [] : fichas?.camposBrecha ?? []
  const fichaId = esBrecha ? brechaId : baseId
  const seleccionada = esBrecha ? fichas?.brechas.find(b => b.id === brechaId) : fichas?.bases.find(b => b.id === baseId)
  const camposDocumento = (esBrecha ? fichas?.camposBrecha ?? [] : fichas?.camposBase ?? []).filter(c => !c.opcional && (esBrecha ? etapa === 'final' || c.grupo !== 'Informe posterior' : c.grupo === 'Responsables' || c.grupo === (tipo === 'medidas' ? 'Medidas de seguridad' : 'Registro')))
  const pendientes = camposDocumento.filter(c => !seleccionada?.datos[c.id]?.trim()).length
  return <section className="panel-estructura urcdp-panel" aria-labelledby="urcdp-titulo">
    <div className="exportaciones-seccion-titulo"><div><span className="exportaciones-etiqueta">URCDP · LEY 18.331</span><h2 id="urcdp-titulo">{esBrecha ? 'Informar un incidente con datos personales' : tipo === 'medidas' ? 'Cómo protegemos los datos' : 'Qué datos personales guardamos'}</h2><p>{esBrecha ? 'Elegí el incidente, completá lo ocurrido y prepará la comunicación.' : 'Una base es un conjunto de datos personales, por ejemplo clientes o empleados. Sus datos se usan para el registro y el informe de seguridad.'}</p></div></div>
    <ol className="urcdp-guia" aria-label="Cómo preparar el documento"><li><strong>1. Elegí</strong><span>{esBrecha ? 'Seleccioná un incidente guardado o agregá uno.' : 'Seleccioná una base guardada o agregá una.'}</span></li><li><strong>2. Completá</strong><span>Revisá los datos en secciones desplegables.</span></li><li><strong>3. Generá</strong><span>Revisá la vista previa y descargá el documento.</span></li></ol>
    {error && <p className="mensaje mensaje-error" role="alert">{error}</p>}
    {!fichas && !error && <p role="status">Cargando fichas…</p>}
    {fichas && <>
      <div className="urcdp-seleccion">
        <label>{esBrecha ? 'Incidente a informar' : 'Datos de quiénes'}<select disabled={ocupado} value={fichaId} onChange={(e) => { if (esBrecha) setBrechaId(e.target.value); else setBaseId(e.target.value); alCambiar() }}><option value="">Seleccionar…</option>{esBrecha ? fichas.brechas.map((b) => <option key={b.id} value={b.id}>{b.incidente.titulo} · {b.base.nombre}</option>) : fichas.bases.map((b) => <option key={b.id} value={b.id}>{b.nombre}</option>)}</select></label>
        {esBrecha && <label>Documento<select value={etapa} disabled={ocupado} onChange={(e) => { setEtapa(e.target.value); alCambiar() }}><option value="inicial">Comunicación inicial</option><option value="final">Informe posterior de resolución</option></select></label>}
      </div>
      {!fichaId && <p className="estado-vacio">{esBrecha ? 'Registrá una base personal y un incidente de esta organización para preparar la notificación.' : 'Registrá una base personal para preparar este documento y su informe de medidas.'}</p>}
      {fichaId && <p className="urcdp-estado" role="status">{pendientes ? `${pendientes} datos pendientes para este documento. Podés completarlos o generar un borrador.` : 'Los campos principales están completos. Revisá su contenido antes de descargar.'}</p>}
      {esBrecha && <p className="urcdp-ayuda">Comunicación inicial: qué ocurrió y cómo se respondió. Informe posterior: resolución y medidas para evitar que se repita.</p>}
      <div className="acciones-exportacion">
        <button type="button" className="boton-principal" disabled={ocupado || !fichaId} onClick={() => alExportar(esBrecha ? 'la notificación de brechas URCDP' : tipo === 'medidas' ? 'el informe de medidas URCDP' : 'el registro de bases URCDP', () => exportarUrcdp(organizacionId, tipo, fichaId, etapa))}>Generar vista previa</button>
        <button type="button" disabled={ocupado || !fichaId} onClick={() => abrir(esBrecha ? 'brecha' : 'base', true)}>Revisar y completar datos</button>
        {(!esBrecha || !fichas.bases.length) && <button type="button" disabled={ocupado} onClick={() => abrir('base')}>＋ Agregar base de datos</button>}
        {esBrecha && <button type="button" disabled={ocupado || !fichas.bases.length || !fichas.incidentes.length} onClick={() => abrir('brecha')}>＋ Preparar otro incidente</button>}
      </div>
      {esBrecha && !fichas.incidentes.length && <p className="estado-vacio">Primero registrá el hecho en el menú Incidentes, asociado a un activo de esta organización. Después podrás seleccionarlo aquí.</p>}
      <p className="urcdp-ayuda">Este documento es un borrador: descargarlo no lo presenta ante URCDP. Podés guardar datos incompletos y continuar después.</p>
      <Asistente abierto={editor !== null} titulo={`${editando ? 'Editar' : 'Nueva'} ${editor === 'base' ? 'base de datos personales' : 'ficha de brecha'}`} error={error} alCerrar={() => setEditor(null)}>
        <form className="formulario-cumplimiento" onSubmit={guardar}>
          {editor === 'base' ? <label className="campo-ancho">Nombre de la base<input value={nombre} maxLength={200} required onChange={(e) => setNombre(e.target.value)} /></label> : <>
            <label>Base afectada<select required value={baseFormulario} onChange={(e) => setBaseFormulario(e.target.value)}><option value="">Seleccionar…</option>{fichas.bases.map((b) => <option key={b.id} value={b.id}>{b.nombre}</option>)}</select></label>
            <label>Incidente vinculado<select required value={incidenteId} onChange={(e) => setIncidenteId(e.target.value)}><option value="">Seleccionar…</option>{fichas.incidentes.map((i) => <option key={i.id} value={i.id}>{i.titulo}</option>)}</select></label>
          </>}
          <p className="campo-ancho urcdp-ayuda">Abrí una sección por vez. Describí tipos de datos y cantidades; no copies nombres ni datos personales de los afectados.</p>
          {[...new Set(campos.map((c) => c.grupo))].map((grupo, index) => <details className="campo-ancho urcdp-grupo" key={`${editor}-${grupo}`} open={editor === 'base' && tipo === 'medidas' ? grupo === 'Medidas de seguridad' : index === 0}><summary>{grupo}<span>{campos.filter(c => c.grupo === grupo && datos[c.id]?.trim()).length}/{campos.filter(c => c.grupo === grupo).length} completados</span></summary><p className="urcdp-ayuda">{ayudaGrupos[grupo]}</p><div className="urcdp-campos">{campos.filter((c) => c.grupo === grupo).map((campo) => <label key={campo.id}>{campo.etiqueta}{campo.opcional && ' (si corresponde)'}{campo.tipo ? <input type={campo.tipo} min={campo.tipo === 'number' ? 0 : undefined} step={campo.tipo === 'number' ? 1 : undefined} value={campo.tipo === 'datetime-local' ? horaLocal(datos[campo.id] ?? '') : datos[campo.id] ?? ''} onInput={(e) => { const valor = e.currentTarget.value; setDatos((actual) => ({ ...actual, [campo.id]: campo.tipo === 'datetime-local' && valor ? new Date(valor).toISOString() : valor })) }} /> : <textarea maxLength={10000} rows={3} value={datos[campo.id] ?? ''} onChange={(e) => { const valor = e.target.value; setDatos((actual) => ({ ...actual, [campo.id]: valor })) }} />}</label>)}</div></details>)}
          {editor === 'brecha' && <p className="campo-ancho urcdp-ayuda">Ingresá las fechas en tu hora local. La fecha de conocimiento es cuando el responsable se enteró del hecho. Completá presentación y resolución solo si ya ocurrieron.</p>}
          <div className="formulario-acciones"><button type="submit">Guardar ficha</button></div>
        </form>
      </Asistente>
    </>}
  </section>
}
