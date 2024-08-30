import { Injectable } from '@angular/core';
import { RUTA, TOKEN } from '../_config/application';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { Precios } from '../_entidades/precios';
import { ToastrService } from 'ngx-toastr';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PreciosService {

  ruta = `${RUTA}/apirest/precios`;

  constructor( private _httpClient: HttpClient, private toast: ToastrService ) { }

  lista(id: number): Observable<Precios[]>{
    const access_token = JSON.parse(sessionStorage.getItem(TOKEN)).access_token;
    return this._httpClient.get<Precios[]>(`${this.ruta}/${id}`, {
      headers: new HttpHeaders().set('Authorization', `bearer ${access_token}`).set('Content-Type', 'application/json')
    }).pipe(
      catchError(error => {
        this.toast.error('Error al obtener la lista de Precios', 'Error');
        return throwError(() => error);
      })
    );
  }

  adicionar(precio: Precios):Observable <any>{
    const access_token = JSON.parse(sessionStorage.getItem(TOKEN)).access_token;
    return this._httpClient.post<void>(`${this.ruta}`, precio, {
      headers: new HttpHeaders().set('Authorization', `bearer ${access_token}`).set('Content-Type', 'application/json')
    }).pipe(
      catchError(error => {
        this.toast.error('Error al adicionar el Precio', 'Error');
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
        this.toast.error('Error al eliminar el Precio', 'Error');
        return throwError(() => error);
      })
    );
  }
}
