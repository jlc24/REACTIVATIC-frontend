import { Productos } from "./productos";

export class Materiales {
  idmaterial: number;
  idproducto: number;
  material: string;
  estado: boolean;
  created_at: Date;
  productos: Productos;
}
