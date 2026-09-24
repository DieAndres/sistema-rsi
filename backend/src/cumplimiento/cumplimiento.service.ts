import { Injectable } from '@nestjs/common';
import { OrganizacionService } from '../organizacion/organizacion.service';
import { CrearPoliticaDto } from './dto/politica/crear-politica.dto';
import { ActualizarPoliticaDto } from './dto/politica/actualizar-politica.dto';
import { CrearEvidenciaDto } from './dto/evidencia/crear-evidencia.dto';
import { ActualizarEvidenciaDto } from './dto/evidencia/actualizar-evidencia.dto';
import { CrearPlanDto } from './dto/plan/crear-plan.dto';
import { ActualizarPlanDto } from './dto/plan/actualizar-plan.dto';
import { CrearProcedimientoDto } from './dto/procedimiento/crear-procedimiento.dto';
import { ActualizarProcedimientoDto } from './dto/procedimiento/actualizar-procedimiento.dto';

@Injectable()
export class CumplimientoService {
  constructor(private readonly gestion: OrganizacionService) {}

  crearPolitica(id: string, d: CrearPoliticaDto) {
    return this.gestion.crearPolitica(id, d);
  }

  listarPoliticas() {
    return this.gestion.listarPoliticas();
  }

  consultarPolitica(id: string) {
    return this.gestion.consultarPolitica(id);
  }

  actualizarPolitica(id: string, d: ActualizarPoliticaDto) {
    return this.gestion.actualizarPolitica(id, d);
  }

  eliminarPolitica(id: string) {
    return this.gestion.eliminarPolitica(id);
  }

  crearEvidencia(id: string, datos: CrearEvidenciaDto) {
    return this.gestion.crearEvidencia(id, datos);
  }

  listarEvidencias() {
    return this.gestion.listarEvidencias();
  }

  consultarEvidencia(id: string) {
    return this.gestion.consultarEvidencia(id);
  }

  actualizarEvidencia(id: string, datos: ActualizarEvidenciaDto) {
    return this.gestion.actualizarEvidencia(id, datos);
  }

  eliminarEvidencia(id: string) {
    return this.gestion.eliminarEvidencia(id);
  }

  crearPlan(id: string, datos: CrearPlanDto) {
    return this.gestion.crearPlan(id, datos);
  }

  listarPlanes() {
    return this.gestion.listarPlanes();
  }

  consultarPlan(id: string) {
    return this.gestion.consultarPlan(id);
  }

  actualizarPlan(id: string, datos: ActualizarPlanDto) {
    return this.gestion.actualizarPlan(id, datos);
  }

  eliminarPlan(id: string) {
    return this.gestion.eliminarPlan(id);
  }

  crearProcedimiento(id: string, datos: CrearProcedimientoDto) {
    return this.gestion.crearProcedimiento(id, datos);
  }

  listarProcedimientos() {
    return this.gestion.listarProcedimientos();
  }

  consultarProcedimiento(id: string) {
    return this.gestion.consultarProcedimiento(id);
  }

  actualizarProcedimiento(id: string, datos: ActualizarProcedimientoDto) {
    return this.gestion.actualizarProcedimiento(id, datos);
  }

  eliminarProcedimiento(id: string) {
    return this.gestion.eliminarProcedimiento(id);
  }
}
