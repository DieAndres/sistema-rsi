export class CrearIncidenteDto {
  activoId!: string;

  titulo!: string;

  descripcion?: string;

  severidad!: string;

  responsableId?: string;
}
