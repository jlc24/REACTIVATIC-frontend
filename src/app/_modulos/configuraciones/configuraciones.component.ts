import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ParametrosService } from './../../_aods/parametros.service';
import { Component, OnInit } from '@angular/core';
import { Parametros } from 'src/app/_entidades/parametros';
import swal from 'sweetalert2';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-configuraciones',
  templateUrl: './configuraciones.component.html',
  styleUrls: ['./configuraciones.component.css'],
})
export class ConfiguracionesComponent implements OnInit {
  formulario: FormGroup;
  submitted:boolean = false;
  datos: Parametros[];
  dato: Parametros;

  pagina:number = 0;
  numPaginas:number = 0;
  cantidad:number = 0;
  buscar:string = '';
  total:number = 0;
  estado:string = '';

  constructor(
    private _parametrosService: ParametrosService,
    private _fb: FormBuilder,
    private _modalService: NgbModal
  ) {}

  ngOnInit(): void {
    this.fparametrocantidad();
  }

  fparametrocantidad(){
    this._parametrosService.parametroi('cantidad').subscribe( data => {
      this.cantidad = data
      this.fdatos();
    });
  }

  fcantidad() {
    this._parametrosService.cantidad(this.buscar).subscribe((data) => {
      this.total = data;
    });
  }

  fbuscar() {
    this.pagina = 0;
    this.fcantidad();
    this.fdatos();
  }

  fdatos() {
    this._parametrosService
      .datos(this.pagina, this.cantidad, this.buscar)
      .subscribe((data) => {
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

  fformulario(dato: Parametros) {
    this.formulario = this._fb.group({
      valor: [
        dato.valor,
        [
          Validators.required,
          Validators.pattern('[0-9]*'),
          Validators.min(0)
        ],
      ],
    });
  }

  get f() { return this.formulario.controls; }

  fmodificar(id: number, content: any) {
    this.estado = 'Actualizar';
    this._parametrosService.dato(id).subscribe((data) => {
      this.dato = data;
      this.fformulario(this.dato);
      this._modalService.open(content);
    });
  }

  faceptar(): void {
    this.submitted = true;
    this.dato.valor = this.formulario.value.valor;
    this._parametrosService.modificar(this.dato).subscribe((data) => {
      this.fdatos();
      this._modalService.dismissAll();
      swal.fire('Dato modificado', 'Dato modificado con exito', 'success');
    });
  }

  fcancelar() {
    this._modalService.dismissAll();
  }
}
