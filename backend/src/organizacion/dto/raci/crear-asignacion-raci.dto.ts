import { TipoResponsabilidadRaci } from '@prisma/client';

export class CrearAsignacionRaciDto {
  procesoId!: string;

  trabajadorId!: string;

  tipoResponsabilidad!: TipoResponsabilidadRaci;
}
