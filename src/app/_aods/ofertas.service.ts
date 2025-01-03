import { Injectable } from '@angular/core';
import { RUTA, TOKEN } from '../_config/application';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Ofertas } from '../_entidades/ofertas';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class OfertasService {

  ruta = `${RUTA}/apirest/ofertas`;

  constructor(private _httpClient: HttpClient, private toast: ToastrService) { }

  ofertas(empresa: number): Observable<Ofertas[]> {
    const access_token = JSON.parse(sessionStorage.getItem(TOKEN)).access_token;
    return this._httpClient.get<Ofertas[]>(`${this.ruta}?empresa=${empresa}`, {
      headers: new HttpHeaders().set('Authorization', `bearer ${access_token}`).set('Content-Type', 'application/json')
    });
  }

  dato(id: number, empresa: string): Observable<Ofertas> {
    const access_token = JSON.parse(sessionStorage.getItem(TOKEN)).access_token;
    return this._httpClient.get<Ofertas>(`${this.ruta}/${id}?empresa=${empresa}`, {
      headers: new HttpHeaders().set('Authorization', `bearer ${access_token}`).set('Content-Type', 'application/json')
    });
  }

  adicionar(dato: Ofertas):Observable <any>{
    const access_token = JSON.parse(sessionStorage.getItem(TOKEN)).access_token;
    return this._httpClient.post<void>(`${this.ruta}`, dato, {
      headers: new HttpHeaders().set('Authorization', `bearer ${access_token}`).set('Content-Type', 'application/json')
    }).pipe(
      catchError(error => {
        this.toast.error('Error al adicionar la Oferta', 'Error');
        return throwError(() => error);
      })
    );
  }

  modificar(dato: Ofertas):Observable <any>{
    const access_token = JSON.parse(sessionStorage.getItem(TOKEN)).access_token;
    return this._httpClient.put<void>(`${this.ruta}`, dato, {
      headers: new HttpHeaders().set('Authorization', `bearer ${access_token}`).set('Content-Type', 'application/json')
    }).pipe(
      catchError(error => {
        this.toast.error('Error al adicionar la Oferta', 'Error');
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
        this.toast.error('Error al eliminar la Oferta', 'Error');
        return throwError(() => error);
      })
    );
  }
}
