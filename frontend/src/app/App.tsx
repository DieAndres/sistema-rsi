import { Toast } from '../shared/Toast'
import { Icono } from '../shared/Icono'
import { useEffect, useState } from 'react'
import { LoginPage } from '../features/auth/LoginPage'
import { UsuariosPage } from '../features/auth/UsuariosPage'
import { AuditoriaPage } from '../features/auth/AuditoriaPage'
import { MfaPage } from '../features/auth/MfaPage'
import { apiGet, obtenerToken, obtenerUsuarioActual, eliminarToken, eliminarUsuarioActual } from '../shared/api/apiGet'
import { DashboardPage } from '../features/kpi/pages/DashboardPage'
import { OrganizacionesPage } from '../features/organizacion/pages/OrganizacionesPage'
import { OrganigramaPage } from '../features/organizacion/pages/OrganigramaPage'
import { TrabajadoresPage } from '../features/organizacion/pages/TrabajadoresPage'
import { ProcesosPage } from '../features/organizacion/pages/ProcesosPage'
import { RaciPage } from '../features/organizacion/pages/RaciPage'
import { ActivosPage } from '../features/seguridad/pages/ActivosPage'
import { VulnerabilidadesPage } from '../features/seguridad/pages/VulnerabilidadesPage'
import { RiesgosPage } from '../features/seguridad/pages/RiesgosPage'
import { IncidentesPage } from '../features/seguridad/pages/IncidentesPage'
import { PoliticasPage } from '../features/cumplimiento/pages/PoliticasPage'
import { EvidenciasPage } from '../features/cumplimiento/pages/EvidenciasPage'
import { PlanesPage } from '../features/cumplimiento/pages/PlanesPage'
import { ProcedimientosPage } from '../features/cumplimiento/pages/ProcedimientosPage'
import { ExportacionesPage } from '../features/cumplimiento/pages/ExportacionesPage'
import { EvaluacionSoaPage } from '../features/cumplimiento/pages/EvaluacionSoaPage'

type Pantalla = 'dashboard' | 'mfa' | 'usuarios' | 'auditoria' | 'organizaciones' | 'organigrama' | 'trabajadores' | 'procesos' | 'raci' | 'activos' | 'vulnerabilidades' | 'riesgos' | 'incidentes' | 'politicas' | 'evidencias' | 'planes' | 'procedimientos' | 'soa' | 'exportaciones'

const titulos: Record<Pantalla, string> = { dashboard: 'Dashboard', mfa: 'Seguridad de cuenta', usuarios: 'Usuarios', auditoria: 'Auditoría', organizaciones: 'Organizaciones', organigrama: 'Unidades', trabajadores: 'Trabajadores', procesos: 'Procesos', raci: 'Matriz RACI', activos: 'Activos', vulnerabilidades: 'Vulnerabilidades', riesgos: 'Riesgos', incidentes: 'Incidentes', politicas: 'Políticas', evidencias: 'Evidencias', planes: 'Planes e hitos', procedimientos: 'Procedimientos', soa: 'Evaluación SOA', exportaciones: 'Exportaciones' }

function App() {
  const [autenticado, setAutenticado] = useState(Boolean(obtenerToken()))
  const [usuario, setUsuario] = useState(obtenerUsuarioActual())
  const [pantalla, setPantalla] = useState<Pantalla>(['ADMINISTRADOR', 'RSI'].includes(usuario?.rol ?? '') ? 'dashboard' : 'activos')
  const [colapsada, setColapsada] = useState(() => window.innerWidth < 700)
  const esAdmin = usuario?.rol === 'ADMINISTRADOR'
  const puedeGestionarOrganizacion = esAdmin || usuario?.rol === 'RSI'
  const mfaPendiente = ['ADMINISTRADOR', 'RSI'].includes(usuario?.rol ?? '') && usuario?.mfaConfirmado === false

  useEffect(() => {
    if (!obtenerToken()) return
    void apiGet<typeof usuario>('/api/v1/auth/me', new AbortController().signal).then((actual) => {
      setUsuario(actual)
      if (['ADMINISTRADOR', 'RSI'].includes(actual?.rol ?? '') && actual?.mfaConfirmado === false) setPantalla('mfa')
      else setPantalla(['ADMINISTRADOR', 'RSI'].includes(actual?.rol ?? '') ? 'dashboard' : 'activos')
    }).catch(() => undefined)
  }, [])

  if (!autenticado) return <LoginPage onLogin={(mfaSetupRequired, actual) => { setUsuario(actual); setPantalla(mfaSetupRequired ? 'mfa' : ['ADMINISTRADOR', 'RSI'].includes(actual?.rol ?? '') ? 'dashboard' : 'activos'); setAutenticado(true) }} />

  async function salir() {
    const token = obtenerToken()
    if (token) await fetch('/api/v1/auth/logout', { method: 'POST', headers: { Authorization: `Bearer ${token}` } })
    eliminarToken()
    eliminarUsuarioActual()
    setUsuario(null)
    setAutenticado(false)
  }

  return <div className={`app-shell ${colapsada ? 'sidebar-colapsada' : ''} ${usuario?.rol === 'DUENO_UNIDAD' ? 'rol-dueno-unidad' : ''} ${usuario?.rol === 'LECTOR' ? 'rol-lector' : ''}`}>
    <Toast /><a className="saltar-contenido" href="#contenido-principal">Saltar al contenido</a><aside className="sidebar"><div className="sidebar-marca"><span className="marca-simbolo">R</span><div><strong>RSI</strong><small>Gestión integrada</small></div></div><nav className="navegacion-app" aria-label="Navegación principal" id="navegacion-rsi">
      <div className="menu-grupo"><span>Inicio</span>{!mfaPendiente && puedeGestionarOrganizacion && <button type="button" title="Dashboard" aria-label="Dashboard" aria-current={pantalla === 'dashboard' ? 'page' : undefined} onClick={() => setPantalla('dashboard')}><Icono nombre="dashboard" /><span className="nav-etiqueta">Dashboard</span></button>}<button type="button" title="Seguridad de cuenta" aria-label="Seguridad de cuenta" aria-current={pantalla === 'mfa' ? 'page' : undefined} onClick={() => setPantalla('mfa')}><Icono nombre="mfa" /><span className="nav-etiqueta">Seguridad de cuenta</span></button>{!mfaPendiente && usuario?.rol === 'ADMINISTRADOR' && <><button type="button" title="Usuarios" aria-label="Usuarios" aria-current={pantalla === 'usuarios' ? 'page' : undefined} onClick={() => setPantalla('usuarios')}><Icono nombre="usuarios" /><span className="nav-etiqueta">Usuarios</span></button><button type="button" title="Auditoría" aria-label="Auditoría" aria-current={pantalla === 'auditoria' ? 'page' : undefined} onClick={() => setPantalla('auditoria')}><Icono nombre="auditoria" /><span className="nav-etiqueta">Auditoría</span></button></>}<button type="button" onClick={() => void salir()} title="Cerrar sesión" aria-label="Cerrar sesión"><Icono nombre="salir" /><span className="nav-etiqueta">Cerrar sesión</span></button></div>
      {!mfaPendiente && <><div className="menu-grupo"><span>Organización</span>{puedeGestionarOrganizacion && <><button type="button" title="Organizaciones" aria-label="Organizaciones" aria-current={pantalla === 'organizaciones' ? 'page' : undefined} onClick={() => setPantalla('organizaciones')}><Icono nombre="organizaciones" /><span className="nav-etiqueta">Organizaciones</span></button><button type="button" title="Unidades" aria-label="Unidades" aria-current={pantalla === 'organigrama' ? 'page' : undefined} onClick={() => setPantalla('organigrama')}><Icono nombre="organigrama" /><span className="nav-etiqueta">Unidades</span></button></>}<button type="button" title="Trabajadores" aria-label="Trabajadores" aria-current={pantalla === 'trabajadores' ? 'page' : undefined} onClick={() => setPantalla('trabajadores')}><Icono nombre="trabajadores" /><span className="nav-etiqueta">Trabajadores</span></button><button type="button" title="Procesos" aria-label="Procesos" aria-current={pantalla === 'procesos' ? 'page' : undefined} onClick={() => setPantalla('procesos')}><Icono nombre="procesos" /><span className="nav-etiqueta">Procesos</span></button>{puedeGestionarOrganizacion && <button type="button" title="RACI" aria-label="RACI" aria-current={pantalla === 'raci' ? 'page' : undefined} onClick={() => setPantalla('raci')}><Icono nombre="raci" /><span className="nav-etiqueta">RACI</span></button>}</div>
      <div className="menu-grupo"><span>Seguridad</span><button type="button" title="Activos" aria-label="Activos" aria-current={pantalla === 'activos' ? 'page' : undefined} onClick={() => setPantalla('activos')}><Icono nombre="activos" /><span className="nav-etiqueta">Activos</span></button><button type="button" title="Vulnerabilidades" aria-label="Vulnerabilidades" aria-current={pantalla === 'vulnerabilidades' ? 'page' : undefined} onClick={() => setPantalla('vulnerabilidades')}><Icono nombre="vulnerabilidades" /><span className="nav-etiqueta">Vulnerabilidades</span></button><button type="button" title="Riesgos" aria-label="Riesgos" aria-current={pantalla === 'riesgos' ? 'page' : undefined} onClick={() => setPantalla('riesgos')}><Icono nombre="riesgos" /><span className="nav-etiqueta">Riesgos</span></button><button type="button" title="Incidentes" aria-label="Incidentes" aria-current={pantalla === 'incidentes' ? 'page' : undefined} onClick={() => setPantalla('incidentes')}><Icono nombre="incidentes" /><span className="nav-etiqueta">Incidentes</span></button></div>
      <div className="menu-grupo"><span>Cumplimiento</span><button type="button" title="Políticas" aria-label="Políticas" aria-current={pantalla === 'politicas' ? 'page' : undefined} onClick={() => setPantalla('politicas')}><Icono nombre="politicas" /><span className="nav-etiqueta">Políticas</span></button><button type="button" title="Evidencias" aria-label="Evidencias" aria-current={pantalla === 'evidencias' ? 'page' : undefined} onClick={() => setPantalla('evidencias')}><Icono nombre="evidencias" /><span className="nav-etiqueta">Evidencias</span></button><button type="button" title="Evaluación SOA" aria-label="Evaluación SOA" aria-current={pantalla === 'soa' ? 'page' : undefined} onClick={() => setPantalla('soa')}><Icono nombre="soa" /><span className="nav-etiqueta">Evaluación SOA</span></button><button type="button" title="Planes e hitos" aria-label="Planes e hitos" aria-current={pantalla === 'planes' ? 'page' : undefined} onClick={() => setPantalla('planes')}><Icono nombre="planes" /><span className="nav-etiqueta">Planes e hitos</span></button><button type="button" title="Procedimientos" aria-label="Procedimientos" aria-current={pantalla === 'procedimientos' ? 'page' : undefined} onClick={() => setPantalla('procedimientos')}><Icono nombre="procedimientos" /><span className="nav-etiqueta">Procedimientos</span></button><button type="button" title="Exportaciones" aria-label="Exportaciones" aria-current={pantalla === 'exportaciones' ? 'page' : undefined} onClick={() => setPantalla('exportaciones')}><Icono nombre="exportaciones" /><span className="nav-etiqueta">Exportaciones</span></button></div></>}
    </nav><div className="sidebar-pie">Seguridad · Riesgos · Cumplimiento</div></aside><div className="app-workspace"><header className="app-header"><button type="button" className="sidebar-toggle" aria-controls="navegacion-rsi" aria-expanded={!colapsada} aria-label={colapsada ? 'Expandir navegación' : 'Colapsar navegación'} onClick={() => setColapsada(!colapsada)}><Icono nombre="menu" /></button><div className="app-breadcrumb"><span>Espacio de trabajo</span><span aria-hidden="true">/</span><strong>{titulos[pantalla]}</strong></div><div className="app-identidad"><span className="app-correo">{usuario?.correo}</span><span className="app-rol">{usuario?.rol?.replaceAll('_', ' ')}</span></div></header><div id="contenido-principal" tabIndex={-1}>
    {pantalla === 'dashboard' ? (puedeGestionarOrganizacion ? <DashboardPage alNavegar={setPantalla} /> : <ActivosPage />) : pantalla === 'mfa' ? <MfaPage /> : pantalla === 'usuarios' ? <UsuariosPage /> : pantalla === 'auditoria' ? <AuditoriaPage /> : pantalla === 'organizaciones' ? <OrganizacionesPage /> : pantalla === 'organigrama' ? <OrganigramaPage /> : pantalla === 'trabajadores' ? <TrabajadoresPage /> : pantalla === 'procesos' ? <ProcesosPage /> : pantalla === 'raci' ? <RaciPage /> : pantalla === 'activos' ? <ActivosPage /> : pantalla === 'vulnerabilidades' ? <VulnerabilidadesPage /> : pantalla === 'riesgos' ? <RiesgosPage /> : pantalla === 'incidentes' ? <IncidentesPage /> : pantalla === 'politicas' ? <PoliticasPage /> : pantalla === 'evidencias' ? <EvidenciasPage /> : pantalla === 'planes' ? <PlanesPage /> : pantalla === 'procedimientos' ? <ProcedimientosPage /> : pantalla === 'soa' ? <EvaluacionSoaPage /> : <ExportacionesPage />}
  </div></div></div>
}

export default App
