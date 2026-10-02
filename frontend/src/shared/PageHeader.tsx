import type { ReactNode } from 'react'

export function PageHeader({ categoria, titulo, descripcion, children }: { categoria: string; titulo: string; descripcion: string; children?: ReactNode }) {
  return <header className="encabezado-pagina"><div className="encabezado-contexto"><p className="sobretitulo">{categoria}</p><h1>{titulo}</h1><p className="introduccion">{descripcion}</p></div>{children && <div className="encabezado-herramientas">{children}</div>}</header>
}
