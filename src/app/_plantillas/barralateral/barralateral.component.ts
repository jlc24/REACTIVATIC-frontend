import { AccesoService } from 'src/app/_aods/acceso.service';
import { MenusService } from './../../_aods/menus.service';
import { Menus } from 'src/app/_entidades/menus';
import { Component, OnInit } from '@angular/core';
import { Roles } from 'src/app/_entidades/roles';

@Component({
  selector: 'app-barralateral',
  templateUrl: './barralateral.component.html',
  styleUrls: ['./barralateral.component.css'],
})
export class BarralateralComponent implements OnInit {

  menus: Menus[];
  nombre: string;
  nombrecliente: string;
  rol: string;
  cargo: string;

  constructor(
    private _menusService: MenusService,
    private _accesoService: AccesoService
  ) {}

  ngOnInit() {
    this.fmenus();
    this.fdatosusuario();
  }

  fmenus() {
    this._menusService.datos().subscribe((data) => {
      this.menus = data;
    });
  }

  fdatosusuario() {
    this.nombre = this._accesoService.nombreLogueado();
    this.nombrecliente = this._accesoService.nombreclienteLogueado();
    this.rol = this._accesoService.rolLogueado();
    this.cargo = this._accesoService.cargoLogueado();
  }

}
