import { catchError } from 'rxjs/operators';
import { Procesar } from './../_entidades/procesar';
import { Rubros } from './../_entidades/rubros';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { RUTA, TOKEN } from '../_config/application';
import { Productos } from '../_entidades/productos';
import swal from 'sweetalert2';
import { Subrubros } from '../_entidades/subrubros';
import { Municipios } from '../_entidades/municipios';
import { Precios } from '../_entidades/precios';
import { Colores } from '../_entidades/colores';
import { Materiales } from '../_entidades/materiales';
import { Tamanos } from '../_entidades/tamanos';
import { Atributos } from '../_entidades/atributos';
import { Usuarios } from '../_entidades/usuarios';

@Injectable({
  providedIn: 'root'
})
export class CatalogosService {

  ruta = `${RUTA}/catalogos`;

  constructor(private _httpClient: HttpClient) { }

  datos(pagina: number, cantidad: number, buscar: string, orden: string): Observable<Productos[]> {
    return this._httpClient.get<Productos[]>(`${this.ruta}/?pagina=${pagina}&cantidad=${cantidad}&buscar=${buscar}&orden=${orden}`);
  }

  cantidad(buscar: string): Observable<number> {
    return this._httpClient.get<number>(`${this.ruta}/cantidad?buscar=${buscar}`);
  }

  precios(id: number): Observable<Precios[]>{
    return this._httpClient.get<Precios[]>(`${this.ruta}/precios/${id}`);
  }

  colores(id: number): Observable<Colores[]>{
    return this._httpClient.get<Colores[]>(`${this.ruta}/colores/${id}`);
  }

  materiales(id: number): Observable<Materiales[]>{
    return this._httpClient.get<Materiales[]>(`${this.ruta}/materiales/${id}`);
  }

  tamanos(id: number): Observable<Tamanos[]>{
    return this._httpClient.get<Tamanos[]>(`${this.ruta}/tamanos/${id}`);
  }

  atributos(id: number): Observable<Atributos[]>{
    return this._httpClient.get<Atributos[]>(`${this.ruta}/atributos/${id}`);
  }

  dato(id: number): Observable<Productos> {
    return this._httpClient.get<Productos>(`${this.ruta}/${id}`);
  }

  download(id: number, tipo: string): Observable<any>{
    return this._httpClient.get(`${this.ruta}/imagen/download?id=${id}&tipo=${tipo}`);
  }

  rubros(): Observable<Rubros[]> {
    return this._httpClient.get<Rubros[]>(`${this.ruta}/rubros`);
  }

  listaMunicipios(): Observable<Municipios[]>{
    return this._httpClient.get<Municipios[]>(`${this.ruta}/productos`);
  }

  cantidadporrubros(): Observable<Rubros[]> {
    return this._httpClient.get<Rubros[]>(`${this.ruta}/cantidadporrubros`);
  }

  procesar(dato: Procesar): Observable<any> {
    return this._httpClient.post<void>(`${this.ruta}`, dato).pipe(
      catchError(e => {
        if (e.status === 400 ) {
          return throwError(e);
        }
        swal.fire('Error en los datos', 'Los datos no son correctos', 'error');
        return throwError(e);
      })
    );
  }

  usuariocatalogo(dato: Procesar): Observable<Procesar> {
    const payload = {
      usuario: dato.usuario,
      clave: dato.clave
  };
    return this._httpClient.post<Procesar>(`${this.ruta}/usuariocatalogo`, payload);
  }
}
