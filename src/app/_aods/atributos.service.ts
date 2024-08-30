import { Injectable } from '@angular/core';
import { RUTA, TOKEN } from '../_config/application';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { Observable, throwError } from 'rxjs';
import { Atributos } from '../_entidades/atributos';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AtributosService {

  ruta = `${RUTA}/apirest/atributos`;

  constructor( private _httpClient: HttpClient, private _toast: ToastrService ) { }

  lista(id: number): Observable<Atributos[]>{
    const access_token = JSON.parse(sessionStorage.getItem(TOKEN)).access_token;
    return this._httpClient.get<Atributos[]>(`${this.ruta}/${id}`, {
      headers: new HttpHeaders().set('Authorization', `bearer ${access_token}`).set('Content-Type', 'application/json')
    }).pipe(
      catchError(error => {
        this._toast.error('Error al obtener la lista de Atributos', 'Error');
        return throwError(() => error);
      })
    );
  }

  adicionar(atributo: Atributos):Observable <any>{
    const access_token = JSON.parse(sessionStorage.getItem(TOKEN)).access_token;
    return this._httpClient.post<void>(`${this.ruta}`, atributo, {
      headers: new HttpHeaders().set('Authorization', `bearer ${access_token}`).set('Content-Type', 'application/json')
    }).pipe(
      catchError(error => {
        this._toast.error('Error al adicionar el Atributo', 'Error');
        return throwError(() => error);
      })
    );
  }

  eliminar(id: number): Observable<void>{
    const access_token = JSON.parse(sessionStorage.getItem(TOKEN)).access_token;
    return this._httpClient.delete<void>(`${this.ruta}/${id}`, {
      headers: new HttpHeaders().set('Authorization', `bearer ${access_token}`).set('Content-Type', 'application/json')
    }).pipe(
      catchError(error => {
        this._toast.error('Error al eliminar el Atributo', 'Error');
        return throwError(() => error);
      })
    );
  }
}
