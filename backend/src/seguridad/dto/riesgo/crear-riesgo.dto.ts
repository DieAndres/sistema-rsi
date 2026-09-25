export class CrearRiesgoDto {
  activoId!: string;

  nombre!: string;

  descripcion?: string;

  probabilidad!: number;

  impacto!: number;

  tratamiento?: string;

  riesgoResidual?: string;

  aceptado?: boolean;

  responsableId?: string;
}
