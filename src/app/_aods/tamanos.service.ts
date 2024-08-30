import { Injectable } from '@angular/core';
import { RUTA, TOKEN } from '../_config/application';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { Observable, throwError } from 'rxjs';
import { Tamanos } from '../_entidades/tamanos';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class TamanosService {

  ruta = `${RUTA}/apirest/tamanos`;

  constructor( private _httpClient: HttpClient, private _toast: ToastrService ) { }

  lista(id: number): Observable<Tamanos[]>{
    const access_token = JSON.parse(sessionStorage.getItem(TOKEN)).access_token;
    return this._httpClient.get<Tamanos[]>(`${this.ruta}/${id}`, {
      headers: new HttpHeaders().set('Authorization', `bearer ${access_token}`).set('Content-Type', 'application/json')
    }).pipe(
      catchError(error => {
        this._toast.error('Error al obtener la lista de Tamaños o Tallas', 'Error');
        return throwError(() => error);
      })
    );
  }

  adicionar(tamanos: Tamanos):Observable <any>{
    const access_token = JSON.parse(sessionStorage.getItem(TOKEN)).access_token;
    return this._httpClient.post<void>(`${this.ruta}`, tamanos, {
      headers: new HttpHeaders().set('Authorization', `bearer ${access_token}`).set('Content-Type', 'application/json')
    }).pipe(
      catchError(error => {
        this._toast.error('Error al adicionar el Tamaño o la Talla', 'Error');
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
        this._toast.error('Error al eliminar el Tamaño o la Talla', 'Error');
        return throwError(() => error);
      })
    );
  }
}
