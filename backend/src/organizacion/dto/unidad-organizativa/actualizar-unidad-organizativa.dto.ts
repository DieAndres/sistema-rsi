import { TipoUnidadOrganizativa } from '@prisma/client';

export class ActualizarUnidadOrganizativaDto {
  unidadPadreId?: string | null;

  tipo?: TipoUnidadOrganizativa;

  nombre?: string;
}
