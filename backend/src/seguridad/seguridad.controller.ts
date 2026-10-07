import type {
  RequestConUsuario,
  RequestAutenticada,
} from '../auth/usuario-autenticado';
import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
  Req,
} from '@nestjs/common';
import { SeguridadService } from './seguridad.service';
import { CrearActivoDto } from './dto/activo/crear-activo.dto';
import { ActualizarActivoDto } from './dto/activo/actualizar-activo.dto';
import { CrearVulnerabilidadDto } from './dto/vulnerabilidad/crear-vulnerabilidad.dto';
import { ActualizarVulnerabilidadDto } from './dto/vulnerabilidad/actualizar-vulnerabilidad.dto';
import { CrearRiesgoDto } from './dto/riesgo/crear-riesgo.dto';
import { ActualizarRiesgoDto } from './dto/riesgo/actualizar-riesgo.dto';
import { CrearIncidenteDto } from './dto/incidente/crear-incidente.dto';
import { ActualizarIncidenteDto } from './dto/incidente/actualizar-incidente.dto';

@Controller('seguridad')
export class SeguridadController {
  constructor(private readonly service: SeguridadService) {}

  @Post('unidades/:unidadId/activos')
  crearActivo(
    @Param('unidadId') unidadId: string,
    @Body() datos: CrearActivoDto,
  ) {
    return this.service.crearActivo(unidadId, datos);
  }

  @Get('activos')
  listarActivos(
    @Query('unidadId') unidadId: string | undefined,
    @Req() request?: RequestConUsuario,
  ) {
    const unidadAlcance = ['DUENO_UNIDAD', 'LECTOR'].includes(
      request?.user?.rol ?? '',
    )
      ? (request?.user?.unidadOrganizativaId ?? undefined)
      : unidadId;
    return this.service.listarActivos(unidadAlcance);
  }

  @Get('activos/:id')
  async consultarActivo(@Param('id') id: string) {
    const activo = await this.service.consultarActivo(id);
    if (!activo) {
      throw new NotFoundException('Activo no encontrado');
    }
    return activo;
  }

  @Patch('activos/:id')
  actualizarActivo(
    @Param('id') id: string,
    @Body() datos: ActualizarActivoDto,
  ) {
    return this.service.actualizarActivo(id, datos);
  }

  @Delete('activos/:id')
  eliminarActivo(@Param('id') id: string) {
    return this.service.eliminarActivo(id);
  }

  @Post('vulnerabilidades')
  crearVulnerabilidad(@Body() datos: CrearVulnerabilidadDto) {
    return this.service.crearVulnerabilidad(datos);
  }

  @Get('vulnerabilidades')
  listarVulnerabilidades(
    @Query('estado') estado?: string,
    @Query('cvssMin') cvssMin?: string,
    @Req() request?: RequestConUsuario,
  ) {
    const unidadId = ['DUENO_UNIDAD', 'LECTOR'].includes(
      request?.user?.rol ?? '',
    )
      ? (request?.user?.unidadOrganizativaId ?? undefined)
      : undefined;
    return this.service.listarVulnerabilidades(estado, cvssMin, unidadId);
  }

  @Get('vulnerabilidades/:id')
  consultarVulnerabilidad(@Param('id') id: string) {
    return this.service.consultarVulnerabilidad(id);
  }

  @Patch('vulnerabilidades/:id')
  actualizarVulnerabilidad(
    @Param('id') id: string,
    @Body() datos: ActualizarVulnerabilidadDto,
  ) {
    return this.service.actualizarVulnerabilidad(id, datos);
  }

  @Delete('vulnerabilidades/:id')
  eliminarVulnerabilidad(@Param('id') id: string) {
    return this.service.eliminarVulnerabilidad(id);
  }

  @Post('riesgos')
  crearRiesgo(@Body() datos: CrearRiesgoDto) {
    return this.service.crearRiesgo(datos);
  }

  @Get('riesgos')
  listarRiesgos(
    @Query('estado') estado?: string,
    @Req() request?: RequestConUsuario,
  ) {
    const unidadId = ['DUENO_UNIDAD', 'LECTOR'].includes(
      request?.user?.rol ?? '',
    )
      ? (request?.user?.unidadOrganizativaId ?? undefined)
      : undefined;
    return this.service.listarRiesgos(estado, unidadId);
  }

  @Get('riesgos/:id')
  consultarRiesgo(@Param('id') id: string) {
    return this.service.consultarRiesgo(id);
  }

  @Patch('riesgos/:id')
  actualizarRiesgo(
    @Param('id') id: string,
    @Body() datos: ActualizarRiesgoDto,
  ) {
    return this.service.actualizarRiesgo(id, datos);
  }

  @Delete('riesgos/:id')
  eliminarRiesgo(@Param('id') id: string) {
    return this.service.eliminarRiesgo(id);
  }

  @Post('incidentes')
  crearIncidente(
    @Body() datos: CrearIncidenteDto,
    @Req() req: RequestAutenticada,
  ) {
    return this.service.crearIncidente(datos, req.user);
  }

  @Get('incidentes')
  listarIncidentes(
    @Query('estado') estado?: string,
    @Query('severidad') severidad?: string,
    @Req() request?: RequestConUsuario,
  ) {
    const unidadId = ['DUENO_UNIDAD', 'LECTOR'].includes(
      request?.user?.rol ?? '',
    )
      ? (request?.user?.unidadOrganizativaId ?? undefined)
      : undefined;
    return this.service.listarIncidentes(estado, severidad, unidadId);
  }

  @Get('incidentes/:id')
  consultarIncidente(@Param('id') id: string) {
    return this.service.consultarIncidente(id);
  }

  @Patch('incidentes/:id')
  actualizarIncidente(
    @Param('id') id: string,
    @Body() datos: ActualizarIncidenteDto,
    @Req() req: RequestAutenticada,
  ) {
    return this.service.actualizarIncidente(id, datos, req.user);
  }

  @Delete('incidentes/:id')
  eliminarIncidente(@Param('id') id: string) {
    return this.service.eliminarIncidente(id);
  }
}
