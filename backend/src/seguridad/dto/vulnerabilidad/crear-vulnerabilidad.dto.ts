export class CrearVulnerabilidadDto {
  activoId!: string;

  nombre!: string;

  descripcion?: string;

  cvss?: number;

  sla?: number;

  planRemediacion?: string;

  responsableId?: string;
}
