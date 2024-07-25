import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AccesoService } from 'src/app/_aods/acceso.service';
import { UsuariosService } from 'src/app/_aods/usuarios.service';

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
  buscar: string = '';
  total: number = 0;

  constructor(
    private _usuariosService: UsuariosService,
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

  fcantidad() {
    this.esadmin = this._accesoService.esRolAdmin();
    this.essddpi = this._accesoService.esRolSddpi();
    this.esreactivatic = this._accesoService.esRolReactivatic();
    if (this.esadmin) {
      this._usuariosService.cantidad(this.buscar).subscribe((data) => {
        this.total = data;
      });
    }
    if (this.essddpi) {
      this._usuariosService.cantidadsddpi(this.buscar).subscribe((data) => {
        this.total = data;
      });
    }
    if (this.esreactivatic) {
      this._usuariosService.cantidadreactivatic(this.buscar).subscribe((data) => {
        this.total = data;
      });
    }
  }

}
