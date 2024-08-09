import { Productos } from "./productos";

export class Archivos {
  idarchivo: number;
  idproducto: number;
  nombrearchivo: string;
  ruta: string;
  estado: boolean;
  created_at: Date;

  productos: Productos;
}
