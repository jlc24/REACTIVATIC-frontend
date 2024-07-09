import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CarritosService } from 'src/app/_aods/carritos.service';
import { SolicitudesService } from 'src/app/_aods/solicitudes.service';
import { Carritos } from 'src/app/_entidades/carritos';
import { Solicitudes } from 'src/app/_entidades/solicitudes';
import swal from 'sweetalert2';

@Component({
  selector: 'app-solicitudesventa',
  templateUrl: './solicitudesventa.component.html',
  styleUrls: ['./solicitudesventa.component.css']
})
export class SolicitudesventaComponent implements OnInit {

  datos: Solicitudes[];

  pagina: number = 0;
  numPaginas: number = 0;
  cantidad: number = 10;
  buscar: string = '';
  total: number = 0;
  estado: string = '';

  carritos: Carritos[];

  constructor(
    private _solicitudesService: SolicitudesService,
  ) { }

  ngOnInit(): void {
    this.fdatos();
  }

  fcantidad() {
    this._solicitudesService.cantidade().subscribe((data) => {
      this.total = data;
    });
  }

  fdatos() {
    this._solicitudesService.datose(this.pagina, this.cantidad).subscribe((data) => {
      this.fcantidad();
      this.datos = data;
    });
  }

  mostrarMas(evento: any) {
    this.pagina = evento;
    this.fdatos();
  }

  fenviarmensaje(celular: string) {
    const ruta = 'https://api.whatsapp.com/send?phone=591' + celular + '"&text=Hola Me gustaria comunicarme contigo';
    window.open(ruta, '_blank');
  }

  factualizarestado(id: number){
    let actualizasolicitud: Solicitudes = new Solicitudes();
    actualizasolicitud.idsolicitud = id;
    this._solicitudesService.actualizarestado(actualizasolicitud).subscribe( data=> {
      swal.fire('Solicitud cerrada', "Su solicitud fue cerrado con extio", 'success');
      this.fdatos();
    });
  }

}
