import { Skeleton } from '../../../shared/Skeleton'
import { Asistente } from '../../../shared/Asistente'
import { Tabla } from '../../../shared/Tabla'
import { Badge } from '../../../shared/Badge'
import { useEffect, useState } from 'react'
import { apiRequest } from '../../organizacion/api/organizacionApi'

type Formula = { codigo: string; nombre: string; unidad: string }
type Indicador = { id: string; codigo: string; nombre: string; descripcion: string | null; formula: string; meta: number; activo: boolean }
type Medicion = { id: string; valor: number; fechaRegistro: string }
const vacio = { codigo: '', nombre: '', descripcion: '', formula: '', meta: '0', activo: true }

export function IndicadoresKpi() {
  const [asistenteAbierto, setAsistenteAbierto] = useState(false)

  const [formulas, setFormulas] = useState<Formula[]>([])
  const [indicadores, setIndicadores] = useState<Indicador[]>([])
  const [datos, setDatos] = useState(vacio)
  const [editando, setEditando] = useState<string | null>(null)
  const [seleccionado, setSeleccionado] = useState('')
  const [historico, setHistorico] = useState<Medicion[]>([])
  const [cargando, setCargando] = useState(true)
  const [cargandoHistorico, setCargandoHistorico] = useState(false)
  const [recargaHistorico, setRecargaHistorico] = useState(0)
  const [ocupado, setOcupado] = useState(false)
  const [error, setError] = useState('')
  const [errorHistorico, setErrorHistorico] = useState('')
  const [mensaje, setMensaje] = useState('')

  useEffect(() => {
    const controller = new AbortController()
    void Promise.all([
      apiRequest<Formula[]>('/api/v1/kpis/formulas', { signal: controller.signal }),
      apiRequest<Indicador[]>('/api/v1/kpis/indicadores', { signal: controller.signal }),
    ]).then(([catalogo, lista]) => {
      setFormulas(catalogo)
      setIndicadores(lista)
      setDatos(actual => ({ ...actual, formula: catalogo[0]?.codigo ?? '' }))
    }).catch((e: Error) => {
      if (e.name !== 'AbortError') setError('No se pudieron cargar los indicadores y sus fórmulas. Recargá la página para reintentar.')
    }).finally(() => { if (!controller.signal.aborted) setCargando(false) })
    return () => controller.abort()
  }, [])

  useEffect(() => {
    if (!seleccionado) return
    const controller = new AbortController()
    void apiRequest<Medicion[]>(`/api/v1/kpis/indicadores/${seleccionado}/historico`, { signal: controller.signal })
      .then(setHistorico).catch((e: Error) => {
        if (e.name !== 'AbortError') setErrorHistorico('No se pudo cargar el histórico. Pulsá Actualizar histórico para reintentar.')
      }).finally(() => { if (!controller.signal.aborted) setCargandoHistorico(false) })
    return () => controller.abort()
  }, [seleccionado, recargaHistorico])

  function limpiar() { setAsistenteAbierto(false);
    setEditando(null)
    setDatos({ ...vacio, formula: formulas[0]?.codigo ?? '' })
  }

  function editar(indicador: Indicador) { setAsistenteAbierto(true);
    setEditando(indicador.id)
    setDatos({ ...indicador, descripcion: indicador.descripcion ?? '', meta: String(indicador.meta) })
    setError('')
    setMensaje('')
  }

  async function guardar(evento: React.FormEvent<HTMLFormElement>) {
    evento.preventDefault()
    const meta = Number(datos.meta)
    if (!datos.meta.trim() || !Number.isFinite(meta) || meta < 0 || !datos.nombre.trim() || !datos.formula) {
      setError('Ingresá nombre, fórmula y una meta válida mayor o igual a cero.')
      return
    }
    if (!editando && indicadores.some(i => i.codigo === datos.codigo.trim().toUpperCase())) {
      setError('Ya existe un indicador con ese código.')
      return
    }
    setOcupado(true)
    setError('')
    setMensaje('')
    try {
      const comunes = { nombre: datos.nombre.trim(), descripcion: datos.descripcion.trim(), formula: datos.formula, meta }
      const guardado = await apiRequest<Indicador>(`/api/v1/kpis/indicadores${editando ? `/${editando}` : ''}`, {
        method: editando ? 'PATCH' : 'POST',
        body: JSON.stringify(editando ? { ...comunes, activo: datos.activo } : { ...comunes, codigo: datos.codigo.trim().toUpperCase() }),
      })
      setIndicadores(lista => [...lista.filter(i => i.id !== guardado.id), guardado]
        .sort((a, b) => Number(b.activo) - Number(a.activo) || a.nombre.localeCompare(b.nombre)))
      limpiar()
      setMensaje('Indicador guardado.')
    } catch {
      setError('No se pudo guardar el indicador. Verificá los datos y que el código sea único.')
    } finally { setOcupado(false) }
  }

  function verHistorico(id: string) {
    setHistorico([])
    setErrorHistorico('')
    setCargandoHistorico(Boolean(id))
    setSeleccionado(id)
    setMensaje('')
  }

  async function medir() {
    setOcupado(true)
    setErrorHistorico('')
    setMensaje('')
    try {
      const medicion = await apiRequest<Medicion>(`/api/v1/kpis/indicadores/${seleccionado}/mediciones`, { method: 'POST' })
      setHistorico(lista => [medicion, ...lista])
      setMensaje('Medición calculada y guardada en el histórico.')
    } catch { setErrorHistorico('No se pudo registrar la medición. Comprobá que el indicador siga activo.') }
    finally { setOcupado(false) }
  }

  const indicadorActual = indicadores.find(i => i.id === seleccionado)
  const ultima = historico[0]

  return <section className="panel-estructura dashboard-panel kpi-configuracion">
    <div className="panel-encabezado"><div><p className="sobretitulo">CONFIGURACIÓN E HISTÓRICO</p><h2>Indicadores y metas</h2><p>Elegí una fórmula del catálogo y registrá mediciones para conservar su evolución.</p></div></div>
    {error && <p className="mensaje mensaje-error" role="alert">{error}</p>}
    {mensaje && <p className="mensaje" role="status">{mensaje}</p>}
    {cargando ? <Skeleton /> : <>
      <div className="asistente-lanzador"><button className="boton-principal" type="button" onClick={() => { limpiar(); setError(''); setAsistenteAbierto(true) }}>＋ Nuevo indicador</button></div><Asistente abierto={asistenteAbierto} titulo={editando ? 'Editar indicador' : 'Nuevo indicador'} error={error} alCerrar={limpiar}><form onSubmit={guardar}>
        <fieldset className="kpi-formulario" disabled={ocupado || formulas.length === 0}>
          <legend>{editando ? 'Editar indicador' : 'Nuevo indicador'}</legend>
          <label>Código<input value={datos.codigo} disabled={Boolean(editando)} required maxLength={50} pattern="[A-Z][A-Z0-9_]{1,49}" onChange={e => setDatos({ ...datos, codigo: e.target.value.toUpperCase() })} /><small>Entre 2 y 50 caracteres: mayúsculas, números o guion bajo.</small></label>
          <label>Nombre<input value={datos.nombre} required maxLength={120} onChange={e => setDatos({ ...datos, nombre: e.target.value })} /></label>
          <label>Fórmula<select value={datos.formula} required onChange={e => setDatos({ ...datos, formula: e.target.value })}>{formulas.map(f => <option key={f.codigo} value={f.codigo}>{f.nombre}</option>)}</select></label>
          <label>Meta ({formulas.find(f => f.codigo === datos.formula)?.unidad === 'PORCENTAJE' ? '%' : 'cantidad'})<input type="number" min="0" step="any" value={datos.meta} required onChange={e => setDatos({ ...datos, meta: e.target.value })} /></label>
          <label className="kpi-campo-ancho">Descripción<textarea value={datos.descripcion} maxLength={500} rows={2} onChange={e => setDatos({ ...datos, descripcion: e.target.value })} /></label>
          {editando && <label className="kpi-activo"><input type="checkbox" checked={datos.activo} onChange={e => setDatos({ ...datos, activo: e.target.checked })} /> Indicador activo</label>}
          <div className="kpi-acciones kpi-campo-ancho"><button type="submit">{ocupado ? 'Guardando…' : editando ? 'Guardar cambios' : 'Crear indicador'}</button>{editando && <button type="button" onClick={limpiar}>Cancelar edición</button>}</div>
        </fieldset>
      </form></Asistente>
      <Tabla titulo="Indicadores configurados" columnas={['Indicador', 'Fórmula', 'Meta', 'Estado', 'Acciones']} filas={indicadores.map(i => ({ id: i.id, texto: i.nombre + ' ' + i.codigo + ' ' + (i.descripcion ?? ''), celdas: [<><strong>{i.nombre}</strong><small>{i.codigo}</small>{i.descripcion && <small>{i.descripcion}</small>}</>, formulas.find(f => f.codigo === i.formula)?.nombre ?? i.formula, String(i.meta) + (formulas.find(f => f.codigo === i.formula)?.unidad === 'PORCENTAJE' ? '%' : ''), <Badge>{i.activo ? 'ACTIVO' : 'INACTIVO'}</Badge>, <button type="button" disabled={ocupado} onClick={() => editar(i)} aria-label={`Editar ${i.nombre}`}>Editar</button>] }))} />
      {indicadores.length === 0 && <p>No hay indicadores configurados. Creá el primero para comenzar.</p>}
      <div className="kpi-historico">
        <h3>Histórico de mediciones</h3>
        <div className="kpi-acciones"><label>Indicador<select value={seleccionado} disabled={ocupado} onChange={e => verHistorico(e.target.value)}><option value="">Seleccioná un indicador</option>{indicadores.map(i => <option key={i.id} value={i.id}>{i.nombre}{i.activo ? '' : ' (inactivo)'}</option>)}</select></label><button type="button" onClick={() => void medir()} disabled={!indicadorActual?.activo || ocupado || cargandoHistorico || Boolean(errorHistorico)}>{ocupado ? 'Procesando…' : 'Registrar medición actual'}</button></div>
        <p>El valor se calcula con los datos actuales de la organización. Las mediciones se guardan al pulsar el botón; no se capturan automáticamente.</p>
        {seleccionado && <button type="button" disabled={ocupado || cargandoHistorico} onClick={() => { setErrorHistorico(''); setCargandoHistorico(true); setRecargaHistorico(v => v + 1) }}>Actualizar histórico</button>}
        {indicadorActual && !indicadorActual.activo && <p>Este indicador está inactivo. Podés consultar su histórico, pero no registrar nuevas mediciones.</p>}
        {errorHistorico && <p className="mensaje mensaje-error" role="alert">{errorHistorico}</p>}
        {cargandoHistorico && <Skeleton filas={2} />}
        {indicadorActual && !cargandoHistorico && !errorHistorico && <>
          {ultima && <p><strong>Último valor: {ultima.valor}</strong> · Meta actual: {indicadorActual.meta}</p>}
          <Tabla titulo={`Mediciones de ${indicadorActual.nombre}`} columnas={['Fecha y hora', 'Valor registrado']} filas={historico.map(m => ({ id: m.id, texto: m.fechaRegistro, celdas: [<time dateTime={m.fechaRegistro}>{new Date(m.fechaRegistro).toLocaleString()}</time>, m.valor] }))} />
          {historico.length === 0 && <p>Todavía no hay mediciones para este indicador.</p>}
          <small>El histórico conserva valor y fecha. Cambiar la fórmula o la meta no recalcula los registros anteriores.</small>
        </>}
      </div>
    </>}
  </section>
}
