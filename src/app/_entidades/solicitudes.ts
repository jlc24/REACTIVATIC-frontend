import { Empresas } from './empresas';
import { Time } from '@angular/common';
import { Solicitudesproductos } from './solicitudesproductos';
import { Clientes } from './clientes';

export class Solicitudes {
  idsolicitud: number;
  idempresa: number;
  idcliente: number;
  solicitud: string;
  fecha: Date;
  hora: Time;
  estado: boolean;
  empresa: Empresas;
  cliente: Clientes;
  solicitudproductos: Solicitudesproductos[];
}
