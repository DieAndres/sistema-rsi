import type { RequestConUsuario } from '../auth/usuario-autenticado';
import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Req,
} from '@nestjs/common';
import { CumplimientoService } from './cumplimiento.service';
import { CrearPoliticaDto } from './dto/politica/crear-politica.dto';
import { ActualizarPoliticaDto } from './dto/politica/actualizar-politica.dto';
import { CrearEvidenciaDto } from './dto/evidencia/crear-evidencia.dto';
import { ActualizarEvidenciaDto } from './dto/evidencia/actualizar-evidencia.dto';
import { CrearPlanDto } from './dto/plan/crear-plan.dto';
import { ActualizarPlanDto } from './dto/plan/actualizar-plan.dto';
import { CrearProcedimientoDto } from './dto/procedimiento/crear-procedimiento.dto';
import { ActualizarProcedimientoDto } from './dto/procedimiento/actualizar-procedimiento.dto';
import { CrearHitoDto } from './dto/hito/crear-hito.dto';
import { ActualizarHitoDto } from './dto/hito/actualizar-hito.dto';

@Controller('cumplimiento')
export class CumplimientoController {
  constructor(private readonly service: CumplimientoService) {}

  @Post('politicas/:organizacionId')
  crearPolitica(
    @Param('organizacionId') id: string,
    @Body() datos: CrearPoliticaDto,
  ) {
    return this.service.crearPolitica(id, datos);
  }

  @Get('politicas')
  listarPoliticas(@Req() request: RequestConUsuario) {
    return this.service.listarPoliticas(this.alcanceOrganizacion(request));
  }

  @Get('politicas/:id')
  async consultarPolitica(@Param('id') id: string) {
    const politica = await this.service.consultarPolitica(id);
    if (!politica) {
      throw new NotFoundException('Política no encontrada');
    }
    return politica;
  }

  @Patch('politicas/:id')
  actualizarPolitica(
    @Param('id') id: string,
    @Body() datos: ActualizarPoliticaDto,
  ) {
    return this.service.actualizarPolitica(id, datos);
  }

  @Delete('politicas/:id')
  eliminarPolitica(@Param('id') id: string) {
    return this.service.eliminarPolitica(id);
  }

  @Post('evidencias/:organizacionId')
  crearEvidencia(
    @Param('organizacionId') organizacionId: string,
    @Body() datos: CrearEvidenciaDto,
  ) {
    return this.service.crearEvidencia(organizacionId, datos);
  }

  @Get('evidencias')
  listarEvidencias(@Req() request: RequestConUsuario) {
    return this.service.listarEvidencias(this.alcanceOrganizacion(request));
  }

  @Get('evidencias/:id')
  async consultarEvidencia(@Param('id') id: string) {
    const evidencia = await this.service.consultarEvidencia(id);
    if (!evidencia) {
      throw new NotFoundException('Evidencia no encontrada');
    }
    return evidencia;
  }

  @Patch('evidencias/:id')
  actualizarEvidencia(
    @Param('id') id: string,
    @Body() datos: ActualizarEvidenciaDto,
  ) {
    return this.service.actualizarEvidencia(id, datos);
  }

  @Delete('evidencias/:id')
  eliminarEvidencia(@Param('id') id: string) {
    return this.service.eliminarEvidencia(id);
  }

  @Post('planes/:organizacionId')
  crearPlan(
    @Param('organizacionId') organizacionId: string,
    @Body() datos: CrearPlanDto,
  ) {
    return this.service.crearPlan(organizacionId, datos);
  }

  @Get('planes')
  listarPlanes(@Req() request: RequestConUsuario) {
    return this.service.listarPlanes(this.alcanceOrganizacion(request));
  }

  @Get('planes/:id')
  async consultarPlan(@Param('id') id: string) {
    const plan = await this.service.consultarPlan(id);
    if (!plan) {
      throw new NotFoundException('Plan no encontrado');
    }
    return plan;
  }

  @Patch('planes/:id')
  actualizarPlan(@Param('id') id: string, @Body() datos: ActualizarPlanDto) {
    return this.service.actualizarPlan(id, datos);
  }

  @Delete('planes/:id')
  eliminarPlan(@Param('id') id: string) {
    return this.service.eliminarPlan(id);
  }

  @Post('planes/:planId/hitos')
  crearHito(@Param('planId') planId: string, @Body() datos: CrearHitoDto) {
    return this.service.crearHito(planId, datos);
  }

  @Get('planes/:planId/hitos')
  listarHitos(@Param('planId') planId: string) {
    return this.service.listarHitos(planId);
  }

  @Patch('hitos/:id')
  async actualizarHito(
    @Param('id') id: string,
    @Body() datos: ActualizarHitoDto,
  ) {
    const hito = await this.service.actualizarHito(id, datos);
    if (!hito) {
      throw new NotFoundException('Hito no encontrado');
    }
    return hito;
  }

  @Delete('hitos/:id')
  eliminarHito(@Param('id') id: string) {
    return this.service.eliminarHito(id);
  }

  @Post('procedimientos/:organizacionId')
  crearProcedimiento(
    @Param('organizacionId') organizacionId: string,
    @Body() datos: CrearProcedimientoDto,
  ) {
    return this.service.crearProcedimiento(organizacionId, datos);
  }

  @Get('procedimientos')
  listarProcedimientos(@Req() request: RequestConUsuario) {
    return this.service.listarProcedimientos(this.alcanceOrganizacion(request));
  }

  @Get('procedimientos/:id')
  async consultarProcedimiento(@Param('id') id: string) {
    const procedimiento = await this.service.consultarProcedimiento(id);
    if (!procedimiento) {
      throw new NotFoundException('Procedimiento no encontrado');
    }
    return procedimiento;
  }

  @Patch('procedimientos/:id')
  actualizarProcedimiento(
    @Param('id') id: string,
    @Body() datos: ActualizarProcedimientoDto,
  ) {
    return this.service.actualizarProcedimiento(id, datos);
  }

  @Delete('procedimientos/:id')
  eliminarProcedimiento(@Param('id') id: string) {
    return this.service.eliminarProcedimiento(id);
  }

  private alcanceOrganizacion(request: RequestConUsuario) {
    return ['DUENO_UNIDAD', 'LECTOR'].includes(request.user?.rol ?? '')
      ? (request.user?.organizacionId ?? undefined)
      : undefined;
  }
}
