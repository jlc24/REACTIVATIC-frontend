import { Colores } from './colores';
import { Materiales } from './materiales';
import { Precios } from './precios';
import { Productos } from './productos';
import { Tamanos } from './tamanos';

export class Carritos {
  idcarrito: number;
  idcliente: number;
  idproducto: number;
  imagen: string;
  idprecio: number;
  idcolor: number;
  idmaterial: number;
  idtamano: number;
  cantidad: number;
  created_at: Date;

  producto: Productos;
  precio: Precios;
  color: Colores;
  material: Materiales;
  tamanos: Tamanos;
}
