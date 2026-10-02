import { Children, isValidElement, useState, type ReactNode } from 'react'
import { Badge } from './Badge'
import { Skeleton } from './Skeleton'

function texto(nodo: ReactNode): string {
  if (typeof nodo === 'string' || typeof nodo === 'number') return String(nodo)
  if (isValidElement<{ children?: ReactNode }>(nodo)) return nodo.type === 'button' || nodo.type === 'form' ? '' : texto(nodo.props.children)
  return Children.toArray(nodo).map(texto).join(' ')
}

function titulo(nodo: ReactNode): string {
  if (isValidElement<{ children?: ReactNode }>(nodo)) {
    if (nodo.type === 'h3') return texto(nodo.props.children)
    return Children.toArray(nodo.props.children).map(titulo).find(Boolean) ?? ''
  }
  return ''
}

function etiquetas(nodo: ReactNode): string[] {
  if (!isValidElement<{ children?: ReactNode; className?: string }>(nodo)) return []
  if (nodo.props.className === 'unidad-tipo' || nodo.type === Badge) return texto(nodo.props.children).split('·').map(s => s.trim()).filter(s => Boolean(s) && !/^(Puntaje|CVSS|v\d)/i.test(s))
  return Children.toArray(nodo.props.children).flatMap(etiquetas)
}

export function Listado({ children, cargando = false }: { children: ReactNode; cargando?: boolean }) {
  const [busqueda, setBusqueda] = useState('')
  const [orden, setOrden] = useState('original')
  const [pagina, setPagina] = useState(1)
  const [filtro, setFiltro] = useState('')
  const filas = Children.toArray(children).filter(isValidElement)
  const opciones = [...new Set(filas.flatMap(etiquetas))].sort((a, b) => a.localeCompare(b, 'es'))
  const visibles = filas.filter(fila => texto(fila).toLocaleLowerCase().includes(busqueda.toLocaleLowerCase()) && (!filtro || etiquetas(fila).includes(filtro)))
  if (orden !== 'original') visibles.sort((a, b) => (titulo(a) || texto(a)).localeCompare(titulo(b) || texto(b), 'es', { numeric: true }) * (orden === 'asc' ? 1 : -1))
  const paginas = Math.max(1, Math.ceil(visibles.length / 10))
  const actual = Math.min(pagina, paginas)
  if (cargando) return <Skeleton />
  return <section className="listado" aria-label="Registros">
    <div className="listado-herramientas"><label>Buscar registros<input type="search" value={busqueda} placeholder="Nombre, estado o responsable…" onChange={e => { setBusqueda(e.target.value); setPagina(1) }} /></label>{opciones.length > 0 && <label>Estado o tipo<select value={filtro} onChange={e => { setFiltro(e.target.value); setPagina(1) }}><option value="">Todos</option>{[...new Set([...opciones, ...(filtro ? [filtro] : [])])].map(opcion => <option key={opcion}>{opcion}</option>)}</select></label>}<label>Ordenar<select value={orden} onChange={e => { setOrden(e.target.value); setPagina(1) }}><option value="original">Orden original</option><option value="asc">Nombre A → Z</option><option value="desc">Nombre Z → A</option></select></label><span role="status">{visibles.length} registros</span></div>
    <div className="lista-registros">{visibles.slice((actual - 1) * 10, actual * 10)}</div>
    {!visibles.length && <div className="estado-vacio"><h3>{busqueda || filtro ? 'Sin coincidencias' : 'Sin registros para mostrar'}</h3><p>{busqueda || filtro ? 'Probá otra búsqueda o limpiá los filtros.' : 'Comprobá la organización seleccionada o agregá el primer registro.'}</p>{(busqueda || filtro) && <button type="button" onClick={() => { setBusqueda(''); setFiltro(''); setPagina(1) }}>Limpiar búsqueda</button>}</div>}
    {paginas > 1 && <nav className="listado-paginacion" aria-label="Paginación de registros"><button disabled={actual === 1} onClick={() => setPagina(actual - 1)}>Anterior</button><span aria-live="polite">Página {actual} de {paginas}</span><button disabled={actual === paginas} onClick={() => setPagina(actual + 1)}>Siguiente</button></nav>}
  </section>
}
