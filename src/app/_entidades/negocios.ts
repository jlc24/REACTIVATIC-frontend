import { Beneficios } from "./beneficios";
import { Beneficiosempresas } from "./beneficiosempresas";
import { Personas } from "./personas";

export class Negocios {
  idnegocio: number;
  idbeneficio: number;
  idbeneficioempresa: number;
  idpersona: number;
  horainicio: string;
  horafin: string;
  duracion: number;
  mesa: number;
  cantidad: number;
  estadoempresa: number;
  estadopersona: number;
  created_at: Date;

  beneficio: Beneficios;
  beneficioempresa: Beneficiosempresas;
  persona: Personas;
}
