import { Empresas } from './empresas';
export class Productos {
    idproducto: number;
    idempresa: number;
    producto: string;
    descripcion: string;
    preciocompra: number;
    precioventa: number;
    cantidad: number;
    empresa: Empresas;
}
