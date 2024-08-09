import { Categorias } from "./categorias";

export class Enlaces {
  idenlace: number;
  idcategoria: number;
  enlace: string;
  ruta: string;
  iconoenlace: string;
  orden: number;
  estado: boolean;
  created_at: Date;
  categoria: Categorias;

}
