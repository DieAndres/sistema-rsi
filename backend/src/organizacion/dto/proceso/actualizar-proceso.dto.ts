export class ActualizarProcesoDto {
  nombre?: string;

  descripcion?: string | null;

  estado?: string;

  version?: string;

  responsableId?: string | null;

  fechaRevision?: string | null;
}
