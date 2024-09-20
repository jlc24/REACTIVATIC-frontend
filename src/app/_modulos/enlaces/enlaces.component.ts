import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { CategoriasService } from 'src/app/_aods/categorias.service';
import { EnlacesService } from 'src/app/_aods/enlaces.service';
import { RUTA } from 'src/app/_config/application';
import { Categorias } from 'src/app/_entidades/categorias';
import { Enlaces } from 'src/app/_entidades/enlaces';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-enlaces',
  templateUrl: './enlaces.component.html',
  styleUrls: ['./enlaces.component.css']
})
export class EnlacesComponent implements OnInit {

  ruta: string = '';

  enlaces: Enlaces[];
  enlace: Enlaces;
  currentPage: number = 1;
  pageSize: number = 10;

  categorias: Categorias[];
  categoria: Categorias;

  pagina:number = 1;
  numPaginas:number = 0;
  cantidad:number = 10;
  buscar:string = '';
  total:number = 0;
  estado:string = '';

  formulario: FormGroup;
  submitted: boolean = false;
  modalRefEnlace: NgbModalRef;

  constructor(
    private _enlaceService: EnlacesService,
    private _categoriaService: CategoriasService,
    private _fb: FormBuilder,
    private _modalService: NgbModal
  ) { }

  ngOnInit(): void {
    this.formulario = this._fb.group({
      enlace: [''],
      ruta: [''],
      iconoenlace: [''],
      orden: ['']
    });
    this.fdatos();
    this.fcategorias();
  }

  fbuscar() {
    this.pagina = 0;
    this.fdatos();
  }

  fcantidad() {
    this._enlaceService.cantidad(this.buscar).subscribe((data) => {
      this.total = data;
    });
  }

  fdatos(){
    this._enlaceService.datos(this.pagina, this.cantidad, this.buscar).subscribe((data) => {
      this.fcantidad();
      this.enlaces = data;
    })
  }

  fcategorias(){
    this._categoriaService.listar().subscribe((data) => {
      this.categorias = data;
    })
  }

  limpiar() {
    this.pagina = 0;
    this.buscar = '';
    this.fdatos();
  }

  mostrarMas(evento: any){
    this.pagina = evento;
    this.fdatos();
  }

  fformulario(enlace: Enlaces, disabled: boolean = false){
    this.formulario = this._fb.group({
      idcategoria: [
        enlace.idcategoria,
        [
          Validators.required
        ]
      ],
      enlace: [
        enlace.enlace,
        [
          Validators.required,
          Validators.pattern('^[a-zA-ZÀ-ÿ\u00f1\u00d1\\s]+$'),
          Validators.minLength(3),
          Validators.maxLength(50)
        ]
      ],
      ruta: [
        enlace.ruta,
        [
          Validators.required,
          Validators.pattern('^[a-zA-Z\\s/]+$'),
          Validators.minLength(3),
          Validators.maxLength(50)
        ]
      ],
      iconoenlace: [
        'fa fa-arrow-right',
        [
          Validators.required,
          Validators.pattern('^[a-z\\s-]+$'),
          Validators.minLength(8),
          Validators.maxLength(50)
        ]
      ],
      orden: [
        enlace.orden,
        [
          Validators.required,
          Validators.pattern('^[0-9]+$'),
          Validators.minLength(2),
          Validators.maxLength(3)
        ]
      ]
    });
  }

  get f(){
    return this.formulario.controls;
  }

  onInput(event: any, controlName: string, type: 'letras' | 'letrasyespacios' | 'numeros' | 'letrasyespacioguion' | 'division' ): void {
    let input = event.target.value;
    switch (type) {
      case 'letras':
        input = input.replace(/[^a-zA-ZÀ-ÿ\u00f1\u00d1]/g, '');
        break;
      case 'letrasyespacios':
        input = input.replace(/[^a-zA-ZÀ-ÿ\u00f1\u00d1\s]/g, '');
        break;
      case 'numeros':
        input = input.replace(/[^0-9]/g, '');
        break;
      case 'letrasyespacioguion':
        input = input.replace(/[^a-z\s\-]/g, '');
        break;
      case 'division':
        input = input.replace(/[^a-z/]/g, '');
        break;
    }
    // this.formulario.get(controlName)?.setValue(input, { emitEvent: false });
    // this.formEnlace.get(controlName)?.setValue(input, { emitEvent: false });
    if (this.formulario.get(controlName)) {
      this.formulario.get(controlName)?.setValue(input, { emitEvent: false });
    }
  }

  fadicionar(content: any){
    this.estado = 'Adicionar';
    this.enlace = new Enlaces();
    this.fformulario(this.enlace, true);
    this.modalRefEnlace = this._modalService.open(content, { backdrop: 'static', keyboard: false });
  }

  fmodificar(id: number, content: any){
    this.estado = 'Modificar';
    this._enlaceService.dato(id).subscribe((data) => {
      this.enlace = data;
      this.fformulario(this.enlace, true);
      this.modalRefEnlace = this._modalService.open(content, { backdrop: 'static', keyboard: false });
    })
  }

  fver(id: number, content: any){

  }

  feliminar(id: number){
    Swal.fire({
        title: 'Estás seguro?',
        icon: 'warning',
        text: 'No podrás revertir el borrado de este dato!',
        showCancelButton: true,
        cancelButtonText: 'Cancelar',
        confirmButtonText: 'Borrar',
        customClass: {
          confirmButton: 'btn btn-success rounded-pill mr-3',
          cancelButton: 'btn btn-secondary rounded-pill',
        },
        buttonsStyling: false,
      })
      .then((result) => {
        if (result.value) {
          Swal.fire('Error', 'Procedimiento NO autorizado, por favor contacte al administrador', 'error');
        }
      });
  }

  fcambiarestado(id: number, estado: boolean){

  }

  faceptar(): void{
    this.submitted = true;
    this.enlace.idcategoria = this.formulario.value.idcategoria;
    this.enlace.enlace = this.formulario.value.enlace;
    this.enlace.ruta = this.formulario.value.ruta;
    this.enlace.iconoenlace = this.formulario.value.iconoenlace;
    this.enlace.orden = this.formulario.value.orden;

    if (this.estado === 'Modificar') {
      this._enlaceService.modificar(this.enlace).subscribe((data) => {
        this.fdatos();
        this.modalRefEnlace.dismiss();
        Swal.fire('Dato Modificado', 'Enlace modificado con éxito', 'success');
      })
    }else{
      this._enlaceService.adicionar(this.enlace).subscribe((data) => {
        this.fdatos();
        this.modalRefEnlace.dismiss();
        Swal.fire('Dato Adicionado', 'Enlace registrado con éxito', 'success');
      })
    }
  }

  fcancelar(){
    if (this.modalRefEnlace) {
      this.modalRefEnlace.dismiss();
    }
  }
}
