import { Productos } from "./productos";

export class Ofertas {
  idofertas: number;
  idproducto: number;
  oferta: number;
  duracion: Date;
  estado: boolean;
  created_at: Date;
  productos: Productos;
}
