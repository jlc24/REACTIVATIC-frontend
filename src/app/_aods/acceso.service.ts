import { NOMBRE, ROLES, NOMBRECLIENTE } from './../_config/application';
import { Injectable } from '@angular/core';
import { RUTA, TOKEN, TOKEN_USUARIO, TOKEN_PASSWORD } from '../_config/application';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import * as jwt_decode from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class AccesoService {

  ruta = `${RUTA}/oauth/token`;

  constructor(
    private _httpClient: HttpClient,
    private _ruta: Router
  ) { }

  acceso(usuario: string, clave: string) {
    const body = `grant_type=password&username=${encodeURIComponent(
      usuario
    )}&password=${encodeURIComponent(clave)}`;
    return this._httpClient.post(this.ruta, body, {
      headers: new HttpHeaders()
        .set('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8')
        .set(
          'Authorization',
          'Basic ' + btoa(TOKEN_USUARIO + ':' + TOKEN_PASSWORD)
        ),
    });
  }

  nombreLogueado(){
    const token = sessionStorage.getItem(NOMBRE);
    return token;
  }

  nombreclienteLogueado(){
    const token = sessionStorage.getItem(NOMBRECLIENTE);
    return token;
  }

  estaLogeado() {
    const token = sessionStorage.getItem(TOKEN);
    return token;
  }

  esRolClientes(){
    const roles = sessionStorage.getItem(ROLES);
    if (roles.indexOf('ROLE_CLIENTES') >= 0) {
      return true;
    } else {
      return false;
    }
  }

  esRolEmpresa(){
    const roles = sessionStorage.getItem(ROLES);
    if (roles.indexOf('ROLE_EMPRESAS') >= 0) {
      return true;
    } else {
      return false;
    }
  }

  cerrarSesion() {
    sessionStorage.clear();
    this._ruta.navigateByUrl('/acceso');
  }
}
