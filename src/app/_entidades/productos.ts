import { Empresas } from './empresas';

export class Productos {
    idproducto: number;
    idempresa: number;
    producto: string;
    descripcion: string;
    precioventa: string;
    cantidad: number;
    estado: boolean;
    created_at: Date;

    empresa: Empresas;
}
