import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AsociacionesService } from 'src/app/_aods/asociaciones.service';
import { Asociaciones } from 'src/app/_entidades/asociaciones';
import swal from 'sweetalert2';

@Component({
  selector: 'app-asociaciones',
  templateUrl: './asociaciones.component.html',
  styleUrls: ['./asociaciones.component.css']
})
export class AsociacionesComponent implements OnInit {

  datos: Asociaciones[];
  dato: Asociaciones;

  pagina:number = 0;
  numPaginas:number = 0;
  cantidad:number = 10;
  buscar:string = '';
  total:number = 0;
  estado:string = '';

  formulario: FormGroup;
  submitted:boolean = false;


  constructor(
    private _asociacionesService: AsociacionesService,
    private _fb: FormBuilder,
    private _modalService: NgbModal
  ) { }

  ngOnInit(): void {
    this.fdatos();
  }

  fcantidad() {
    this._asociacionesService.cantidad(this.buscar).subscribe((data) => {
      this.total = data;
    });
  }

  fbuscar() {
    this.pagina = 0;
    this.fdatos();
  }

  fdatos() {
    this._asociacionesService.datos(this.pagina, this.cantidad, this.buscar).subscribe((data) => {
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

  fformulario(dato: Asociaciones) {
    this.formulario = this._fb.group({
      asociacion: [dato.asociacion, [Validators.required]],
      descripcion: [dato.descripcion, [Validators.required]],
      fechacreacion: [dato.fechacreacion, [Validators.required]],
      representantelegal: [dato.representantelegal, [Validators.required, Validators.pattern('[a-zA-Z .]*')]],
      direccion: [dato.direccion, [Validators.required]],
      telefono: [dato.telefono, [Validators.required, Validators.pattern('[0-9]*')]],
      celular: [dato.celular, [Validators.required, Validators.pattern('[0-9]*')]],
      correo: [dato.correo, [Validators.required, Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$')]],
    });
  }

  get f() { return this.formulario.controls; }

  fadicionar(content: any) {
    this.estado = 'Adicionar';
    this.dato = new Asociaciones();
    this.fformulario(this.dato);
    this._modalService.open(content);
  }

  fmodificar(id: number, content: any) {
    this.estado = 'Modificar';
    this._asociacionesService.dato(id).subscribe((data) => {
      this.dato = data;
      this.fformulario(this.dato);
      this._modalService.open(content);
    });
  }

  faceptar(): void {
    this.submitted = true;
    this.dato.asociacion = this.formulario.value.asociacion.toUpperCase();
    this.dato.descripcion = this.formulario.value.descripcion.toUpperCase();
    this.dato.fechacreacion = this.formulario.value.fechacreacion;
    this.dato.representantelegal = this.formulario.value.representantelegal.toUpperCase();
    this.dato.direccion = this.formulario.value.direccion.toUpperCase();
    this.dato.telefono = this.formulario.value.telefono;
    this.dato.celular = this.formulario.value.celular;
    this.dato.correo = this.formulario.value.correo;
    if (this.estado === 'Modificar') {
      this._asociacionesService.modificar(this.dato).subscribe((data) => {
        this.fdatos();
        this._modalService.dismissAll();
        swal.fire('Dato modificado', 'Dato modificado con exito', 'success');
      });
    } else {
      this._asociacionesService.adicionar(this.dato).subscribe((data) => {
        this.fdatos();
        this._modalService.dismissAll();
        swal.fire('Dato adicionado', 'Dato modificado con exito', 'success');
      });
    }

  }

  fcancelar() {
    this._modalService.dismissAll();
  }


}
