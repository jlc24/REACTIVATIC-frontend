import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AccesoService } from 'src/app/_aods/acceso.service';

@Component({
  selector: 'app-escritorio',
  templateUrl: './escritorio.component.html',
  styleUrls: ['./escritorio.component.css'],
})
export class EscritorioComponent implements OnInit {

  escliente: boolean =false;
  esempresa: boolean =false;
  esreactivatic: boolean =false;
  essddpi: boolean =false;
  esadmin: boolean =false;

  constructor(
    private _accesoService: AccesoService,
    private _ruta: Router
  ) {}

  ngOnInit() {
    this.escliente = this._accesoService.esRolClientes();
    this.esempresa = this._accesoService.esRolEmpresa();
    this.esreactivatic = this._accesoService.esRolReactivatic();
    this.essddpi = this._accesoService.esRolSddpi();
    this.esadmin = this._accesoService.esRolAdmin();
  }

  fmiscompras() {
    this._ruta.navigate(['solicitudescompra']);
  }

  fmisventas() {
    this._ruta.navigate(['solicitudesventa']);
  }

  fusuario(){
    this._ruta.navigate(['usuarios']);
  }
  funidadprod(){
    this._ruta.navigate(['empresas']);
  }
  fmunicipio(){
    this._ruta.navigate(['municipios']);
  }
  fproductos(){
    this._ruta.navigate(['productos']);
  }

}
