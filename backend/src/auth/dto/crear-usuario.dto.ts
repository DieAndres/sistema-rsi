export class CrearUsuarioDto {
  correo!: string;

  password!: string;

  algoritmo?: 'argon2' | 'bcrypt';

  rol?: string;

  trabajadorId?: string;
}
