import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
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

@Controller('cumplimiento')
export class CumplimientoController {
  constructor(private readonly service: CumplimientoService) {}

  @Post('politicas/:organizacionId') crearPolitica(
    @Param('organizacionId') id: string,
    @Body() d: CrearPoliticaDto,
  ) {
    return this.service.crearPolitica(id, d);
  }

  @Get('politicas') listarPoliticas() {
    return this.service.listarPoliticas();
  }

  @Get('politicas/:id') async consultarPolitica(@Param('id') id: string) {
    const x = await this.service.consultarPolitica(id);
    if (!x) throw new NotFoundException('Política no encontrada');
    return x;
  }

  @Patch('politicas/:id') actualizarPolitica(
    @Param('id') id: string,
    @Body() d: ActualizarPoliticaDto,
  ) {
    return this.service.actualizarPolitica(id, d);
  }

  @Delete('politicas/:id') eliminarPolitica(@Param('id') id: string) {
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
  listarEvidencias() {
    return this.service.listarEvidencias();
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
  listarPlanes() {
    return this.service.listarPlanes();
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

  @Post('procedimientos/:organizacionId')
  crearProcedimiento(
    @Param('organizacionId') organizacionId: string,
    @Body() datos: CrearProcedimientoDto,
  ) {
    return this.service.crearProcedimiento(organizacionId, datos);
  }

  @Get('procedimientos')
  listarProcedimientos() {
    return this.service.listarProcedimientos();
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
}
