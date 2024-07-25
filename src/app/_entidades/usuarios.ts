import { Personas } from './personas';
import { Roles } from './roles';
export class Usuarios {
    idusuario: number;
    idpersona: number;
    usuario: string;
    clave: string;
    estado: boolean;
    persona: Personas;
    rol: Roles;
}
