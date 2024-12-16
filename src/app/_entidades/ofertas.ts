import { Empresas } from "./empresas";

export class Ofertas {
  idoferta: number;
  idempresa: number;
  tipooferta: string;
  oferta: number;
  estado: boolean;
  created_at: Date;
  
  empresa: Empresas;
}
