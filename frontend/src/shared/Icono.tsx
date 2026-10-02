const trazos: Record<string, string> = {
  dashboard: 'M3 3h7v7H3z M14 3h7v7h-7z M3 14h7v7H3z M14 14h7v7h-7z',
  mfa: 'M12 3l8 3v6c0 5-8 9-8 9s-8-4-8-9V6z M9 12l2 2 4-4',
  usuarios: 'M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2 M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8 M17 4a4 4 0 0 1 0 7 M22 21v-2a4 4 0 0 0-3-4',
  auditoria: 'M8 3h8v4H8z M8 5H5v16h14V5h-3 M8 12h8 M8 16h5',
  organizaciones: 'M4 21V3h12v18 M16 9h4v12 M8 7h4 M8 11h4 M8 15h4 M9 21v-3h2v3',
  organigrama: 'M9 3h6v5H9z M2 16h6v5H2z M16 16h6v5h-6z M12 8v4 M5 16v-4h14v4',
  trabajadores: 'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8 M4 21v-2a7 7 0 0 1 16 0v2',
  procesos: 'M3 4h6v6H3z M15 14h6v6h-6z M9 7h8v7 M14 11l3 3 3-3',
  raci: 'M3 4h18v16H3z M3 10h18 M9 4v16 M15 4v16 M3 15h18',
  activos: 'M3 4h18v12H3z M8 20h8 M12 16v4 M7 8h1',
  vulnerabilidades: 'M8 8h8v9a4 4 0 0 1-8 0z M9 8V6a3 3 0 0 1 6 0v2 M3 10h5 M16 10h5 M3 16h5 M16 16h5 M5 4l3 4 M19 4l-3 4',
  riesgos: 'M12 3L2 21h20z M12 9v5 M12 17v1',
  incidentes: 'M13 2L3 14h8l-1 8 11-13h-8z',
  politicas: 'M6 3h9l4 4v14H6z M14 3v5h5 M9 12h7 M9 16h7',
  evidencias: 'M8 12l6-6a4 4 0 0 1 6 6l-8 8a6 6 0 0 1-8-8l8-8 M8 12l5-5a2 2 0 0 1 3 3l-6 6',
  soa: 'M4 3h16v18H4z M8 8l1 1 2-2 M13 8h3 M8 14l1 1 2-2 M13 14h3',
  planes: 'M4 5h16v16H4z M8 3v4 M16 3v4 M4 10h16 M8 14h3 M8 17h7',
  procedimientos: 'M4 3h16v18H4z M8 7h1 M12 7h4 M8 12h1 M12 12h4 M8 17h1 M12 17h4',
  exportaciones: 'M12 3v12 M8 11l4 4 4-4 M4 16v5h16v-5',
  salir: 'M10 4H4v16h6 M10 12h11 M17 8l4 4-4 4',
  menu: 'M4 6h16 M4 12h16 M4 18h16',
}

export function Icono({ nombre }: { nombre: string }) {
  return <svg className="icono" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={trazos[nombre] ?? trazos.procedimientos} /></svg>
}
