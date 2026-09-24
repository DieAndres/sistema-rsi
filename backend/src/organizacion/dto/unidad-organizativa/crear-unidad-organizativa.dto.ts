import { TipoUnidadOrganizativa } from '@prisma/client';

export class CrearUnidadOrganizativaDto {
  unidadPadreId?: string;

  tipo!: TipoUnidadOrganizativa;

  nombre!: string;
}
