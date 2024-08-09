import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { RUTA, TOKEN } from '../_config/application';
import { Roles } from '../_entidades/roles';
import Swal from 'sweetalert2';

@Injectable({
    providedIn: 'root'
})
export class RolesService {

    ruta = `${RUTA}/apirest/roles`;

    constructor(private _httpClient: HttpClient){}

    datos(pagina: number, cantidad: number, buscar: string): Observable<Roles[]> {
      const access_token = JSON.parse(sessionStorage.getItem(TOKEN)).access_token;
      return this._httpClient.get<Roles[]>(`${this.ruta}?pagina=${pagina}&cantidad=${cantidad}&buscar=${buscar}`, {
        headers: new HttpHeaders().set('Authorization', `bearer ${access_token}`).set('Content-Type', 'application/json')
      });
    }

    dato(id: number): Observable<Roles>{
      const access_token = JSON.parse(sessionStorage.getItem(TOKEN)).access_token;
    return this._httpClient.get<Roles>(`${this.ruta}/${id}`, {
      headers: new HttpHeaders().set('Authorization', `bearer ${access_token}`).set('Content-Type', 'application/json')
    });
    }

    cantidad(buscar: string): Observable<number> {
      const access_token = JSON.parse(sessionStorage.getItem(TOKEN)).access_token;
      return this._httpClient.get<number>(`${this.ruta}/cantidad?buscar=${buscar}`, {
        headers: new HttpHeaders().set('Authorization', `bearer ${access_token}`).set('Content-Type', 'application/json')
      });
    }

    listar(): Observable<Roles[]>{
        const access_token = JSON.parse(sessionStorage.getItem(TOKEN)).access_token;
        return this._httpClient.get<Roles[]>(`${this.ruta}/l`, {
            headers: new HttpHeaders().set('Authorization', `bearer ${access_token}`).set('Content-Type', 'application/json')
        });
    }
    listaradmin(): Observable<Roles[]>{
        const access_token = JSON.parse(sessionStorage.getItem(TOKEN)).access_token;
        return this._httpClient.get<Roles[]>(`${this.ruta}/admin`, {
            headers: new HttpHeaders().set('Authorization', `bearer ${access_token}`).set('Content-Type', 'application/json')
        });
    }

    listarsddpi(): Observable<Roles[]>{
        const access_token = JSON.parse(sessionStorage.getItem(TOKEN)).access_token;
        return this._httpClient.get<Roles[]>(`${this.ruta}/sddpi`, {
            headers: new HttpHeaders().set('Authorization', `bearer ${access_token}`).set('Content-Type', 'application/json')
        });
    }
    listarreactivatic(): Observable<Roles[]>{
        const access_token = JSON.parse(sessionStorage.getItem(TOKEN)).access_token;
        return this._httpClient.get<Roles[]>(`${this.ruta}/reactivatic`, {
            headers: new HttpHeaders().set('Authorization', `bearer ${access_token}`).set('Content-Type', 'application/json')
        });
    }

}
