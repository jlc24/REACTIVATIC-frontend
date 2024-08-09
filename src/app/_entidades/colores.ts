import { Productos } from "./productos";

export class Colores {
  idcolor: number;
  idproducto: number;
  color: string;
  estado: boolean;
  created_at: Date;
  productos: Productos;
}
