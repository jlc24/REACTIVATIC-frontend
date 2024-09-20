import { Injectable } from '@angular/core';
import { RUTA, TOKEN } from '../_config/application';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Tiposbeneficios } from '../_entidades/tiposbeneficios';

@Injectable({
  providedIn: 'root'
})
export class TiposbeneficiosService {

  ruta = `${RUTA}/apirest/tiposbeneficios`;

  constructor(
    private _httpClient: HttpClient
  ) { }

  listar(): Observable<Tiposbeneficios[]>{
    const access_token = JSON.parse(sessionStorage.getItem(TOKEN)).access_token;
    return this._httpClient.get<Tiposbeneficios[]> (`${this.ruta}`, {
      headers: new HttpHeaders().set('Authorization', `bearer ${access_token}`).set('Content-Type', 'application/json')
    });
  }
}
