export class ActualizarIncidenteDto {
  accionRealizada?: string;

  titulo?: string;

  descripcion?: string;

  severidad?: string;

  estado?: string;

  leccionesAprendidas?: string | null;

  responsableId?: string;
}
