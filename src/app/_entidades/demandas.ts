import { Empresas } from "./empresas";

export class Demandas {
    iddemanda: number;
    idempresa: number;
    tipodemanda: string;
    demanda: number;
    estado: boolean;
    created_at: Date;
    
    empresa: Empresas;
}