import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AccesoService } from 'src/app/_aods/acceso.service';
import { UsuariosService } from 'src/app/_aods/usuarios.service';
import { EmpresasService } from 'src/app/_aods/empresas.service';
import { MunicipiosService } from 'src/app/_aods/municipios.service';
import { ProductosService } from 'src/app/_aods/productos.service';
import { SolicitudesService } from 'src/app/_aods/solicitudes.service';

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
  totalusuarios: number = 0;
  totalempresas: number = 0;
  totalmunicipios: number = 0;
  totalproductos: number = 0;
  totalsolicitudesventa: number = 0;

  constructor(
    private _usuariosService: UsuariosService,
    private _empresasService: EmpresasService,
    private _municipiosService: MunicipiosService,
    private _productosService: ProductosService,
    private _solicitudesService: SolicitudesService,
    private _accesoService: AccesoService,
    private _ruta: Router
  ) {}

  ngOnInit() {
    this.escliente = this._accesoService.esRolClientes();
    this.esempresa = this._accesoService.esRolEmpresa();
    this.esreactivatic = this._accesoService.esRolReactivatic();
    this.essddpi = this._accesoService.esRolSddpi();
    this.esadmin = this._accesoService.esRolAdmin();
    this.fcantidadusuarios();
    this.fcantidadempresas();
    this.fcantidadmunicipios();
    this.fcantidadproductos();
    this.fcantidadsventa();
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

  fcantidadusuarios() {
    // this.esadmin = this._accesoService.esRolAdmin();
    // this.essddpi = this._accesoService.esRolSddpi();
    // this.esreactivatic = this._accesoService.esRolReactivatic();
    if (this.esadmin) {
      this._usuariosService.cantidad(this.buscar).subscribe((data) => {
        this.totalusuarios = data;
      });
    }
    if (this.essddpi) {
      this._usuariosService.cantidadsddpi(this.buscar).subscribe((data) => {
        this.totalusuarios = data;
      });
    }
    if (this.esreactivatic) {
      this._usuariosService.cantidadreactivatic(this.buscar).subscribe((data) => {
        this.totalusuarios = data;
      });
    }
  }

  fcantidadempresas() {
    this._empresasService.cantidad(this.buscar).subscribe((data) => {
      this.totalempresas = data;
    })
  }

  fcantidadmunicipios() {
    this._municipiosService.cantidad(this.buscar).subscribe((data) => {
      this.totalmunicipios = data;
    })
  }

  fcantidadproductos(){
    if (this.esempresa) {
      this._productosService.cantidad(this.buscar).subscribe((data) => {
        this.totalproductos = data;
      })
    }else{
      this._productosService.cantidadtotal(this.buscar).subscribe((data) => {
        this.totalproductos = data;
      })
    }
  }

  fcantidadsventa(){
    this._solicitudesService.cantidade().subscribe((data) => {
      this.totalsolicitudesventa = data;
    })
  }

}
