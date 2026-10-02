import { useState, type ReactNode } from 'react'

type Fila = { id: string; texto: string; celdas: ReactNode[] }

export function Tabla({ titulo, columnas, filas }: { titulo: string; columnas: string[]; filas: Fila[] }) {
  const [busqueda, setBusqueda] = useState('')
  const [descendente, setDescendente] = useState(false)
  const [pagina, setPagina] = useState(1)
  const visibles = filas.filter(f => f.texto.toLocaleLowerCase().includes(busqueda.toLocaleLowerCase()))
    .sort((a, b) => a.texto.localeCompare(b.texto, 'es', { numeric: true }) * (descendente ? -1 : 1))
  const paginas = Math.max(1, Math.ceil(visibles.length / 10))
  const actual = Math.min(pagina, paginas)
  return <section className="tabla-registros" aria-label={titulo}>
    <span className="tabla-conteo" role="status">{visibles.length} registros</span>
    <label className="tabla-busqueda">Buscar en {titulo}<input type="search" value={busqueda} onChange={e => { setBusqueda(e.target.value); setPagina(1) }} /></label>
    <div className="kpi-tabla"><table><caption>{titulo}</caption><thead><tr>{columnas.map((columna, i) => <th scope="col" key={columna} aria-sort={i === 0 ? descendente ? 'descending' : 'ascending' : undefined}>{i === 0 ? <button type="button" onClick={() => { setDescendente(!descendente); setPagina(1) }}>{columna} {descendente ? '↓' : '↑'}</button> : columna}</th>)}</tr></thead><tbody>{visibles.slice((actual - 1) * 10, actual * 10).map(fila => <tr key={fila.id}>{fila.celdas.map((celda, i) => <td key={i}>{celda}</td>)}</tr>)}{!visibles.length && <tr><td colSpan={columnas.length}>No hay registros para mostrar{busqueda ? ' con esta búsqueda' : ''}.</td></tr>}</tbody></table></div>
    {paginas > 1 && <nav className="listado-paginacion" aria-label={`Paginación de ${titulo}`}><button disabled={actual === 1} onClick={() => setPagina(actual - 1)}>Anterior</button><span aria-live="polite">Página {actual} de {paginas}</span><button disabled={actual === paginas} onClick={() => setPagina(actual + 1)}>Siguiente</button></nav>}
  </section>
}
