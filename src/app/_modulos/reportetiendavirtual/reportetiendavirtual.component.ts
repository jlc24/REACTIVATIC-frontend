import { Component, OnInit } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { EmpresasService } from 'src/app/_aods/empresas.service';
import { ProductosService } from 'src/app/_aods/productos.service';
import { Empresas } from 'src/app/_entidades/empresas';
import { Productos } from 'src/app/_entidades/productos';

@Component({
  selector: 'app-reportetiendavirtual',
  templateUrl: './reportetiendavirtual.component.html',
  styleUrls: ['./reportetiendavirtual.component.css']
})
export class ReportetiendavirtualComponent implements OnInit {

  empresas: Empresas[];
  empresa: Empresas;
  productos: Productos[];

  pagina: number = 0;
  numPaginas: number = 0;
  cantidad: number = 10;
  buscar: string = '';
  total: number = 0;
  estado: string = '';

  modalRefVer: NgbModalRef;

  constructor(
    private _empresasService: EmpresasService,
    private _productosService: ProductosService,
    private _modalService: NgbModal,
    private _toast: ToastrService,
  ) { }

  ngOnInit(): void {
    this.fdatos();
  }

  fcantidad() {
    this._empresasService.cantidadtienda(this.buscar).subscribe((data) => {
      this.total = data;
    });
  }

  fbuscar() {
    this.pagina = 0;
    this.fdatos();
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

  fdatos(){
    this._empresasService.enTienda(this.pagina, this.cantidad, this.buscar).subscribe(data => {
      this.fcantidad();
      this.empresas = data;
    });
  }

  fver(id: number, content: any){
    this.estado = 'Ver';
    this._productosService.productos(id).subscribe(data => {
      this.productos = data;
      this.modalRefVer = this._modalService.open(content, {
        backdrop: 'static',
        keyboard: false,
        size: 'lg',
        scrollable: true
      });
    });
  }

  fcancelar(){
    this.modalRefVer.dismiss();
  }

  fdatosTiendaXLS(){
    this._empresasService.datosTiendaXLS().subscribe(
      blob => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.setAttribute("style", "display:none;");
        document.body.appendChild(a);
        a.href = url;
        a.download = "Registro_UP_Tienda Virtual.xlsx";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
        return url;
      }, error => {
        this._toast.error('Error al descargar el archivo', 'Error');
      }
    );
  }

}
