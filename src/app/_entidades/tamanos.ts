import { Productos } from "./productos";

export class Tamanos {
  idtamano: number;
  idproducto: number;
  tamano: string;
  estado: boolean;
  created_at: Date;
  productos: Productos;
}
