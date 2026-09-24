export class CrearVulnerabilidadDto {
  activoId!: string;

  nombre!: string;

  descripcion?: string;

  cvss?: number;

  responsableId?: string;
}
