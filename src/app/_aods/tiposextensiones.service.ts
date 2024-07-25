import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { RUTA, TOKEN } from '../_config/application';
import { Tiposextensiones } from '../_entidades/tiposextensiones';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class TiposextensionesService {

  ruta = `${RUTA}/apirest/tiposextensiones`;

  constructor(private _httpClient: HttpClient) { }

  listar(): Observable<Tiposextensiones[]>{
    const access_token = JSON.parse(sessionStorage.getItem(TOKEN)).access_token;
    return this._httpClient.get<Tiposextensiones[]> (`${this.ruta}`, {
      headers: new HttpHeaders().set('Authorization', `bearer ${access_token}`).set('Content-Type', 'application/json')
    });
  }
}
