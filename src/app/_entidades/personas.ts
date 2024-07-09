import { Tiposgeneros } from './tiposgeneros';
import { Tiposdocumentos } from './tiposdocumentos';
import { Tiposextensiones } from './tiposextensiones';

export class Personas {
    idpersona: number;
    idtipogenero: number;
    primerapellido: string;
    segundoapellido: string;
    primernombre: string;
    segundonombre: string;
    fechanacimiento: Date;
    dip: string;
    numerocomplementario: string;
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
}
