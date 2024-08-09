import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal, NgbModalConfig, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { AccesoService } from 'src/app/_aods/acceso.service';
import { CategoriasService } from 'src/app/_aods/categorias.service';
import { EnlacesService } from 'src/app/_aods/enlaces.service';
import { Categorias } from 'src/app/_entidades/categorias';
import { Enlaces } from 'src/app/_entidades/enlaces';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-categoria',
  templateUrl: './categoria.component.html',
  styleUrls: ['./categoria.component.css']
})
export class CategoriaComponent implements OnInit {
  categorias: Categorias[];
  categoria: Categorias;
  enlaces: Enlaces[];
  enlace: Enlaces;

  pagina: number = 1;
  numPaginas: number = 0;
  cantidad: number = 10;
  buscar: string = '';
  total: number = 0;
  estado: string = '';

  formulario: FormGroup;
  formEnlace: FormGroup;
  submitted: boolean = false;

  esadmin: boolean = false;
  essddpi: boolean = false;
  esreactivatic: boolean = false;

  modalRefCategoria: NgbModalRef;
  modalRefEnlace: NgbModalRef;

  constructor(
    private _categriasService: CategoriasService,
    private _enlacesService: EnlacesService,
    private _accesoService: AccesoService,
    private _fb: FormBuilder,
    private _fbe: FormBuilder,
    private _modalService: NgbModal,
    private _mensajes: ToastrService,
  ) { }

  ngOnInit(): void {
    this.formulario = this._fb.group({
      categoria: [''],
      ruta: [''],
      iconocategoria: [''],
      orden: ['']
    });

    this.formEnlace = this._fbe.group({
      enlace: [''],
      ruta: [''],
      iconoenlace: [''],
      orden: ['']
    });
    this.fdatos();
    this.esadmin = this._accesoService.esRolAdmin();
    this.essddpi = this._accesoService.esRolSddpi();
    this.esreactivatic = this._accesoService.esRolReactivatic();
  }

  fbuscar() {
    this.pagina = 0;
    this.fdatos();
  }

  fcantidad() {
    this._categriasService.cantidad(this.buscar).subscribe((data) => {
      this.total = data;
    });
  }

  fdatos(){
    this._categriasService.datos(this.pagina, this.cantidad, this.buscar).subscribe((data) => {
      this.fcantidad();
      this.categorias = data;
    })
  }
  flistar(){
    this._categriasService.listar().subscribe((data) => {
      this.categorias = data;
    })
  }

  fdatosenlaces(id: number){
    this._enlacesService.listar(id).subscribe((data) => {
      this.enlaces = data;
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

  fformulario(categoria: Categorias, disabled: boolean = false){
    this.formulario = this._fb.group({
      categoria: [
        categoria.categoria,
        [
          Validators.required,
          Validators.pattern('^[a-zA-ZÀ-ÿ\u00f1\u00d1\\s]+$'),
          Validators.minLength(5),
          Validators.maxLength(50)
        ]
      ],
      ruta: [
        categoria.ruta,
        [
          Validators.required,
          Validators.pattern('^/$'),
        ]
      ],
      iconocategoria: [
        categoria.iconocategoria,
        [
          Validators.required,
          Validators.pattern('^[a-z\\s\-]*$'),
          Validators.minLength(7),
          Validators.maxLength(50)
        ]
      ],
      orden: [
        categoria.orden,
        [
          Validators.required,
          Validators.pattern('^[0-9]*$'),
          Validators.minLength(2),
          Validators.maxLength(3),
        ]
      ]
    });
  }

  fformEnlace(enlace: Enlaces, disabled:boolean = false){
    this.formEnlace = this._fbe.group({
      idcategoria: [
        { value: enlace.idcategoria, disabled: disabled },
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
        enlace.iconoenlace,
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
  get fe(){
    return this.formEnlace.controls;
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
        input = input.replace(/[^/]/g, '');
        break;
    }
    // this.formulario.get(controlName)?.setValue(input, { emitEvent: false });
    // this.formEnlace.get(controlName)?.setValue(input, { emitEvent: false });
    if (this.formulario.get(controlName)) {
      this.formulario.get(controlName)?.setValue(input, { emitEvent: false });
    }

    if (this.formEnlace.get(controlName)) {
      this.formEnlace.get(controlName)?.setValue(input, { emitEvent: false });
    }
  }

  fadicionar(content: any) {
    this.estado = 'Adicionar';
    this.categoria = new Categorias();
    this.fformulario(this.categoria);
    this.modalRefCategoria = this._modalService.open(content, { backdrop: 'static', keyboard: false });
  }

  fadicionarEnlace(content: any, categoriaSel: Categorias) {
    this.estado = 'Adicionar';
    this.enlace = new Enlaces();
    this.enlace.idcategoria = categoriaSel.idcategoria;
    this.fformEnlace(this.enlace, true);
    this.modalRefEnlace = this._modalService.open(content, { backdrop: 'static', keyboard: false });
  }

  fmodificar(id: number, content: any){
    this.estado = 'Modificar';
    this._categriasService.dato(id).subscribe((data) => {
      this.categoria = data;
      this.fformulario(this.categoria, true);
      this.modalRefCategoria = this._modalService.open(content, { backdrop: 'static', keyboard: false });
    })
  }

  fmodificarEnlace(id: number, content: any){
    this.estado = 'Modificar';
    this._enlacesService.dato(id).subscribe((data) => {
      this.enlace = data;
      this.fformEnlace(this.enlace, true);
      this.modalRefEnlace = this._modalService.open(content, { backdrop: 'static', keyboard: false });
    })
  }

  fver(id: number, content: any){
    this.estado = 'Ver';
    this._categriasService.dato(id).subscribe((data) => {
      this.categoria = data;
      this.fdatosenlaces(id);
      this.modalRefCategoria = this._modalService.open(content, { backdrop: 'static', keyboard: false, size: 'lg'});
    })
  }

  feliminar(id: number){
    Swal.fire({
        title: 'Estás seguro?',
        icon: 'warning',
        text: 'No podrás revertir el borrado de este dato!',
        showCancelButton: true,
        cancelButtonText: 'Cancelar',
        confirmButtonText: 'Borrar',
      })
      .then((result) => {
        if (result.value) {
          Swal.fire('Error', 'Procedimiento NO autorizado, por favor contacte al administrador', 'error');
        }
      });
  }
  feliminarEnlace(id: number){
    Swal.fire({
        title: 'Estás seguro?',
        icon: 'warning',
        text: 'No podrás revertir el borrado de este dato!',
        showCancelButton: true,
        cancelButtonText: 'Cancelar',
        confirmButtonText: 'Borrar',
      })
      .then((result) => {
        if (result.value) {
          Swal.fire('Error', 'Procedimiento NO autorizado, por favor contacte al administrador', 'error');
        }
      });
  }

  fcambiarestado(id: number, estado: boolean){

  }

  faceptar(): void {
    function toUpdateCaseDefined(value: string | undefined): string {
      return value ? value.toUpperCase() : '';
    }

    this.submitted = true;
    this.categoria.categoria = this.formulario.value.categoria;
    this.categoria.ruta = this.formulario.value.ruta;
    this.categoria.iconocategoria = this.formulario.value.iconocategoria;
    this.categoria.orden = this.formulario.value.orden;

    if (this.estado === 'Modificar') {
      this._categriasService.modificar(this.categoria).subscribe((data) => {
        this.fdatos();
        this._modalService.dismissAll();
        Swal.fire('Dato Modificado', 'Categoría modificada con éxito', 'success');
      });
    }else{
      this._categriasService.adicionar(this.categoria).subscribe((data) => {
        this.fdatos();
        this._modalService.dismissAll();
        Swal.fire('Dato aAicionado', 'Categoría registrada con éxito', 'success');
      });
    }
  }

  faceptarEnlace(): void{
    this.submitted = true;
    this.enlace.idcategoria = this.formEnlace.value.idcategoria;
    this.enlace.enlace = this.formEnlace.value.enlace;
    this.enlace.ruta = this.formEnlace.value.ruta;
    this.enlace.iconoenlace = this.formEnlace.value.iconoenlace;
    this.enlace.orden = this.formEnlace.value.orden;

    if (this.estado === 'Modificar') {
      this._enlacesService.modificar(this.enlace).subscribe((data) => {
        this.fdatosenlaces(this.formulario.value.idcategoria);
        this.modalRefEnlace.dismiss();
        Swal.fire('Dato Modificado', 'Enlace modificado con éxito', 'success');
      });
    }else{
      this._enlacesService.adicionar(this.enlace).subscribe((data) => {
        this.fdatosenlaces(this.formEnlace.value.idcategoria)
        this.modalRefEnlace.dismiss();
        Swal.fire('Dato Adicionado', 'Enlace registrado con éxito', 'success');
      });
    }
  }

  fcancelar() {
    if (this.modalRefCategoria) {
      this.modalRefCategoria.dismiss();
    }
    // this._modalService.dismissAll();
  }
  fcancelarEnlace() {
    if (this.modalRefEnlace) {
      this.modalRefEnlace.dismiss();
    }
    // this._modalService.dismissAll();
  }
}
