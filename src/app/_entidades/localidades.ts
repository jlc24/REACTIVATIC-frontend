import { Municipios } from './municipios';

export class Localidades {
    idlocalidad: number;
    idmunicipio: number;
    localidad: string;
    estado: boolean;
    creates_at: Date;

    municipio: Municipios;
}
