import { Municipios } from "./municipios";
import { Tiposbeneficios } from "./tiposbeneficios";
import { Usuarios } from "./usuarios";

export class Beneficios {
  idbeneficio: number;
  beneficio: string;
  descripcion: string;
  idtipobeneficio: number;
  idmunicipio: number;
  direccion: string;
  fechainicio: Date;
  fechafin: Date;
  idcapacitador: number;
  capacidad: number;
  idusuario: number;
  estado: boolean;
  created_at: Date;

  tipobeneficio: Tiposbeneficios;
  municipio: Municipios;
  capacitador: Usuarios;
  usuario: Usuarios;
}
