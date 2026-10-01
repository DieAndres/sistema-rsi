export class CrearIncidenteDto {
  activoId!: string;

  accionRealizada?: string;

  titulo!: string;

  descripcion?: string;

  severidad!: string;

  estado?: string;

  leccionesAprendidas?: string;

  responsableId?: string;
}
