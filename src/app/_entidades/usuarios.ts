import { Cargos } from './cargos';
import { Personas } from './personas';
import { Roles } from './roles';
export class Usuarios {
    idusuario: number;
    idpersona: number;
    usuario: string;
    clave: string;
    estado: boolean;
    idcargo: number;
    persona: Personas;
    rol: Roles;
    cargo: Cargos;
}
