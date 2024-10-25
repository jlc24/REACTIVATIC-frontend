import { Beneficios } from "./beneficios";

export class Asistencias {
  idasistencia: number;
  idbeneficio: number;
  dias: number;
  duraciondias: number;
  duracioncurso: number;
  estado: boolean;
  created_at: Date;

  beneficio: Beneficios;
}
