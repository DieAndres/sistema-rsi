import { OrganigramaPage } from '../features/organizacion/pages/OrganigramaPage'
import { TrabajadoresPage } from '../features/organizacion/pages/TrabajadoresPage'
import { ProcesosPage } from '../features/organizacion/pages/ProcesosPage'
import { RaciPage } from '../features/organizacion/pages/RaciPage'
import { OrganizacionesPage } from '../features/organizacion/pages/OrganizacionesPage'
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
import { useState } from 'react'

function App() {
  const [pantalla, setPantalla] = useState<'organizaciones' | 'organigrama' | 'trabajadores' | 'procesos' | 'raci' | 'activos' | 'vulnerabilidades' | 'riesgos' | 'incidentes' | 'politicas' | 'evidencias' | 'planes' | 'procedimientos' | 'soa' | 'exportaciones'>('organizaciones')
 return <><nav className="navegacion-app"><div className="menu-grupo"><span>Organización</span><button type="button" onClick={() => setPantalla('organizaciones')}>Organizaciones</button><button type="button" onClick={() => setPantalla('organigrama')}>Unidades</button><button type="button" onClick={() => setPantalla('trabajadores')}>Trabajadores</button><button type="button" onClick={() => setPantalla('procesos')}>Procesos</button><button type="button" onClick={() => setPantalla('raci')}>RACI</button></div><div className="menu-grupo"><span>Seguridad</span><button type="button" onClick={() => setPantalla('activos')}>Activos</button><button type="button" onClick={() => setPantalla('vulnerabilidades')}>Vulnerabilidades</button><button type="button" onClick={() => setPantalla('riesgos')}>Riesgos</button><button type="button" onClick={() => setPantalla('incidentes')}>Incidentes</button></div><div className="menu-grupo"><span>Cumplimiento</span><button type="button" onClick={() => setPantalla('politicas')}>Políticas</button><button type="button" onClick={() => setPantalla('evidencias')}>Evidencias</button><button type="button" onClick={() => setPantalla('soa')}>Evaluación SOA</button><button type="button" onClick={() => setPantalla('planes')}>Planes e hitos</button><button type="button" onClick={() => setPantalla('procedimientos')}>Procedimientos</button><button type="button" onClick={() => setPantalla('exportaciones')}>Exportaciones</button></div></nav>{pantalla === 'organizaciones' ? <OrganizacionesPage /> : pantalla === 'organigrama' ? <OrganigramaPage /> : pantalla === 'trabajadores' ? <TrabajadoresPage /> : pantalla === 'procesos' ? <ProcesosPage /> : pantalla === 'raci' ? <RaciPage /> : pantalla === 'activos' ? <ActivosPage /> : pantalla === 'vulnerabilidades' ? <VulnerabilidadesPage /> : pantalla === 'riesgos' ? <RiesgosPage /> : pantalla === 'incidentes' ? <IncidentesPage /> : pantalla === 'politicas' ? <PoliticasPage /> : pantalla === 'evidencias' ? <EvidenciasPage /> : pantalla === 'planes' ? <PlanesPage /> : pantalla === 'procedimientos' ? <ProcedimientosPage /> : pantalla === 'soa' ? <EvaluacionSoaPage /> : <ExportacionesPage />}</>
}

export default App
