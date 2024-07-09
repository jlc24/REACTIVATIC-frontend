import { ROLES } from './../_config/application';
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AccesoService } from '../_aods/acceso.service';

@Injectable({
  providedIn: 'root'
})
export class GuardianGuard implements CanActivate {

  constructor(
    private _accesoService: AccesoService,
    private _ruta: Router
  ) {}

  canActivate(
    _ruta: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

      const roles = sessionStorage.getItem(ROLES);
      const rol = _ruta.data.rol;

      const rpta = this._accesoService.estaLogeado();

      if (!rpta) {
        sessionStorage.clear();
        this._ruta.navigateByUrl('/acceso');
      } else {

        if (rol === 'ROLE_TODOS') {
          return true;
        } else {
          if (roles.indexOf(rol) >= 0) {
            return true;
          } else {
            this._ruta.navigateByUrl('/e401');
          }
        }
      }
  }

}
