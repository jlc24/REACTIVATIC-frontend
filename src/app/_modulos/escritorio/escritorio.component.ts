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

  constructor(
    private _accesoService: AccesoService,
    private _ruta: Router
  ) {}

  ngOnInit() {
    this.escliente = this._accesoService.esRolClientes();
    this.esempresa = this._accesoService.esRolEmpresa();
  }

  fmiscompras() {
    this._ruta.navigate(['solicitudescompra']);
  }

  fmisventas() {
    this._ruta.navigate(['solicitudesventa']);
  }

}
