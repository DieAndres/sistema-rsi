export type Organizacion = {
  id: string
  nombre: string
  alcanceSgsi?: string | null
  perfilMcu: 'Básico' | 'Estándar' | 'Avanzado'
}

export type Trabajador = {
  id: string
  nombre: string
  cargo: string
  correo?: string | null
  unidadOrganizativa?: { id: string; nombre: string; organizacionId?: string }
}

export type Proceso = { id: string; nombre: string; organizacionId?: string | null }

export type TipoUnidad = 'AREA' | 'DIVISION' | 'DEPARTAMENTO' | 'SECTOR'

export type Unidad = {
  id: string
  nombre: string
  tipo: TipoUnidad
  unidadPadreId: string | null
  responsable: Trabajador | null
}

export type UnidadArbol = Unidad & {
  hijas: UnidadArbol[]
}
