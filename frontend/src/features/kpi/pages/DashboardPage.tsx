import { Skeleton } from '../../../shared/Skeleton'
import { PageHeader } from '../../../shared/PageHeader'
import { useEffect, useState } from 'react'
import { apiGet } from '../../../shared/api/apiGet'
import '../kpi.css'
import { IndicadoresKpi } from '../components/IndicadoresKpi'

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

export function DashboardPage({ alNavegar }: { alNavegar: (pantalla: 'activos' | 'riesgos' | 'vulnerabilidades' | 'incidentes') => void }) {
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

  return <div className="aplicacion"><main className="contenido"><PageHeader categoria="INDICADORES" titulo="Dashboard de seguridad" descripcion="Resumen actual de los principales indicadores de gestión."></PageHeader>{error && <p className="mensaje mensaje-error" role="alert">{error}</p>}{!resumen && !error && <Skeleton filas={4} />}{resumen && <><section className="kpi-grid"><article className="kpi-tarjeta"><span>Activos registrados</span><strong>{resumen.activos.total}</strong><small>{resumen.activos.porcentajeConResponsable}% con responsable</small></article><article className="kpi-tarjeta kpi-alerta"><span>Riesgos abiertos</span><strong>{resumen.riesgos.abiertos}</strong><small>Requieren seguimiento</small></article><article className="kpi-tarjeta kpi-alerta"><span>Vulnerabilidades abiertas</span><strong>{resumen.vulnerabilidades.abiertas}</strong><small>{resumen.vulnerabilidades.criticas} críticas</small></article><article className="kpi-tarjeta"><span>Incidentes registrados</span><strong>{totalIncidentes}</strong><small>{resumen.incidentes.ABIERTO ?? 0} abiertos</small></article></section><div className="dashboard-resumen"><section className="panel-estructura dashboard-panel"><div className="panel-encabezado"><div><p className="sobretitulo">DETALLE</p><h2>Estado de incidentes</h2></div></div><div className="incidentes-resumen">{Object.entries(resumen.incidentes).map(([estado, cantidad]) => <div className="incidente-fila" key={estado}><span>{etiquetasIncidente[estado] ?? estado}</span><div className="barra-fondo"><div className="barra-valor" style={{ width: `${totalIncidentes ? (cantidad / totalIncidentes) * 100 : 0}%` }} /></div><strong>{cantidad}</strong></div>)}{totalIncidentes === 0 && <p className="estado-vacio">No hay incidentes registrados.</p>}</div></section><section className="panel-estructura dashboard-panel"><div className="panel-encabezado"><div><p className="sobretitulo">PRIORIDADES</p><h2>Requieren atención</h2></div></div><button className="atencion-fila" type="button" onClick={() => alNavegar('vulnerabilidades')}><span>Vulnerabilidades críticas</span><strong>{resumen.vulnerabilidades.criticas}</strong></button><button className="atencion-fila" type="button" onClick={() => alNavegar('riesgos')}><span>Riesgos abiertos</span><strong>{resumen.riesgos.abiertos}</strong></button><button className="atencion-fila" type="button" onClick={() => alNavegar('activos')}><span>Activos sin responsable</span><strong>{resumen.activos.total - resumen.activos.conResponsable}</strong></button><button className="atencion-fila" type="button" onClick={() => alNavegar('incidentes')}><span>Incidentes abiertos</span><strong>{resumen.incidentes.ABIERTO ?? 0}</strong></button><p className="dashboard-nota">Consultá cada módulo para revisar responsables, tratamiento y evidencias.</p></section></div></>}<IndicadoresKpi /></main></div>
}
