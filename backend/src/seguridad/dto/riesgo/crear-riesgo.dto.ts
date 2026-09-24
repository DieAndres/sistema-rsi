export class CrearRiesgoDto {
  activoId!: string;

  nombre!: string;

  descripcion?: string;

  probabilidad!: string;

  impacto!: string;

  responsableId?: string;
}
