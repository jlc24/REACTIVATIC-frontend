import { Solicitudes } from './../../_entidades/solicitudes';
import { Component, OnInit } from '@angular/core';
import { SolicitudesService } from 'src/app/_aods/solicitudes.service';

@Component({
  selector: 'app-clientesregistrados',
  templateUrl: './clientesregistrados.component.html',
  styleUrls: ['./clientesregistrados.component.css']
})
export class ClientesregistradosComponent implements OnInit {

  datos: Solicitudes[];
  dato: Solicitudes;

  pagina:number = 0;
  numPaginas:number = 0;
  cantidad:number = 10;
  buscar:string = '';
  total:number = 0;
  estado:string = '';

  constructor(
    private _solicitudesService: SolicitudesService,
  ) { }

  ngOnInit(): void {
    this.fdatos();
  }

  fcantidad() {
    this._solicitudesService.cantidadrep(this.buscar).subscribe((data) => {
      this.total = data;
    });
  }

  fbuscar() {
    this.pagina = 0;
    this.fdatos();
  }

  fdatos() {
    this._solicitudesService.datosrep(this.pagina, this.cantidad, this.buscar).subscribe((data) => {
        this.fcantidad();
        this.datos = data;
      });
  }

  limpiar() {
    this.pagina = 0;
    this.buscar = '';
    this.fdatos();
  }

  mostrarMas(evento: any) {
    this.pagina = evento;
    this.fdatos();
  }

  fdatosXLS() {
    this._solicitudesService.datosXLS(this.buscar).subscribe(data => {
      const url = window.URL.createObjectURL(data);
      const a = document.createElement("a");
      a.setAttribute("style", "display:none;");
      document.body.appendChild(a);
      a.href = url;
      a.download = "datos.xlsx";
      a.click();
      return url;
    });
  }
  fdatosPDF() {
    this._solicitudesService.datosPDF(this.buscar).subscribe(data => {
      const url = window.URL.createObjectURL(data);
      const a = document.createElement("a");
      a.setAttribute("style", "display:none;");
      document.body.appendChild(a);
      a.href = url;
      a.download = "datos.pdf";
      a.click();
      return url;
    });
  }

}
