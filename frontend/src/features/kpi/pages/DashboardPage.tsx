import { useEffect, useState } from 'react'
import { apiGet } from '../../../shared/api/apiGet'
import '../kpi.css'

type ResumenKpi = {
  activos: { total: number; conResponsable: number; porcentajeConResponsable: number }
  riesgos: { abiertos: number }
  vulnerabilidades: { abiertas: number; criticas: number }
  incidentes: Record<string, number>
}

const etiquetasIncidente: Record<string, string> = {
  ABIERTO: 'Abiertos',
  EN_CONTENCION: 'En contención',
  RECUPERADO: 'Recuperados',
  CERRADO: 'Cerrados',
}

export function DashboardPage() {
  const [resumen, setResumen] = useState<ResumenKpi | null>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    const controlador = new AbortController()
    apiGet<ResumenKpi>('/api/v1/kpis/resumen', controlador.signal)
      .then(setResumen)
      .catch((e: Error) => {
        if (e.name !== 'AbortError') setError('No se pudo cargar el resumen de KPIs.')
      })
    return () => controlador.abort()
  }, [])

  const totalIncidentes = resumen
    ? Object.values(resumen.incidentes).reduce((total, cantidad) => total + cantidad, 0)
    : 0

  return <div className="aplicacion"><header className="barra-superior"><span className="marca"><span className="marca-simbolo">R</span><span className="marca-texto"><strong>RSI</strong><small>Gestión integrada</small></span></span><span className="entorno">Sistema de gestión</span></header><main className="contenido"><div className="encabezado-pagina"><div><p className="sobretitulo">INDICADORES</p><h1>Dashboard de seguridad</h1><p className="introduccion">Resumen actual de los principales indicadores de gestión.</p></div></div>{error && <p className="mensaje mensaje-error">{error}</p>}{!resumen && !error && <p className="mensaje">Cargando indicadores...</p>}{resumen && <><section className="kpi-grid"><article className="kpi-tarjeta"><span>Activos registrados</span><strong>{resumen.activos.total}</strong><small>{resumen.activos.porcentajeConResponsable}% con responsable</small></article><article className="kpi-tarjeta kpi-alerta"><span>Riesgos abiertos</span><strong>{resumen.riesgos.abiertos}</strong><small>Requieren seguimiento</small></article><article className="kpi-tarjeta kpi-alerta"><span>Vulnerabilidades abiertas</span><strong>{resumen.vulnerabilidades.abiertas}</strong><small>{resumen.vulnerabilidades.criticas} críticas</small></article><article className="kpi-tarjeta"><span>Incidentes registrados</span><strong>{totalIncidentes}</strong><small>{resumen.incidentes.ABIERTO ?? 0} abiertos</small></article></section><section className="panel-estructura dashboard-panel"><div className="panel-encabezado"><div><p className="sobretitulo">DETALLE</p><h2>Estado de incidentes</h2></div></div><div className="incidentes-resumen">{Object.entries(resumen.incidentes).map(([estado, cantidad]) => <div className="incidente-fila" key={estado}><span>{etiquetasIncidente[estado] ?? estado}</span><div className="barra-fondo"><div className="barra-valor" style={{ width: `${totalIncidentes ? (cantidad / totalIncidentes) * 100 : 0}%` }} /></div><strong>{cantidad}</strong></div>)}{totalIncidentes === 0 && <p className="estado-vacio">No hay incidentes registrados.</p>}</div></section></>}</main></div>
}
