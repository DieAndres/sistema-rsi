export class ActualizarRiesgoDto {
  nombre?: string;

  descripcion?: string;

  probabilidad?: string;

  impacto?: string;

  tratamiento?: string | null;

  riesgoResidual?: string | null;

  aceptado?: boolean;

  estado?: string;

  responsableId?: string;
}
