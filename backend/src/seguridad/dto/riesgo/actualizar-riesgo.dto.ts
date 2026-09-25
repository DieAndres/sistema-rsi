export class ActualizarRiesgoDto {
  nombre?: string;

  descripcion?: string;

  probabilidad?: number;

  impacto?: number;

  tratamiento?: string | null;

  riesgoResidual?: string | null;

  aceptado?: boolean;

  estado?: string;

  responsableId?: string;
}
