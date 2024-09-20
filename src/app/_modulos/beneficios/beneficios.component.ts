import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { AccesoService } from 'src/app/_aods/acceso.service';
import { BeneficiosService } from 'src/app/_aods/beneficios.service';
import { MunicipiosService } from 'src/app/_aods/municipios.service';
import { TiposbeneficiosService } from 'src/app/_aods/tiposbeneficios.service';
import { UsuariosService } from 'src/app/_aods/usuarios.service';
import { Beneficios } from 'src/app/_entidades/beneficios';
import { Municipios } from 'src/app/_entidades/municipios';
import { Tiposbeneficios } from 'src/app/_entidades/tiposbeneficios';
import { Usuarios } from 'src/app/_entidades/usuarios';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-beneficios',
  templateUrl: './beneficios.component.html',
  styleUrls: ['./beneficios.component.css']
})
export class BeneficiosComponent implements OnInit {

  beneficios: Beneficios[];
  beneficio: Beneficios;
  tiposbeneficios: Tiposbeneficios[];
  municipios: Municipios[];
  capacitadores: Usuarios[];
  rol: string = '';

  pagina: number = 1;
  numPaginas: number = 0;
  cantidad: number = 10;
  buscar: string = '';
  total: number = 0;
  estado: string = '';

  formulario: FormGroup;
  submitted: boolean = false;

  modalRefBeneficio: NgbModalRef;

  esadmin: boolean = false;
  essddpi: boolean = false;
  esdpeic: boolean = false;
  esreactivatic: boolean = false;

  esCargoTextil: boolean = false;
  esCargoArtesania: boolean = false;
  esCargoAlimento: boolean = false;
  esCargoTecnologia: boolean = false;
  esCargoEncargado: boolean = false;
  esCargoMarketing: boolean = false;
  esCapacitador: boolean = false;

  constructor(
    private _accesoService: AccesoService,
    private _beneficiosService: BeneficiosService,
    private _tiposbeneficiosService: TiposbeneficiosService,
    private _municipiosService: MunicipiosService,
    private _usuariosService: UsuariosService,
    private _fB: FormBuilder,
    private _modalService: NgbModal,
    private _toast: ToastrService
  ) { }

  ngOnInit(): void {
    this.fdatos();

    this.ftiposbeneficios();
    this.fmunicipios();
    this.fcapacitadores();

    this.esadmin = this._accesoService.esRolAdmin();
    this.essddpi = this._accesoService.esRolSddpi();
    this.esdpeic = this._accesoService.esRolDpeic();
    this.esreactivatic = this._accesoService.esRolReactivatic();

    this.esCargoTextil = this._accesoService.esCargoTextil();
    this.esCargoArtesania = this._accesoService.esCargoArtesania();
    this.esCargoAlimento = this._accesoService.esCargoAlimentos();
    this.esCargoTecnologia = this._accesoService.esCargoTecnologia();
    this.esCargoEncargado = this._accesoService.esCargoEncargado();
    this.esCargoMarketing = this._accesoService.esCargoMarketing();
    this.esCapacitador = this._accesoService.esCargoCapacitador();
  }

  ftiposbeneficios(){
    this._tiposbeneficiosService.listar().subscribe((data) => {
      this.tiposbeneficios = data;
    })
  }

  fmunicipios(){
    this._municipiosService.datosl().subscribe((data) => {
      this.municipios = data;
    })
  }

  fcapacitadores(){
    this._usuariosService.lista().subscribe((data) => {
      this.capacitadores = data;
    })
  }

  fdatos(){
    this.esadmin = this._accesoService.esRolAdmin();
    this.essddpi = this._accesoService.esRolSddpi();
    this.esdpeic = this._accesoService.esRolDpeic();
    this.esCargoTecnologia = this._accesoService.esCargoTecnologia();
    this.esCargoEncargado = this._accesoService.esCargoEncargado();
    this.esCargoMarketing = this._accesoService.esCargoMarketing();
    this.esreactivatic = this._accesoService.esRolReactivatic();
    this.esCapacitador = this._accesoService.esCargoCapacitador();

    if (this.esadmin || this.essddpi || this.esdpeic || this.esCargoTecnologia || this.esCargoMarketing) {
      this.rol = 'admin';
    }else{
      this.rol = '';
    }

    this._beneficiosService.datos(this.pagina, this.cantidad, this.buscar, this.rol).subscribe((data) => {
      this.fcantidad();
      this.beneficios = data;
    })
  }

  fbuscar() {
    this.pagina = 0;
    this.fdatos();
  }

  fcantidad() {
    this.esadmin = this._accesoService.esRolAdmin();
    this.essddpi = this._accesoService.esRolSddpi();
    this.esdpeic = this._accesoService.esRolDpeic();
    this.esCargoTecnologia = this._accesoService.esCargoTecnologia();
    this.esCargoEncargado = this._accesoService.esCargoEncargado();
    this.esCargoMarketing = this._accesoService.esCargoMarketing();
    this.esreactivatic = this._accesoService.esRolReactivatic();
    this.esCapacitador = this._accesoService.esCargoCapacitador();

    if (this.esadmin || this.essddpi || this.esdpeic || this.esCargoTecnologia || this.esCargoMarketing) {
      this.rol = 'admin';
    }else{
      this.rol = '';
    }
    this._beneficiosService.cantidad(this.buscar, this.rol).subscribe((data) => {
      this.total = data;
    });
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

  fformulario(beneficio: Beneficios, disabled: boolean = false){
    this.formulario = this._fB.group({
      beneficio: [
        beneficio.beneficio,
        [
          Validators.required,
          Validators.pattern('^[a-zA-Z0-9\u00f1\u00d1\\s.,-]+$'),
          Validators.minLength(5),
          Validators.maxLength(150)
        ]
      ],
      descripcion:[
        beneficio.descripcion,
        [
          Validators.pattern('^[a-zA-Z0-9\u00f1\u00d1\\s.,#-]+$'),
          Validators.maxLength(255)
        ]
      ],
      idtipobeneficio:[
        beneficio.tipobeneficio?.idtipobeneficio,
        [
          Validators.required,
        ]
      ],
      idmunicipio: [
        beneficio.municipio?.idmunicipio,
        [
          Validators.required
        ]
      ],
      direccion:[
        beneficio.direccion,
        [
          Validators.required,
          Validators.pattern('^[a-zA-Z0-9\u00f1\u00d1\\s.,#-]+$'),
        ]
      ],
      fechainicio:[
        beneficio.fechainicio,
        [
          Validators.required
        ]
      ],
      fechafin: [
        beneficio.fechafin,
        [
          Validators.required
        ]
      ],
      idcapacitador:[
        beneficio.capacitador?.idusuario
      ],
      capacidad:[
        beneficio.capacidad,
        [
          Validators.required,
          Validators.pattern('^[0-9]+$'),
          Validators.minLength(1),
          Validators.maxLength(4)
        ]
      ],
    });
  }

  get f() { return this.formulario.controls; }

  onInput(event: any, controlName: string, type: 'letras' | 'letrasyespacios' | 'numeros' | 'letrasynumerosguion' | 'direccion'): void {
    let input = event.target.value;
    switch (type) {
      case 'letras':
        input = input.replace(/[^a-zA-ZÀ-ÿ\u00f1\u00d1_]/g, '');
        break;
      case 'letrasyespacios':
        input = input.replace(/[^a-zA-ZÀ-ÿ\u00f1\u00d1\s]/g, '');
        break;
      case 'numeros':
        input = input.replace(/[^0-9]/g, '');
        break;
      case 'letrasynumerosguion':
        input = input.replace(/[^a-zA-Z0-9\u00f1\u00d1\s.,-]/g, '');
        break;
      case 'direccion':
        input = input.replace(/[^a-zA-Z0-9\u00f1\u00d1\s.,#-]/g, '');
        break;
    }
    this.formulario.get(controlName)?.setValue(input.toUpperCase(), { emitEvent: false });
  }

  getFormControls(): string[] {
    return Object.keys(this.formulario.controls);
  }

  fadicionar(content: any){
    this.estado = 'Adicionar';
    this.beneficio = new Beneficios();
    this.fformulario(this.beneficio);
    this.modalRefBeneficio = this._modalService.open(content, {
      backdrop: 'static',
      keyboard: false,
      scrollable: true
    });
  }

  fmodificar(id: number, content: any){
    this.estado = 'Modificar';
    this._beneficiosService.dato(id).subscribe((data) => {
      this.beneficio = data;
      this.fformulario(this.beneficio);
      this.modalRefBeneficio = this._modalService.open(content, {
        backdrop: 'static',
        keyboard: false
      });
    });
  }

  fver(id: number, content: any){
    this.estado = 'Ver';
    this._beneficiosService.dato(id).subscribe((data) => {
      this.beneficio = data;
      this.fformulario(this.beneficio);
      this.modalRefBeneficio = this._modalService.open(content, {
        backdrop: 'static',
        keyboard: false
      });
    });
  }

  faceptar(){
    this.submitted = true;

    this.beneficio.beneficio = this.formulario.value.beneficio;
    this.beneficio.descripcion = this.formulario.value.descripcion;
    this.beneficio.idtipobeneficio = this.formulario.value.idtipobeneficio;
    this.beneficio.idmunicipio = this.formulario.value.idmunicipio;
    this.beneficio.direccion = this.formulario.value.direccion;
    this.beneficio.fechainicio = this.formulario.value.fechainicio;
    this.beneficio.fechafin = this.formulario.value.fechafin;
    this.beneficio.idcapacitador = this.formulario.value.idcapacitador;
    this.beneficio.capacidad = this.formulario.value.capacidad;

    if (this.estado === 'Modificar') {
      this._beneficiosService.modificar(this.beneficio).subscribe((data) => {
        this.fdatos();
        this.modalRefBeneficio.dismiss();
        Swal.fire('Exito', 'Beneficio modificado correctamente', 'success');
        this._toast.success('','Operación exitosa')
      });
    }else{
      this._beneficiosService.adicionar(this.beneficio).subscribe(data => {
        this.fdatos();
        this.modalRefBeneficio.dismiss();
        Swal.fire('Exito', 'Beneficio adicionado correctamente', 'success');
        this._toast.success('','Operación exitosa')
      })
    }
  }

  fcancelar(){
    this.modalRefBeneficio.dismiss();
  }
}
