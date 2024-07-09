import { Solicitudes } from './../../_entidades/solicitudes';
import { SolicitudesService } from './../../_aods/solicitudes.service';
import { Router } from '@angular/router';
import { Carritos } from './../../_entidades/carritos';
import { CarritosService } from './../../_aods/carritos.service';
import { Component, OnInit } from '@angular/core';
import swal from 'sweetalert2';

@Component({
  selector: 'app-solicitudescompra',
  templateUrl: './solicitudescompra.component.html',
  styleUrls: ['./solicitudescompra.component.css']
})
export class SolicitudescompraComponent implements OnInit {

  datos: Solicitudes[];

  pagina:number = 0;
  numPaginas:number = 0;
  cantidad:number = 10;
  buscar:string = '';
  total:number = 0;
  estado:string = '';

  carritos: Carritos[];

  constructor(
    private _carritosService: CarritosService,
    private _solicitudesService: SolicitudesService,
    private _ruta: Router
  ) { }

  ngOnInit(): void {
    this.fcarrito();
    this.fdatos();
  }

  fcantidad() {
    this._solicitudesService.cantidad().subscribe((data) => {
      this.total = data;
    });
  }

  fdatos() {
    this._solicitudesService.datos(this.pagina, this.cantidad).subscribe((data) => {
        this.fcantidad();
        this.datos = data;
      });
  }

  mostrarMas(evento: any) {
    this.pagina = evento;
    this.fdatos();
  }

  fcarrito() {
    let idcliente = JSON.parse(localStorage.getItem('idcliente'));
    this._carritosService.datosl(idcliente).subscribe( data => {
      this.carritos = data;
    });
  };

  fsiguecomprando() {
    this._ruta.navigateByUrl('/catalogo');
  }

  fprocesa() {
    let idcliente = JSON.parse(localStorage.getItem('idcliente'));
    this._solicitudesService.procesasolicitud(idcliente).subscribe( data => {
      idcliente = Math.floor((Math.random() * 1000000) + 1);
      localStorage.setItem('idcliente', JSON.stringify(idcliente));
      swal.fire('Proceso completado', 'Proceso completado', 'success');
      this.fcarrito();
      this.fdatos();
    });
  }

  fenviarmensaje(celular: string){
    const ruta='https://api.whatsapp.com/send?phone=591'+celular+'"&text=Hola Me gustaria comunicarme contigo';
    window.open(ruta, '_blank');
  }

}
