import { Tiposgeneros } from './tiposgeneros';
import { Tiposdocumentos } from './tiposdocumentos';
import { Tiposextensiones } from './tiposextensiones';
import { Roles } from './roles';
import { Usuarios } from './usuarios';

export class Personas {
    idpersona: number;
    idtipogenero: number;
    primerapellido: string;
    segundoapellido: string;
    primernombre: string;
    dip: string;
    complementario: string;
    idtipodocumento: number;
    idtipoextension: number;
    direccion: string;
    telefono: string;
    celular: string;
    correo: string;
    estado: boolean;
    tipogenero: Tiposgeneros;
    tipodocumento: Tiposdocumentos;
    tipoextension: Tiposextensiones;
    usuario: Usuarios;
    rol: Roles;
}
