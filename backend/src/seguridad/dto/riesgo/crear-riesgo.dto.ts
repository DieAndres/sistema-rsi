export class CrearRiesgoDto {
  activoId!: string;

  nombre!: string;

  descripcion?: string;

  probabilidad!: string;

  impacto!: string;

  tratamiento?: string;

  riesgoResidual?: string;

  aceptado?: boolean;

  responsableId?: string;
}
