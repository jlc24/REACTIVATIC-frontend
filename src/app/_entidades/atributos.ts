import { Productos } from "./productos";

export class Atributos {
  idatributo: number;
  idproducto: number;
  atributo: string;
  detalle: string;
  estado: boolean;
  created_at: Date;
  productos: Productos;
}
