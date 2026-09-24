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
import { ActualizarOrganizacionDto } from './dto/organizacion/actualizar-organizacion.dto';
import { ActualizarUnidadOrganizativaDto } from './dto/unidad-organizativa/actualizar-unidad-organizativa.dto';
import { CrearOrganizacionDto } from './dto/organizacion/crear-organizacion.dto';
import { ActualizarTrabajadorDto } from './dto/trabajador/actualizar-trabajador.dto';
import { ActualizarProcesoDto } from './dto/proceso/actualizar-proceso.dto';
import { CrearTrabajadorDto } from './dto/trabajador/crear-trabajador.dto';
import { CrearProcesoDto } from './dto/proceso/crear-proceso.dto';
import { CrearUnidadOrganizativaDto } from './dto/unidad-organizativa/crear-unidad-organizativa.dto';
import { ActualizarAsignacionRaciDto } from './dto/raci/actualizar-asignacion-raci.dto';
import { CrearAsignacionRaciDto } from './dto/raci/crear-asignacion-raci.dto';
import { OrganizacionService } from './organizacion.service';

@Controller('organizaciones')
export class OrganizacionController {
  constructor(private readonly organizacionService: OrganizacionService) {}

  @Get()
  listar() {
    return this.organizacionService.listar();
  }

  @Post()
  crear(@Body() datos: CrearOrganizacionDto) {
    return this.organizacionService.crear(datos);
  }

  @Post(':organizacionId/unidades')
  crearUnidad(
    @Param('organizacionId') organizacionId: string,
    @Body() datos: CrearUnidadOrganizativaDto,
  ) {
    return this.organizacionService.crearUnidad(organizacionId, datos);
  }

  @Get(':organizacionId/unidades')
  listarUnidades(@Param('organizacionId') organizacionId: string) {
    return this.organizacionService.listarUnidades(organizacionId);
  }

  @Get('unidades/:id')
  async consultarUnidad(@Param('id') id: string) {
    const unidad = await this.organizacionService.consultarUnidad(id);

    if (!unidad) {
      throw new NotFoundException('Unidad organizativa no encontrada');
    }

    return unidad;
  }

  @Patch('unidades/:id')
  async actualizarUnidad(
    @Param('id') id: string,
    @Body() datos: ActualizarUnidadOrganizativaDto,
  ) {
    const unidad = await this.organizacionService.actualizarUnidad(id, datos);

    if (!unidad) {
      throw new NotFoundException('Unidad organizativa no encontrada');
    }

    return unidad;
  }

  @Delete('unidades/:id')
  async eliminarUnidad(@Param('id') id: string) {
    const eliminada = await this.organizacionService.eliminarUnidad(id);

    if (!eliminada) {
      throw new NotFoundException('Unidad organizativa no encontrada');
    }

    return eliminada;
  }

  @Post('unidades/:unidadId/trabajadores')
  crearTrabajador(
    @Param('unidadId') unidadId: string,
    @Body() datos: CrearTrabajadorDto,
  ) {
    return this.organizacionService.crearTrabajador(unidadId, datos);
  }

  @Get('trabajadores')
  listarTrabajadores() {
    return this.organizacionService.listarTrabajadores();
  }

  @Get('trabajadores/:id')
  async consultarTrabajador(@Param('id') id: string) {
    const trabajador = await this.organizacionService.consultarTrabajador(id);

    if (!trabajador) {
      throw new NotFoundException('Trabajador no encontrado');
    }

    return trabajador;
  }

  @Patch('trabajadores/:id')
  async actualizarTrabajador(
    @Param('id') id: string,
    @Body() datos: ActualizarTrabajadorDto,
  ) {
    const trabajador = await this.organizacionService.actualizarTrabajador(
      id,
      datos,
    );

    if (!trabajador) {
      throw new NotFoundException('Trabajador no encontrado');
    }

    return trabajador;
  }

  @Delete('trabajadores/:id')
  async eliminarTrabajador(@Param('id') id: string) {
    const eliminado = await this.organizacionService.eliminarTrabajador(id);

    if (!eliminado) {
      throw new NotFoundException('Trabajador no encontrado');
    }

    return eliminado;
  }

  @Post('procesos')
  crearProceso(@Body() datos: CrearProcesoDto) {
    return this.organizacionService.crearProceso(datos);
  }

  @Get('procesos')
  listarProcesos() {
    return this.organizacionService.listarProcesos();
  }

  @Get('procesos/:id')
  async consultarProceso(@Param('id') id: string) {
    const proceso = await this.organizacionService.consultarProceso(id);

    if (!proceso) {
      throw new NotFoundException('Proceso no encontrado');
    }

    return proceso;
  }

  @Patch('procesos/:id')
  async actualizarProceso(
    @Param('id') id: string,
    @Body() datos: ActualizarProcesoDto,
  ) {
    const proceso = await this.organizacionService.actualizarProceso(id, datos);

    if (!proceso) {
      throw new NotFoundException('Proceso no encontrado');
    }

    return proceso;
  }

  @Delete('procesos/:id')
  async eliminarProceso(@Param('id') id: string) {
    const proceso = await this.organizacionService.eliminarProceso(id);

    if (!proceso) {
      throw new NotFoundException('Proceso no encontrado');
    }

    return proceso;
  }

  @Post('asignaciones-raci')
  crearAsignacionRaci(@Body() datos: CrearAsignacionRaciDto) {
    return this.organizacionService.crearAsignacionRaci(datos);
  }

  @Get('asignaciones-raci')
  listarAsignacionesRaci() {
    return this.organizacionService.listarAsignacionesRaci();
  }

  @Get('asignaciones-raci/:id')
  async consultarAsignacionRaci(@Param('id') id: string) {
    const asignacion =
      await this.organizacionService.consultarAsignacionRaci(id);

    if (!asignacion) {
      throw new NotFoundException('Asignación RACI no encontrada');
    }

    return asignacion;
  }

  @Patch('asignaciones-raci/:id')
  async actualizarAsignacionRaci(
    @Param('id') id: string,
    @Body() datos: ActualizarAsignacionRaciDto,
  ) {
    const asignacion = await this.organizacionService.actualizarAsignacionRaci(
      id,
      datos,
    );

    if (!asignacion) {
      throw new NotFoundException('Asignación RACI no encontrada');
    }

    return asignacion;
  }

  @Delete('asignaciones-raci/:id')
  async eliminarAsignacionRaci(@Param('id') id: string) {
    const asignacion =
      await this.organizacionService.eliminarAsignacionRaci(id);

    if (!asignacion) {
      throw new NotFoundException('Asignación RACI no encontrada');
    }

    return asignacion;
  }

  @Get(':id')
  async consultar(@Param('id') id: string) {
    const organizacion = await this.organizacionService.consultar(id);
    if (!organizacion)
      throw new NotFoundException('Organización no encontrada');
    return organizacion;
  }

  @Patch(':id')
  async actualizar(
    @Param('id') id: string,
    @Body() datos: ActualizarOrganizacionDto,
  ) {
    const organizacion = await this.organizacionService.actualizar(id, datos);
    if (!organizacion)
      throw new NotFoundException('Organización no encontrada');
    return organizacion;
  }
}
