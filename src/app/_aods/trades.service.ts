import { Injectable } from '@angular/core';
import { RUTA, TOKEN } from '../_config/application';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { Negocios } from '../_entidades/negocios';

@Injectable({
  providedIn: 'root'
})
export class TradesService {

  ruta = `${RUTA}/apirest/negocios`;

  constructor(private _httpClient: HttpClient, private toast: ToastrService) { }

  datos(buscar: string, beneficio: string):Observable<Negocios[]>{
    const access_token = JSON.parse(sessionStorage.getItem(TOKEN)).access_token;
    return this._httpClient.get<Negocios[]>(`${this.ruta}?buscar=${buscar}&beneficio=${beneficio}`, {
          headers: new HttpHeaders().set('Authorization', `bearer ${access_token}`).set('Content-Type', 'application/json')
    });
  }
}
