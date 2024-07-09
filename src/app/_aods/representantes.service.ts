import { Representantes } from './../_entidades/representantes';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RUTA, TOKEN } from '../_config/application';

@Injectable({
  providedIn: 'root'
})
export class RepresentantesService {

  ruta = `${RUTA}/apirest/representantes`;

  constructor(private _httpClient: HttpClient) { }

  datosl(): Observable<Representantes[]> {
    const access_token = JSON.parse(sessionStorage.getItem(TOKEN)).access_token;
    return this._httpClient.get<Representantes[]>(`${this.ruta}/l`, {
      headers: new HttpHeaders().set('Authorization', `bearer ${access_token}`).set('Content-Type', 'application/json')
    });
  }

  datosPDF(buscar: string) {
    const access_token = JSON.parse(sessionStorage.getItem(TOKEN))
      .access_token;
    return this._httpClient.get(`${this.ruta}/datosPDF?&buscar=${buscar}`, {
      responseType: "blob",
      headers: new HttpHeaders()
        .set("Authorization", `bearer ${access_token}`)
        .set("Content-Type", "application/json")
    });
  }

  datosXLS(buscar: string) {
    const access_token = JSON.parse(sessionStorage.getItem(TOKEN))
      .access_token;
    return this._httpClient.get(`${this.ruta}/datosXLS?&buscar=${buscar}`, {
      responseType: "blob",
      headers: new HttpHeaders()
        .set("Authorization", `bearer ${access_token}`)
        .set("Content-Type", "application/json")
    });
  }
}
