import { useEffect, useState } from 'react'
import {
  actualizarUnidad,
  crearUnidad,
  eliminarUnidad,
  listarOrganizaciones,
  listarTrabajadores,
  listarUnidades,
} from '../api/organizacionApi'
import { UnidadNodo } from '../components/UnidadNodo'
import type { Organizacion, Trabajador, Unidad } from '../types/organizacion'
import { construirArbolUnidades } from '../utils/construirArbolUnidades'
import '../organizacion.css'

function mensajeDeError(error: unknown, mensajePredeterminado: string) {
  if (error instanceof Error) {
    return error.message
  }

  return mensajePredeterminado
}

export function OrganigramaPage() {
  const [organizaciones, setOrganizaciones] = useState<Organizacion[]>([])
  const [organizacionId, setOrganizacionId] = useState('')
  const [unidades, setUnidades] = useState<Unidad[]>([])
  const [trabajadores, setTrabajadores] = useState<Trabajador[]>([])
  const [cargandoOrganizaciones, setCargandoOrganizaciones] = useState(true)
  const [cargandoUnidades, setCargandoUnidades] = useState(false)
  const [errorOrganizaciones, setErrorOrganizaciones] = useState('')
  const [errorUnidades, setErrorUnidades] = useState('')
  const [nombre, setNombre] = useState('')
  const [tipo, setTipo] = useState<Unidad['tipo']>('AREA')
  const [unidadPadreId, setUnidadPadreId] = useState('')
  const [responsableId, setResponsableId] = useState('')
  const [unidadEditando, setUnidadEditando] = useState<Unidad | null>(null)
  const [guardando, setGuardando] = useState(false)

  useEffect(() => {
    const controlador = new AbortController()

    async function cargarOrganizaciones() {
      try {
        const datos = await listarOrganizaciones(controlador.signal)

        setOrganizaciones(datos)
        setOrganizacionId(datos[0]?.id ?? '')
      } catch (error) {
        if (error instanceof DOMException && error.name === 'AbortError') {
          return
        }

        setErrorOrganizaciones(
          mensajeDeError(error, 'No se pudieron cargar las organizaciones.'),
        )
      } finally {
        if (!controlador.signal.aborted) {
          setCargandoOrganizaciones(false)
        }
      }
    }

    void cargarOrganizaciones()

    return () => controlador.abort()
  }, [])

  useEffect(() => {
    if (!organizacionId) {
      return
    }

    const controlador = new AbortController()

    async function cargarUnidades() {
      setUnidades([])
      setErrorUnidades('')
      setCargandoUnidades(true)

      try {
        const [datos, trabajadoresDeOrganizacion] = await Promise.all([
          listarUnidades(organizacionId, controlador.signal),
          listarTrabajadores(),
        ])
        const idsUnidades = new Set(datos.map((unidad) => unidad.id))
        setUnidades(datos)
        setTrabajadores(trabajadoresDeOrganizacion.filter((trabajador) =>
          trabajador.unidadOrganizativa && idsUnidades.has(trabajador.unidadOrganizativa.id),
        ))
      } catch (error) {
        if (error instanceof DOMException && error.name === 'AbortError') {
          return
        }

        setErrorUnidades(
          mensajeDeError(error, 'No se pudieron cargar las unidades.'),
        )
      } finally {
        if (!controlador.signal.aborted) {
          setCargandoUnidades(false)
        }
      }
    }

    void cargarUnidades()

    return () => controlador.abort()
  }, [organizacionId])

  const arbol = construirArbolUnidades(unidades)
  const organizacionSeleccionada = organizaciones.find(
    (organizacion) => organizacion.id === organizacionId,
  )

  function prepararEdicion(unidad: Unidad) {
    setUnidadEditando(unidad)
    setNombre(unidad.nombre)
    setTipo(unidad.tipo)
    setUnidadPadreId(unidad.unidadPadreId ?? '')
    setResponsableId(unidad.responsable?.id ?? '')
  }

  function limpiarFormulario() {
    setUnidadEditando(null)
    setNombre('')
    setTipo('AREA')
    setUnidadPadreId('')
    setResponsableId('')
  }

  async function guardarUnidad(evento: React.FormEvent<HTMLFormElement>) {
    evento.preventDefault()
    if (!organizacionId || !nombre.trim()) return
    setGuardando(true)
    setErrorUnidades('')
    try {
      const datos = { nombre: nombre.trim(), tipo, ...(unidadPadreId && { unidadPadreId }), ...(responsableId && { responsableId }) }
      if (unidadEditando) await actualizarUnidad(unidadEditando.id, datos)
      else await crearUnidad(organizacionId, datos)
      setUnidades(await listarUnidades(organizacionId, new AbortController().signal))
      limpiarFormulario()
    } catch (error) {
      setErrorUnidades(mensajeDeError(error, 'No se pudo guardar la unidad.'))
    } finally {
      setGuardando(false)
    }
  }

  async function borrarUnidad(unidad: Unidad) {
    if (!window.confirm(`¿Eliminar la unidad “${unidad.nombre}”?`)) return
    try {
      await eliminarUnidad(unidad.id)
      setUnidades(await listarUnidades(organizacionId, new AbortController().signal))
    } catch (error) {
      setErrorUnidades(mensajeDeError(error, 'No se pudo eliminar la unidad.'))
    }
  }

  return (
    <div className="aplicacion">
      <header className="barra-superior">
        <a className="marca" href="/" aria-label="RSI, inicio">
          <span className="marca-simbolo">R</span>
          <span className="marca-texto">
            <strong>RSI</strong>
            <small>Gestión integrada</small>
          </span>
        </a>
        <span className="entorno">Sistema de gestión</span>
      </header>

      <main className="contenido">
        <div className="encabezado-pagina">
          <div>
            <p className="sobretitulo">ORGANIZACIÓN</p>
            <h1>Organigrama</h1>
            <p className="introduccion">
              Consultá la estructura y las personas responsables de cada unidad.
            </p>
          </div>

          <label className="selector-organizacion">
            <span>Organización</span>
            <select
              value={organizacionId}
              onChange={(evento) => setOrganizacionId(evento.target.value)}
              disabled={cargandoOrganizaciones || organizaciones.length === 0}
            >
              {organizaciones.length === 0 && (
                <option value="">
                  {cargandoOrganizaciones ? 'Cargando…' : 'Sin organizaciones'}
                </option>
              )}
              {organizaciones.map((organizacion) => (
                <option key={organizacion.id} value={organizacion.id}>
                  {organizacion.nombre}
                </option>
              ))}
            </select>
          </label>
        </div>

        {errorOrganizaciones && (
          <p className="mensaje mensaje-error" role="alert">
            No se pudieron cargar las organizaciones. Verificá que el backend esté
            iniciado. {errorOrganizaciones}
          </p>
        )}

        <section className="panel-estructura" aria-labelledby="titulo-estructura">
          <div className="panel-encabezado">
            <div>
              <p className="sobretitulo">ESTRUCTURA ORGANIZATIVA</p>
              <h2 id="titulo-estructura">
                {organizacionSeleccionada?.nombre ?? 'Unidades'}
              </h2>
            </div>
            <div className="contador-unidades">
              <strong>{unidades.length}</strong>
              <span>{unidades.length === 1 ? 'unidad' : 'unidades'}</span>
            </div>
          </div>

          <form className="formulario-unidad" onSubmit={guardarUnidad}>
            <h3>{unidadEditando ? 'Editar unidad' : 'Nueva unidad'}</h3>
            <label>Nombre<input value={nombre} onChange={(e) => setNombre(e.target.value)} required /></label>
            <label>Tipo<select value={tipo} onChange={(e) => setTipo(e.target.value as Unidad['tipo'])}>
              <option value="AREA">Área</option><option value="DIVISION">División</option>
              <option value="DEPARTAMENTO">Departamento</option><option value="SECTOR">Sector</option>
            </select></label>
            <label>Unidad padre<select value={unidadPadreId} onChange={(e) => setUnidadPadreId(e.target.value)}>
              <option value="">Sin unidad padre</option>
              {unidades.filter((unidad) => unidad.id !== unidadEditando?.id).map((unidad) => <option key={unidad.id} value={unidad.id}>{unidad.nombre}</option>)}
            </select></label>
            <label>Responsable<select value={responsableId} onChange={(e) => setResponsableId(e.target.value)}>
              <option value="">Sin responsable</option>
              {trabajadores.map((trabajador) => <option key={trabajador.id} value={trabajador.id}>{trabajador.nombre} · {trabajador.cargo}</option>)}
            </select></label>
            <div className="formulario-acciones"><button type="submit" disabled={guardando}>{guardando ? 'Guardando…' : unidadEditando ? 'Guardar cambios' : 'Crear unidad'}</button>{unidadEditando && <button type="button" onClick={limpiarFormulario}>Cancelar</button>}</div>
          </form>

          {cargandoUnidades && (
            <p className="mensaje" role="status">
              Cargando estructura…
            </p>
          )}

          {errorUnidades && (
            <p className="mensaje mensaje-error" role="alert">
              No se pudieron cargar las unidades. {errorUnidades}
            </p>
          )}

          {!cargandoUnidades &&
            !errorUnidades &&
            organizaciones.length > 0 &&
            unidades.length === 0 && (
              <div className="estado-vacio">
                <span className="estado-vacio-icono" aria-hidden="true">
                  ◎
                </span>
                <h3>Todavía no hay unidades</h3>
                <p>
                  Esta organización aún no tiene unidades organizativas registradas.
                </p>
              </div>
            )}

          {!cargandoUnidades && !errorUnidades && arbol.length > 0 && (
            <ul className="arbol-unidades">
              {arbol.map((unidad) => (
                <UnidadNodo key={unidad.id} unidad={unidad} onEditar={prepararEdicion} onEliminar={borrarUnidad} />
              ))}
            </ul>
          )}

          {!cargandoOrganizaciones &&
            !errorOrganizaciones &&
            organizaciones.length === 0 && (
              <div className="estado-vacio">
                <span className="estado-vacio-icono" aria-hidden="true">
                  ◎
                </span>
                <h3>No hay organizaciones registradas</h3>
                <p>
                  Cuando haya una organización disponible, su organigrama aparecerá
                  aquí.
                </p>
              </div>
            )}
        </section>
      </main>
    </div>
  )
}
