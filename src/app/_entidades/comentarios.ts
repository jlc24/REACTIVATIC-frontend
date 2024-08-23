import { Clientes } from "./clientes";
import { Productos } from "./productos";

export class Comentarios {
  idcomentario: number;
  comentario: string;
  idcliente: number;
  valoracion: number;
  idproducto: number;
  estado: boolean;
  created_at: Date;
  
  clientes: Clientes;
  productos: Productos;
}
