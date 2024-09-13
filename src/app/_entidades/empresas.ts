import { Asociaciones } from 'src/app/_entidades/asociaciones';
import { Localidades } from './localidades';
import { Subrubros } from './subrubros';
import { Representantes } from './representantes';
import { Usuarios } from './usuarios';
import { Imagen } from './imagen';
import { Rubros } from './rubros';
import { Municipios } from './municipios';

export class Empresas {
  idempresa: number;
  idrubro: number;
  idsubrubro: number;
  idmunicipio: number;
  idlocalidad: number;
  idrepresentante: number;
  idasociacion: number;
  empresa: string;
  tipo: string;
  direccion: string;
  telefono: string;
  celular: string;
  correo: string;
  facebook: string;
  twitter: string;
  instagram: string;
  paginaweb: string;
  nform: string;
  registrosenasag: number;
  latitud: number;
  longitud: number;
  descripcion: string;
  nit: string;
  bancamovil: boolean;
  fechaapertura: Date;
  servicios: string;
  capacidad: number;
  unidadmedida: string;
  motivo: number;
  otromotivo: string;
  familiar: boolean;
  involucrados: number;
  otrosinvolucrados: string;
  trabajadores: number;
  participacion: number;
  capacitacion: string;
  zona: string;
  referencia: string;
  transporte: string;
  idusuario: number;
  fechareg: Date;
  razonsocial: string;
  estado: boolean;
  created_at: Date;

  representante: Representantes;
  rubro: Rubros;
  subrubro: Subrubros;
  municipio: Municipios;
  localidad: Localidades;
  asociacion: Asociaciones;
  usuario: Usuarios;

  imagen?: Imagen;
}
