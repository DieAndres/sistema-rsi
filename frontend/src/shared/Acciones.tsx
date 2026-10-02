import { Children, type ReactNode } from 'react'

export function Acciones({ children }: { children: ReactNode }) {
  const acciones = Children.toArray(children)
  return <div className="unidad-acciones">{acciones.length < 3 ? acciones : <>{acciones[0]}<details className="acciones-menu"><summary>Más acciones</summary><div>{acciones.slice(1)}</div></details></>}</div>
}
