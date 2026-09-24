export class ActualizarVulnerabilidadDto {
  nombre?: string;

  descripcion?: string;

  cvss?: number;

  sla?: number | null;

  planRemediacion?: string | null;

  estado?: string;

  responsableId?: string;
}
