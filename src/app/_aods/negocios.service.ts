import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { RUTA } from '../_config/application';
import { Observable } from 'rxjs';
import { Negocios } from '../_entidades/negocios';
import { Beneficios } from '../_entidades/beneficios';

@Injectable({
  providedIn: 'root'
})
export class NegociosService {

  ruta = `${RUTA}/negocios`;

  constructor(private _httpClient: HttpClient, private toast: ToastrService) { }

  datos(buscar: string, beneficio: number): Observable<Negocios[]>{
    return this._httpClient.get<Negocios[]>(`${this.ruta}?buscar=${buscar}&beneficio=${beneficio}`);
  }

  dato(id: number, beneficio: number): Observable<Negocios>{
    return this._httpClient.get<Negocios>(`${this.ruta}/${id}&beneficio=${beneficio}`);
  }

  cantidad(buscar: string, beneficio: number): Observable<number> {
    return this._httpClient.get<number>(`${this.ruta}/cantidad?buscar=${buscar}&beneficio=${beneficio}`);
  }

  negocios(): Observable<Beneficios>{
    return this._httpClient.get<Beneficios>(`${this.ruta}/beneficio`);
  }
}
