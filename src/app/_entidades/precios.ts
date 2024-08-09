import { Productos } from "./productos";
import { Tamanos } from "./tamanos";

export class Precios {
  idprecio: number;
  idproducto: number;
  precio: number;
  idtamano: number;
  cantidad: number;
  estado: boolean;
  created_at: Date;
  productos: Productos;
  tamanos: Tamanos;
}
