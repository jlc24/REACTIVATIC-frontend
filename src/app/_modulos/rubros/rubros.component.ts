import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { RubrosService } from './../../_aods/rubros.service';
import { Rubros } from './../../_entidades/rubros';
import { Component, OnInit } from '@angular/core';
import swal from 'sweetalert2';
import { Subrubros } from 'src/app/_entidades/subrubros';
import { SubrubrosService } from 'src/app/_aods/subrubros.service';
import { AccesoService } from 'src/app/_aods/acceso.service';

@Component({
  selector: 'app-rubros',
  templateUrl: './rubros.component.html',
  styleUrls: ['./rubros.component.css']
})
export class RubrosComponent implements OnInit {

  datos: Rubros[];
  dato: Rubros;
  subrubros: Subrubros[];
  subrubro: Subrubros;

  pagina:number = 0;
  numPaginas:number = 0;
  cantidad:number = 10;
  buscar:string = '';
  total:number = 0;
  estado:string = '';

  formulario: FormGroup;
  formsubrubro: FormGroup;
  submitted:boolean = false;

  modalRefRubro: NgbModalRef;
  modalRefSubrubro: NgbModalRef;

  esCargoAdministrador: boolean = false;
  esCargoSecretario: boolean = false;
  esCargoDirector: boolean = false;
  esCargoApoyo: boolean = false;
  esCargoEncargado: boolean = false;
  esCargomonitoreo: boolean = false;
  esCargoTecnologia: boolean = false;
  esCargoMarketing: boolean = false;
  esCargoTextil: boolean = false;
  esCargoArtesania: boolean = false;
  esCargoAlimento: boolean = false;
  esCargoChofer: boolean = false;
  esCargoPasante: boolean = false;

  constructor(
    private _rubrosService: RubrosService,
    private _subrubrosService: SubrubrosService,
    private _accesoService: AccesoService,
    private _fb: FormBuilder,
    private _fbS: FormBuilder,
    private _modalService: NgbModal
  ) { }

  ngOnInit(): void {
    this.formulario = this._fb.group({
      rubro: [''],
    });
    this.formsubrubro = this._fbS.group({
      idrubro: [''],
      subrubro: ['']
    });
    this.fdatos();
    this.esCargoAdministrador = this._accesoService.esCargoAdministrador();
    this.esCargoSecretario = this._accesoService.esCargoSecretario();
    this.esCargoDirector = this._accesoService.esCargoDirector();
    this.esCargoApoyo = this._accesoService.esCargoApoyo();
    this.esCargoEncargado = this._accesoService.esCargoEncargado();
    this.esCargomonitoreo = this._accesoService.esCargoMonitoreo();
    this.esCargoTecnologia = this._accesoService.esCargoTecnologia();
    this.esCargoMarketing = this._accesoService.esCargoMarketing();
    this.esCargoTextil = this._accesoService.esCargoTextil();
    this.esCargoArtesania = this._accesoService.esCargoArtesania();
    this.esCargoAlimento = this._accesoService.esCargoAlimentos();
    this.esCargoChofer = this._accesoService.esCargoChofer();
  }

  fcantidad() {
    this._rubrosService.cantidad(this.buscar).subscribe((data) => {
      this.total = data;
    });
  }

  fbuscar() {
    this.pagina = 0;
    this.fdatos();
  }

  fdatos() {
    this._rubrosService.datos(this.pagina, this.cantidad, this.buscar).subscribe((data) => {
        this.fcantidad();
        this.datos = data;
      });
  }

  flistar(){
    this._rubrosService.datosl().subscribe((data) => {
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

  fformulario(dato: Rubros) {
    this.formulario = this._fb.group({
      rubro: [
        dato.rubro,
        [
          Validators.required,
          Validators.pattern('^[a-zA-ZÀ-ÿ\u00f1\u00d1\\s]+$'),
          Validators.minLength(5),
          Validators.maxLength(50)
        ]
      ],
    });
  }

  fformSubrubro(subrubro: Subrubros, disabled: boolean = false){
    this.formsubrubro = this._fbS.group({
      idrubro: [
        { value: subrubro.idrubro, disabled: disabled },
        [
          Validators.required
        ]
      ],
      subrubro:[
        subrubro.subrubro,
        [
          Validators.required,
          Validators.pattern('^[a-zA-ZÀ-ÿ\u00f1\u00d1\\s]+$'),
          Validators.minLength(5),
          Validators.maxLength(50)
        ]
      ]
    });
  }

  get f() { return this.formulario.controls; }
  get fS() { return this.formsubrubro.controls; }

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
    if (this.formulario.get(controlName)) {
      this.formulario.get(controlName)?.setValue(input.toUpperCase(), { emitEvent: false });
    }

    if (this.formsubrubro.get(controlName)) {
      this.formsubrubro.get(controlName)?.setValue(input.toUpperCase(), { emitEvent: false });
    }
  }

  fadicionar(content: any) {
    this.estado = 'Adicionar';
    this.dato = new Rubros();
    this.fformulario(this.dato);
    this.modalRefRubro = this._modalService.open(content, {
      backdrop: 'static',
      keyboard: false
    });
  }

  fmodificar(id: number, content: any) {
    this.estado = 'Modificar';
    this._rubrosService.dato(id).subscribe((data) => {
      this.dato = data;
      this.fformulario(this.dato);
      this.modalRefRubro = this._modalService.open(content,{
        backdrop: 'static',
        keyboard: false
      });
    });
  }

  feliminar(id: number){
    swal.fire({
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
        swal.fire('Error', 'Procedimiento NO autorizado, por favor contacte al administrador', 'error');
      }
    });
  }

  fsubrubros(id: number){
    this._subrubrosService.subrubros(id).subscribe((data) => {
      this.subrubros = data;
    });
  }

  fversubrubro(id: number, content: any){
    this.estado = 'Lista';
    this._rubrosService.dato(id).subscribe((data) => {
      this.dato = data;
      this.fsubrubros(id);
      this.modalRefRubro = this._modalService.open(content, {
        backdrop: 'static',
        keyboard: false,
        size: 'lg'
      });
    });
  }

  faddSubrubro(content: any, rubroSel: Rubros) {
    this.estado = 'Adicionar';
    this.subrubro = new Subrubros();
    this.subrubro.idrubro = rubroSel.idrubro;
    this.fformSubrubro(this.subrubro);
    this.modalRefSubrubro = this._modalService.open(content, {
      backdrop: 'static',
      keyboard: false
    });
  }

  fmodificarSub(id: number, content: any){
    this.estado = 'Modificar';
    this._subrubrosService.dato(id).subscribe((data) => {
      this.subrubro = data;
      this.fformSubrubro(this.subrubro);
      this.modalRefSubrubro = this._modalService.open(content, {
        backdrop: 'static',
        keyboard: false
      });
    });
  }

  faceptar(): void {
    this.submitted = true;
    this.dato.rubro = this.formulario.value.rubro.toUpperCase();
    if (this.estado === 'Modificar') {
      this._rubrosService.modificar(this.dato).subscribe((data) => {
        this.fdatos();
        this.modalRefRubro.dismiss();
        swal.fire('Dato modificado', 'Dato modificado con exito', 'success');
      });
    } else {
      this._rubrosService.adicionar(this.dato).subscribe((data) => {
        this.fdatos();
        this.modalRefRubro.dismiss();
        swal.fire('Dato adicionado', 'Dato modificado con exito', 'success');
      });
    }
  }

  faceptarSubrubro(): void{
    this.submitted = true;

    this.subrubro.idrubro = this.formsubrubro.value.idrubro;
    this.subrubro.subrubro = this.formsubrubro.value.subrubro;

    if (this.estado === 'Modificar') {
      this._subrubrosService.modificar(this.subrubro).subscribe((data) => {
        this.fsubrubros(this.formsubrubro.value.idrubro);
        this.modalRefSubrubro.dismiss();
        swal.fire('Dato modificado', 'Dato modificado con exito', 'success');
      });
    }else{
      this._subrubrosService.adicionar(this.subrubro).subscribe((data) => {
        this.fsubrubros(this.formsubrubro.value.idrubro);
        this.modalRefSubrubro.dismiss();
        swal.fire('Dato adicionado', 'Dato adicionado con exito', 'success');
      });
    }
  }

  fcancelar() {
    if (this.modalRefRubro) {
      this.modalRefRubro.dismiss();
    };
  }
  fcancelarSub() {
    if (this.modalRefSubrubro) {
      this.modalRefSubrubro.dismiss();
    };
  }

  fcambiarestado(idrubro: number, estado: boolean){
    swal.fire({
      title: !estado ? '¿Está seguro de deshabilitar?' : '¿Está seguro de habilitar?',
      icon: 'warning',
      text: !estado ? 'El rubro NO se podrá utilizar para registros.' : 'El rubro se podrá utilizar para registros.',
      showCancelButton: true,
      cancelButtonText: 'cancelar',
      confirmButtonText: 'Cambiar',
      customClass: {
        confirmButton: 'btn btn-success rounded-pill mr-3',
        cancelButton: 'btn btn-secondary rounded-pill',
      },
      buttonsStyling: false,
    }).then((result) => {
      if (result.value) {
        this._rubrosService.cambiarestado({ idrubro, estado }).subscribe( response => {
          this.fdatos();
          swal.fire('Cambio realizado', 'El estado del rubro ha sido cambiado con éxito.', 'success');
        });
      }
    });
  }
}
