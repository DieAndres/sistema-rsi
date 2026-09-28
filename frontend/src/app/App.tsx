import { OrganigramaPage } from '../features/organizacion/pages/OrganigramaPage'
import { TrabajadoresPage } from '../features/organizacion/pages/TrabajadoresPage'
import { ProcesosPage } from '../features/organizacion/pages/ProcesosPage'
import { RaciPage } from '../features/organizacion/pages/RaciPage'
import { OrganizacionesPage } from '../features/organizacion/pages/OrganizacionesPage'
import { ActivosPage } from '../features/seguridad/pages/ActivosPage'
import { VulnerabilidadesPage } from '../features/seguridad/pages/VulnerabilidadesPage'
import { useState } from 'react'

function App() {
  const [pantalla, setPantalla] = useState<'organizaciones' | 'organigrama' | 'trabajadores' | 'procesos' | 'raci' | 'activos' | 'vulnerabilidades'>('organizaciones')
  return <><nav className="navegacion-app"><button type="button" onClick={() => setPantalla('organizaciones')}>Organizaciones</button><button type="button" onClick={() => setPantalla('organigrama')}>Organigrama y unidades</button><button type="button" onClick={() => setPantalla('trabajadores')}>Trabajadores</button><button type="button" onClick={() => setPantalla('procesos')}>Procesos</button><button type="button" onClick={() => setPantalla('raci')}>RACI</button><button type="button" onClick={() => setPantalla('activos')}>Activos</button><button type="button" onClick={() => setPantalla('vulnerabilidades')}>Vulnerabilidades</button></nav>{pantalla === 'organizaciones' ? <OrganizacionesPage /> : pantalla === 'organigrama' ? <OrganigramaPage /> : pantalla === 'trabajadores' ? <TrabajadoresPage /> : pantalla === 'procesos' ? <ProcesosPage /> : pantalla === 'raci' ? <RaciPage /> : pantalla === 'activos' ? <ActivosPage /> : <VulnerabilidadesPage />}</>
}

export default App
