import type { TipoUnidad, UnidadArbol } from '../types/organizacion'

const nombresTipoUnidad: Record<TipoUnidad, string> = {
  AREA: 'Área',
  DIVISION: 'División',
  DEPARTAMENTO: 'Departamento',
  SECTOR: 'Sector',
}

type Props = {
  unidad: UnidadArbol
  onEditar?: (unidad: UnidadArbol) => void
  onEliminar?: (unidad: UnidadArbol) => void
}

export function UnidadNodo({ unidad, onEditar, onEliminar }: Props) {
  return (
    <li className="unidad-rama">
      <article className="unidad-tarjeta">
        <div className="unidad-detalle">
          <span className="unidad-tipo">{nombresTipoUnidad[unidad.tipo]}</span>
          <h3>{unidad.nombre}</h3>
          <p>
            {unidad.responsable
              ? `${unidad.responsable.nombre} · ${unidad.responsable.cargo}`
              : 'Sin responsable asignado'}
          </p>
        </div>
        <span
          className={`estado-responsable ${unidad.responsable ? 'asignado' : ''}`}
          aria-label={unidad.responsable ? 'Responsable asignado' : 'Sin responsable'}
        />
        {(onEditar || onEliminar) && (
          <div className="unidad-acciones">
            {onEditar && <button type="button" onClick={() => onEditar(unidad)}>Editar</button>}
            {onEliminar && <button className="boton-destructivo" type="button" onClick={() => onEliminar(unidad)}>Eliminar</button>}
          </div>
        )}
      </article>

      {unidad.hijas.length > 0 && (
        <ul className="unidad-hijas">
          {unidad.hijas.map((hija) => (
            <UnidadNodo key={hija.id} unidad={hija} onEditar={onEditar} onEliminar={onEliminar} />
          ))}
        </ul>
      )}
    </li>
  )
}
