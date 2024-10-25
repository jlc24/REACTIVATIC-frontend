import { Asistencias } from "./asistencias";
import { Beneficiosempresas } from "./beneficiosempresas";

export class Asistenciasempresas{
  idasistenciaempresa: number;
  idasistencia: number;
  idbeneficioempresa: number;
  asistencia: boolean;
  fecha: Date;
  estado: boolean;
  created_at: Date;

  asistencias: Asistencias;
  beneficiosempresa: Beneficiosempresas;
}
