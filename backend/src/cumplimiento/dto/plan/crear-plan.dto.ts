export class CrearPlanDto {
  nombre!: string;

  descripcion?: string;

  tipo!: string;

  fechaInicio?: string;

  fechaFin?: string;

  responsableId?: string;

  riesgoId?: string;
}
