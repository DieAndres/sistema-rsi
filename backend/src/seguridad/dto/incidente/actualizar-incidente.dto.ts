export class ActualizarIncidenteDto {
  titulo?: string;

  descripcion?: string;

  severidad?: string;

  estado?: string;

  leccionesAprendidas?: string | null;

  responsableId?: string;
}
