import { Injectable } from '@nestjs/common';
import { OrganizacionService } from '../organizacion/organizacion.service';
import { CrearActivoDto } from './dto/activo/crear-activo.dto';
import { ActualizarActivoDto } from './dto/activo/actualizar-activo.dto';
import { CrearVulnerabilidadDto } from './dto/vulnerabilidad/crear-vulnerabilidad.dto';
import { ActualizarVulnerabilidadDto } from './dto/vulnerabilidad/actualizar-vulnerabilidad.dto';
import { CrearRiesgoDto } from './dto/riesgo/crear-riesgo.dto';
import { ActualizarRiesgoDto } from './dto/riesgo/actualizar-riesgo.dto';
import { CrearIncidenteDto } from './dto/incidente/crear-incidente.dto';
import { ActualizarIncidenteDto } from './dto/incidente/actualizar-incidente.dto';

@Injectable()
export class SeguridadService {
  constructor(private readonly gestion: OrganizacionService) {}

  crearActivo(id: string, d: CrearActivoDto) {
    return this.gestion.crearActivo(id, d);
  }

  listarActivos(unidadId?: string) {
    return this.gestion.listarActivos(unidadId);
  }

  consultarActivo(id: string) {
    return this.gestion.consultarActivo(id);
  }

  actualizarActivo(id: string, d: ActualizarActivoDto) {
    return this.gestion.actualizarActivo(id, d);
  }

  eliminarActivo(id: string) {
    return this.gestion.eliminarActivo(id);
  }

  crearVulnerabilidad(d: CrearVulnerabilidadDto) {
    return this.gestion.crearVulnerabilidad(d);
  }

  listarVulnerabilidades(estado?: string, cvssMin?: string) {
    return this.gestion.listarVulnerabilidades(estado, cvssMin);
  }

  consultarVulnerabilidad(id: string) {
    return this.gestion.consultarVulnerabilidad(id);
  }

  actualizarVulnerabilidad(id: string, d: ActualizarVulnerabilidadDto) {
    return this.gestion.actualizarVulnerabilidad(id, d);
  }

  eliminarVulnerabilidad(id: string) {
    return this.gestion.eliminarVulnerabilidad(id);
  }

  crearRiesgo(d: CrearRiesgoDto) {
    return this.gestion.crearRiesgo(d);
  }

  listarRiesgos(estado?: string) {
    return this.gestion.listarRiesgos(estado);
  }

  consultarRiesgo(id: string) {
    return this.gestion.consultarRiesgo(id);
  }

  actualizarRiesgo(id: string, d: ActualizarRiesgoDto) {
    return this.gestion.actualizarRiesgo(id, d);
  }

  eliminarRiesgo(id: string) {
    return this.gestion.eliminarRiesgo(id);
  }

  crearIncidente(d: CrearIncidenteDto) {
    return this.gestion.crearIncidente(d);
  }

  listarIncidentes(estado?: string, severidad?: string) {
    return this.gestion.listarIncidentes(estado, severidad);
  }

  consultarIncidente(id: string) {
    return this.gestion.consultarIncidente(id);
  }

  actualizarIncidente(id: string, d: ActualizarIncidenteDto) {
    return this.gestion.actualizarIncidente(id, d);
  }

  eliminarIncidente(id: string) {
    return this.gestion.eliminarIncidente(id);
  }
}
