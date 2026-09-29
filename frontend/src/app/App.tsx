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

function App() {
  const [autenticado, setAutenticado] = useState(Boolean(obtenerToken()))
  const [usuario, setUsuario] = useState(obtenerUsuarioActual())
  const esAdmin = usuario?.rol === 'ADMINISTRADOR'
  const puedeGestionarOrganizacion = esAdmin || usuario?.rol === 'RSI'

  useEffect(() => {
    if (!obtenerToken() || usuario) return
    void apiGet<typeof usuario>('/api/v1/auth/me', new AbortController().signal).then(setUsuario).catch(() => undefined)
  }, [usuario])
  const [pantalla, setPantalla] = useState<Pantalla>('dashboard')

  if (!autenticado) return <LoginPage onLogin={() => { setPantalla('dashboard'); setAutenticado(true) }} />

  async function salir() {
    const token = obtenerToken()
    if (token) await fetch('/api/v1/auth/logout', { method: 'POST', headers: { Authorization: `Bearer ${token}` } })
    eliminarToken()
    eliminarUsuarioActual()
    setUsuario(null)
    setAutenticado(false)
  }

  return <div className={`${usuario?.rol === 'DUENO_UNIDAD' ? 'rol-dueno-unidad' : ''} ${usuario?.rol === 'LECTOR' ? 'rol-lector' : ''}`}>
    <nav className="navegacion-app">
      <div className="menu-grupo"><span>Inicio</span><button type="button" onClick={() => setPantalla('dashboard')}>Dashboard</button><button type="button" onClick={() => setPantalla('mfa')}>Seguridad de cuenta</button>{usuario?.rol === 'ADMINISTRADOR' && <><button type="button" onClick={() => setPantalla('usuarios')}>Usuarios</button><button type="button" onClick={() => setPantalla('auditoria')}>Auditoría</button></>}<button type="button" onClick={() => void salir()}>Cerrar sesión</button></div>
      <div className="menu-grupo"><span>Organización</span>{puedeGestionarOrganizacion && <><button type="button" onClick={() => setPantalla('organizaciones')}>Organizaciones</button><button type="button" onClick={() => setPantalla('organigrama')}>Unidades</button></>}<button type="button" onClick={() => setPantalla('trabajadores')}>Trabajadores</button><button type="button" onClick={() => setPantalla('procesos')}>Procesos</button>{puedeGestionarOrganizacion && <button type="button" onClick={() => setPantalla('raci')}>RACI</button>}</div>
      <div className="menu-grupo"><span>Seguridad</span><button type="button" onClick={() => setPantalla('activos')}>Activos</button><button type="button" onClick={() => setPantalla('vulnerabilidades')}>Vulnerabilidades</button><button type="button" onClick={() => setPantalla('riesgos')}>Riesgos</button><button type="button" onClick={() => setPantalla('incidentes')}>Incidentes</button></div>
      <div className="menu-grupo"><span>Cumplimiento</span><button type="button" onClick={() => setPantalla('politicas')}>Políticas</button><button type="button" onClick={() => setPantalla('evidencias')}>Evidencias</button><button type="button" onClick={() => setPantalla('soa')}>Evaluación SOA</button><button type="button" onClick={() => setPantalla('planes')}>Planes e hitos</button><button type="button" onClick={() => setPantalla('procedimientos')}>Procedimientos</button><button type="button" onClick={() => setPantalla('exportaciones')}>Exportaciones</button></div>
    </nav>
    {pantalla === 'dashboard' ? <DashboardPage /> : pantalla === 'mfa' ? <MfaPage /> : pantalla === 'usuarios' ? <UsuariosPage /> : pantalla === 'auditoria' ? <AuditoriaPage /> : pantalla === 'organizaciones' ? <OrganizacionesPage /> : pantalla === 'organigrama' ? <OrganigramaPage /> : pantalla === 'trabajadores' ? <TrabajadoresPage /> : pantalla === 'procesos' ? <ProcesosPage /> : pantalla === 'raci' ? <RaciPage /> : pantalla === 'activos' ? <ActivosPage /> : pantalla === 'vulnerabilidades' ? <VulnerabilidadesPage /> : pantalla === 'riesgos' ? <RiesgosPage /> : pantalla === 'incidentes' ? <IncidentesPage /> : pantalla === 'politicas' ? <PoliticasPage /> : pantalla === 'evidencias' ? <EvidenciasPage /> : pantalla === 'planes' ? <PlanesPage /> : pantalla === 'procedimientos' ? <ProcedimientosPage /> : pantalla === 'soa' ? <EvaluacionSoaPage /> : <ExportacionesPage />}
  </div>
}

export default App
