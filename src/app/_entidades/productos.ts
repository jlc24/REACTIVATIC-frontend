import { Empresas } from './empresas';

export class Productos {
    idproducto: number;
    idempresa: number;
    producto: string;
    descripcion: string;
    precioventa: number;
    estado: boolean;
    created_at: Date;

    empresa: Empresas;
}
