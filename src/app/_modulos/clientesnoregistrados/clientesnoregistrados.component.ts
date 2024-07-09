import { Component, OnInit } from '@angular/core';
import { SeguimientoService } from 'src/app/_aods/seguimiento.service';
import { Carritos } from 'src/app/_entidades/carritos';

@Component({
  selector: 'app-clientesnoregistrados',
  templateUrl: './clientesnoregistrados.component.html',
  styleUrls: ['./clientesnoregistrados.component.css']
})
export class ClientesnoregistradosComponent implements OnInit {

  datos: Carritos[];
  dato: Carritos;

  pagina:number = 0;
  numPaginas:number = 0;
  cantidad:number = 10;
  buscar:string = '';
  total:number = 0;
  estado:string = '';

  constructor(
    private _seguimientoService: SeguimientoService,
  ) { }

  ngOnInit(): void {
    this.fdatos();
  }

  fcantidad() {
    this._seguimientoService.cantidad(this.buscar).subscribe((data) => {
      this.total = data;
    });
  }

  fbuscar() {
    this.pagina = 0;
    this.fdatos();
  }

  fdatos() {
    this._seguimientoService.datos(this.pagina, this.cantidad, this.buscar).subscribe((data) => {
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
    this._seguimientoService.datosXLS(this.buscar).subscribe(data => {
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
    this._seguimientoService.datosPDF(this.buscar).subscribe(data => {
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
