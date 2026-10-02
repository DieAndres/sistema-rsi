import type { ReactNode } from 'react'

export function Badge({ children }: { children: ReactNode }) {
  const texto = (Array.isArray(children) ? children : [children]).join(' ').replaceAll('_', ' ').replace(/\s+/g, ' ').trim()
  const estado = texto.toUpperCase()
  const tono = /CR[IÍ]TIC|ALTA|FALLO|ERROR/.test(estado) ? 'critico' : /EN TRATAMIENTO|EN IMPLEMENTACION|CONTENIDO|CONTENCION/.test(estado) ? 'informativo' : /ABIERT|PENDIENT|MEDIA|BORRADOR/.test(estado) ? 'pendiente' : /CERRAD|MITIGAD|RECUPERAD|COMPLETAD|ACTIVO|BAJA/.test(estado) && !estado.includes('INACTIVO') ? 'correcto' : 'neutro'
  return <span className={`unidad-tipo badge-${tono}`}><span className="badge-indicador" aria-hidden="true">●</span>{texto}</span>
}
