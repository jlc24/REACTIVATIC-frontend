import { Injectable } from '@angular/core';
import { RUTA, TOKEN } from '../_config/application';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Menus } from '../_entidades/menus';

@Injectable({
  providedIn: 'root'
})
export class MenusService {

  ruta = `${RUTA}/apirest/menus`;

  constructor(private _httpClient: HttpClient) { }

  datos(): Observable<Menus[]> {
    const access_token = JSON.parse(sessionStorage.getItem(TOKEN)).access_token;
    return this._httpClient.get<Menus[]>(`${this.ruta}`, {
      headers: new HttpHeaders().set('Authorization', `bearer ${access_token}`).set('Content-Type', 'application/json')
    });
  }


}
