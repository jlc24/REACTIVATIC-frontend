import { catchError } from 'rxjs/operators';
import { Procesar } from './../_entidades/procesar';
import { Rubros } from './../_entidades/rubros';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { RUTA, TOKEN } from '../_config/application';
import { Productos } from '../_entidades/productos';
import swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class CatalogosService {

  ruta = `${RUTA}/catalogos`;

  constructor(private _httpClient: HttpClient) { }

  datos(pagina: number, cantidad: number, buscar: string): Observable<Productos[]> {
    return this._httpClient.get<Productos[]>(`${this.ruta}/?pagina=${pagina}&cantidad=${cantidad}&buscar=${buscar}`);
  }

  cantidad(buscar: string): Observable<number> {
    return this._httpClient.get<number>(`${this.ruta}/cantidad?buscar=${buscar}`);
  }

  dato(id: number): Observable<Productos> {
    return this._httpClient.get<Productos>(`${this.ruta}/${id}`);
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
    return this._httpClient.post<Procesar>(`${this.ruta}/usuariocatalogo`, dato);
  }
}
