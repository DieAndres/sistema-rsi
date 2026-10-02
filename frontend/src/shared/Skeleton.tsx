export function Skeleton({ filas = 3 }: { filas?: number }) {
  return <div className="skeleton-lista" role="status" aria-label="Cargando información"><span className="solo-lectores">Cargando información…</span>{Array.from({ length: filas }, (_, i) => <div className="skeleton-fila" key={i} aria-hidden="true"><span /><span /></div>)}</div>
}
