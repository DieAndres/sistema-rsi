import type { Unidad, UnidadArbol } from '../types/organizacion'

export function construirArbolUnidades(unidades: Unidad[]): UnidadArbol[] {
  const unidadesPorId = new Map<string, UnidadArbol>()

  for (const unidad of unidades) {
    unidadesPorId.set(unidad.id, { ...unidad, hijas: [] })
  }

  const raices: UnidadArbol[] = []

  for (const unidad of unidades) {
    const unidadArbol = unidadesPorId.get(unidad.id)

    if (!unidadArbol) {
      continue
    }

    const padre = unidad.unidadPadreId
      ? unidadesPorId.get(unidad.unidadPadreId)
      : undefined

    if (padre) {
      padre.hijas.push(unidadArbol)
    } else {
      raices.push(unidadArbol)
    }
  }

  return raices
}
