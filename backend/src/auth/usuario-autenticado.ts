import type { Request } from 'express';

// Datos que AuthGuard agrega a la petición después de comprobar la sesión.
export type UsuarioAutenticado = {
  id: string;
  correo: string;
  rol: string;
  organizacionId?: string | null;
  unidadOrganizativaId?: string | null;
};

export type RequestConUsuario = Request & { user?: UsuarioAutenticado };
export type RequestAutenticada = Request & { user: UsuarioAutenticado };
