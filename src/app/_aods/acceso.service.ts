import { NOMBRE, ROLES, NOMBRECLIENTE, CARGO } from './../_config/application';
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
    const nombre = sessionStorage.getItem(NOMBRE);
    return nombre;
  }

  nombreclienteLogueado(){
    const nombrecliente = sessionStorage.getItem(NOMBRECLIENTE);
    return nombrecliente;
  }

  rolLogueado(){
    const roles = sessionStorage.getItem(ROLES);
    return roles;
  }

  cargoLogueado(){
    const cargo = sessionStorage.getItem(CARGO);
    return cargo;
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

  esRolReactivatic(){
    const roles = sessionStorage.getItem(ROLES);
    if (roles.indexOf('ROLE_REACTIVATIC') >= 0) {
      return true;
    }else{
      return false;
    }
  }

  esRolDpeic(){
    const roles = sessionStorage.getItem(ROLES);
    if (roles.indexOf('ROLE_DPEIC') >= 0) {
      return true;
    }else{
      return false;
    }
  }
  esRolSddpi(){
    const roles = sessionStorage.getItem(ROLES);
    if (roles.indexOf('ROLE_SDDPI') >= 0) {
      return true;
    }else{
      return false;
    }
  }
  esRolAdmin(){
    const roles = sessionStorage.getItem(ROLES);
    if (roles.indexOf('ROLE_ADMINISTRADORES') >= 0) {
      return true;
    }else{
      return false;
    }
  }

  esCargoAdministrador(){
    const cargo = sessionStorage.getItem(CARGO);
    if (cargo.indexOf('ADMINISTRADOR') >= 0) {
      return true;
    }else{
      return false;
    }
  }
  esCargoSecretario(){
    const cargo = sessionStorage.getItem(CARGO);
    if (cargo.indexOf('SECRETARIO DEPARTAMENTAL DE DESARROLLO PRODUCTIVO E INDUSTRIA') >= 0) {
      return true;
    }else{
      return false;
    }
  }
  esCargoDirector(){
    const cargo = sessionStorage.getItem(CARGO);
    if (cargo.indexOf('DIRECTOR DE PROMOCION ECONOMIA INDUSTRIA Y COMERCIO') >= 0) {
      return true;
    }else{
      return false;
    }
  }
  esCargoApoyo(){
    const cargo = sessionStorage.getItem(CARGO);
    if (cargo.indexOf('PROFESIONAL TECNICO - APOYO PROD. MIPYMES') >= 0) {
      return true;
    }else{
      return false;
    }
  }
  esCargoEncargado(){
    const cargo = sessionStorage.getItem(CARGO);
    if (cargo.indexOf('ENCARGADO DE PROYECTO REACTIVA TIC') >= 0) {
      return true;
    }else{
      return false;
    }
  }
  esCargoMonitoreo(){
    const cargo = sessionStorage.getItem(CARGO);
    if (cargo.indexOf('TECNICO DE SEGUIMIENTO Y MONITOREO') >= 0) {
      return true;
    }else{
      return false;
    }
  }
  esCargoTecnologia(){
    const cargo = sessionStorage.getItem(CARGO);
    if (cargo.indexOf('PROFESIONAL TECNICO - ESPECIALISTA EN TECNOLOGIA, TECNICO DE GESTION DE LA INFORMACION') >= 0) {
      return true;
    }else{
      return false;
    }
  }
  esCargoMarketing(){
    const cargo = sessionStorage.getItem(CARGO);
    if (cargo.indexOf('PROFESIONAL TECNICO - TECNICO ESPECIALISTA EN MARKETING - SUPERVISOR PUBLICIDAD, GESTIÓN DE PATROCINIO') >= 0) {
      return true;
    }else{
      return false;
    }
  }
  esCargoTextil(){
    const cargo = sessionStorage.getItem(CARGO);
    if (cargo.indexOf('PROFESIONAL TECNICO - TECNICO ESPECIALISTA EN RUBRO TEXTIL') >= 0) {
      return true;
    }else{
      return false;
    }
  }
  esCargoArtesania(){
    const cargo = sessionStorage.getItem(CARGO);
    if (cargo.indexOf('PROFESIONAL TECNICO - TECNICO ESPECIALISTA EN RUBRO ARTESANIA') >= 0) {
      return true;
    }else{
      return false;
    }
  }
  esCargoAlimentos(){
    const cargo = sessionStorage.getItem(CARGO);
    if (cargo.indexOf('PROFESIONAL TECNICO - TECNICO ESPECIALISTA EN RUBRO ALIMENTOS') >= 0) {
      return true;
    }else{
      return false;
    }
  }
  esCargoChofer(){
    const cargo = sessionStorage.getItem(CARGO);
    if (cargo.indexOf('CHOFER PROFESIONAL') >= 0) {
      return true;
    }else{
      return false;
    }
  }
  esCargoPasante(){
    const cargo = sessionStorage.getItem(CARGO);
    if (cargo.indexOf('PASANTE') >= 0) {
      return true;
    }else{
      return false;
    }
  }





  cerrarSesion() {
    sessionStorage.clear();
    this._ruta.navigateByUrl('/acceso');
  }
}
