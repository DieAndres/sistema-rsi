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
import { Request } from 'express';
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

  @Post('unidades/:unidadId/activos') crearActivo(
    @Param('unidadId') id: string,
    @Body() d: CrearActivoDto,
  ) {
    return this.service.crearActivo(id, d);
  }

  @Get('activos') listarActivos(
    @Query('unidadId') unidadId: string | undefined,
    @Req()
    request?: Request & {
      user?: { rol?: string; unidadOrganizativaId?: string | null };
    },
  ) {
    const unidadAlcance = ['DUENO_UNIDAD', 'LECTOR'].includes(
      request?.user?.rol ?? '',
    )
      ? (request?.user?.unidadOrganizativaId ?? undefined)
      : unidadId;
    return this.service.listarActivos(unidadAlcance);
  }

  @Get('activos/:id') async consultarActivo(@Param('id') id: string) {
    const x = await this.service.consultarActivo(id);
    if (!x) throw new NotFoundException('Activo no encontrado');
    return x;
  }

  @Patch('activos/:id') actualizarActivo(
    @Param('id') id: string,
    @Body() d: ActualizarActivoDto,
  ) {
    return this.service.actualizarActivo(id, d);
  }

  @Delete('activos/:id') eliminarActivo(@Param('id') id: string) {
    return this.service.eliminarActivo(id);
  }

  @Post('vulnerabilidades') crearVulnerabilidad(
    @Body() d: CrearVulnerabilidadDto,
  ) {
    return this.service.crearVulnerabilidad(d);
  }

  @Get('vulnerabilidades') listarVulnerabilidades(
    @Query('estado') estado?: string,
    @Query('cvssMin') cvssMin?: string,
    @Req()
    request?: Request & {
      user?: { rol?: string; unidadOrganizativaId?: string | null };
    },
  ) {
    const unidadId = ['DUENO_UNIDAD', 'LECTOR'].includes(
      request?.user?.rol ?? '',
    )
      ? (request?.user?.unidadOrganizativaId ?? undefined)
      : undefined;
    return this.service.listarVulnerabilidades(estado, cvssMin, unidadId);
  }

  @Get('vulnerabilidades/:id') consultarVulnerabilidad(
    @Param('id') id: string,
  ) {
    return this.service.consultarVulnerabilidad(id);
  }

  @Patch('vulnerabilidades/:id') actualizarVulnerabilidad(
    @Param('id') id: string,
    @Body() d: ActualizarVulnerabilidadDto,
  ) {
    return this.service.actualizarVulnerabilidad(id, d);
  }

  @Delete('vulnerabilidades/:id') eliminarVulnerabilidad(
    @Param('id') id: string,
  ) {
    return this.service.eliminarVulnerabilidad(id);
  }

  @Post('riesgos') crearRiesgo(@Body() d: CrearRiesgoDto) {
    return this.service.crearRiesgo(d);
  }

  @Get('riesgos') listarRiesgos(
    @Query('estado') estado?: string,
    @Req()
    request?: Request & {
      user?: { rol?: string; unidadOrganizativaId?: string | null };
    },
  ) {
    const unidadId = ['DUENO_UNIDAD', 'LECTOR'].includes(
      request?.user?.rol ?? '',
    )
      ? (request?.user?.unidadOrganizativaId ?? undefined)
      : undefined;
    return this.service.listarRiesgos(estado, unidadId);
  }

  @Get('riesgos/:id') consultarRiesgo(@Param('id') id: string) {
    return this.service.consultarRiesgo(id);
  }

  @Patch('riesgos/:id') actualizarRiesgo(
    @Param('id') id: string,
    @Body() d: ActualizarRiesgoDto,
  ) {
    return this.service.actualizarRiesgo(id, d);
  }

  @Delete('riesgos/:id') eliminarRiesgo(@Param('id') id: string) {
    return this.service.eliminarRiesgo(id);
  }

  @Post('incidentes') crearIncidente(
    @Body() d: CrearIncidenteDto,
    @Req() req: Request & { user: { id: string; correo: string } },
  ) {
    return this.service.crearIncidente(d, req.user);
  }

  @Get('incidentes') listarIncidentes(
    @Query('estado') estado?: string,
    @Query('severidad') severidad?: string,
    @Req()
    request?: Request & {
      user?: { rol?: string; unidadOrganizativaId?: string | null };
    },
  ) {
    const unidadId = ['DUENO_UNIDAD', 'LECTOR'].includes(
      request?.user?.rol ?? '',
    )
      ? (request?.user?.unidadOrganizativaId ?? undefined)
      : undefined;
    return this.service.listarIncidentes(estado, severidad, unidadId);
  }

  @Get('incidentes/:id') consultarIncidente(@Param('id') id: string) {
    return this.service.consultarIncidente(id);
  }

  @Patch('incidentes/:id') actualizarIncidente(
    @Param('id') id: string,
    @Body() d: ActualizarIncidenteDto,
    @Req() req: Request & { user: { id: string; correo: string } },
  ) {
    return this.service.actualizarIncidente(id, d, req.user);
  }

  @Delete('incidentes/:id') eliminarIncidente(@Param('id') id: string) {
    return this.service.eliminarIncidente(id);
  }
}
