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

    listar(): Observable<Roles[]>{
        const access_token = JSON.parse(sessionStorage.getItem(TOKEN)).access_token;
        return this._httpClient.get<Roles[]> (`${this.ruta}`, {
            headers: new HttpHeaders().set('Authorization', `bearer ${access_token}`).set('Content-Type', 'application/json')
        });
    }
    listaradmin(): Observable<Roles[]>{
        const access_token = JSON.parse(sessionStorage.getItem(TOKEN)).access_token;
        return this._httpClient.get<Roles[]> (`${this.ruta}/admin`, {
            headers: new HttpHeaders().set('Authorization', `bearer ${access_token}`).set('Content-Type', 'application/json')
        });
    }
    
    listarsddpi(): Observable<Roles[]>{
        const access_token = JSON.parse(sessionStorage.getItem(TOKEN)).access_token;
        return this._httpClient.get<Roles[]> (`${this.ruta}/sddpi`, {
            headers: new HttpHeaders().set('Authorization', `bearer ${access_token}`).set('Content-Type', 'application/json')
        });
    }
    listarreactivatic(): Observable<Roles[]>{
        const access_token = JSON.parse(sessionStorage.getItem(TOKEN)).access_token;
        return this._httpClient.get<Roles[]> (`${this.ruta}/reactivatic`, {
            headers: new HttpHeaders().set('Authorization', `bearer ${access_token}`).set('Content-Type', 'application/json')
        });
    }

}
