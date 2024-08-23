import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { AccesoService } from 'src/app/_aods/acceso.service';
import { CargosService } from 'src/app/_aods/cargos.service';
import { RolesService } from 'src/app/_aods/roles.service';
import { Cargos } from 'src/app/_entidades/cargos';
import { Roles } from 'src/app/_entidades/roles';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-cargos',
  templateUrl: './cargos.component.html',
  styleUrls: ['./cargos.component.css']
})
export class CargosComponent implements OnInit {
  cargos: Cargos[];
  cargo: Cargos;
  rol: Roles[];

  pagina: number = 1;
  numPaginas: number = 0;
  cantidad: number = 10;
  buscar: string = '';
  total: number = 0;
  estado: string = '';

  formCargo: FormGroup;
  submitted: boolean = false;

  modalRefCargos: NgbModalRef;

  esadmin: boolean = false;
  essddpi: boolean = false;
  esdpeic: boolean = false;
  esreactivatic: boolean = false;

  esCargoTextil: boolean = false;
  esCargoArtesania: boolean = false;
  esCargoAlimento: boolean = false;
  esCargoTecnologia: boolean = false;
  esCargoEncargado: boolean = false;

  constructor(
    private _cargosService: CargosService,
    private _rolesService: RolesService,
    private _accesoService: AccesoService,
    private _fbC:FormBuilder,
    private _modalService: NgbModal
  ) { }

  ngOnInit(): void {
    this.formCargo = this._fbC.group({
      idrol: [''],
      cargo: ['']
    });
    this.fdatos();
    this.froles();
    this.esadmin = this._accesoService.esRolAdmin();
    this.essddpi = this._accesoService.esRolSddpi();
    this.esdpeic = this._accesoService.esRolDpeic();
    this.esreactivatic = this._accesoService.esRolReactivatic();

    this.esCargoTextil = this._accesoService.esCargoTextil();
    this.esCargoArtesania = this._accesoService.esCargoArtesania();
    this.esCargoAlimento = this._accesoService.esCargoAlimentos();
    this.esCargoTecnologia = this._accesoService.esCargoTecnologia();
    this.esCargoEncargado = this._accesoService.esCargoEncargado();
  }

  fdatos(){
    this._cargosService.datos(this.pagina, this.cantidad, this.buscar).subscribe((data) => {
      this.fcantidad();
      this.cargos = data;
    })
  }

  fbuscar() {
    this.pagina = 0;
    this.fdatos();
  }

  fcantidad() {
    this._cargosService.cantidad(this.buscar).subscribe((data) => {
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
  froles(){
    this.esadmin = this._accesoService.esRolAdmin();
    this.essddpi = this._accesoService.esRolSddpi();
    this.esdpeic = this._accesoService.esRolDpeic();
    this.esreactivatic = this._accesoService.esRolReactivatic();
    if (this.esadmin) {
      this._rolesService.listaradmin().subscribe((data) => {
        this.rol = data;
      })
    }
    if (this.essddpi) {
      this._rolesService.listarsddpi().subscribe((data) => {
        this.rol = data;
      })
    }
    if (this.esdpeic) {

    }
    if (this.esreactivatic) {
      this._rolesService.listarreactivatic().subscribe((data) => {
        this.rol = data;
      })
    }
  }

  fformCargo(cargo: Cargos, disabled: boolean = false){
    this.formCargo = this._fbC.group({
      idrol:[
        cargo.idrol,
        [
          Validators.required
        ]
      ],
      cargo:[
        cargo.cargo,
        [
          Validators.required,
          Validators.pattern('^[a-zA-ZÀ-ÿ\u00f1\u00d1\\s]+$'),
          Validators.minLength(5),
          Validators.maxLength(255)
        ]
      ]
    })
  }

  get f() { return this.formCargo.controls; }

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
        input = input.replace(/[^a-zA-Z0-9\u00f1\u00d1]/g, '');
        break;
      case 'direccion':
        input = input.replace(/[^a-zA-Z0-9\u00f1\u00d1\s.,#-]/g, '');
        break;
    }
    this.formCargo.get(controlName)?.setValue(input.toUpperCase(), { emitEvent: false });
  }

  getFormControls(): string[] {
    return Object.keys(this.formCargo.controls);
  }

  fadicionar(content: any){
    this.estado = 'Adicionar';
    this.cargo = new Cargos();
    this.fformCargo(this.cargo);
    this.modalRefCargos = this._modalService.open(content, {
      backdrop: 'static',
      keyboard: false
    });
  }

  fmodificar(id: number, content: any){
    this.estado = 'Modificar',
    this._cargosService.dato(id).subscribe((data) => {
      this.cargo = data;
      this.fformCargo(this.cargo);
      this.modalRefCargos = this._modalService.open(content, {
        backdrop: 'static',
        keyboard: false
      });
    });
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

  faceptar(){
    this.submitted = true;

    this.cargo.idrol = this.formCargo.value.idrol;
    this.cargo.cargo = this.formCargo.value.cargo;

    if (this.estado === 'Modificar') {
      this._cargosService.modificar(this.cargo).subscribe(data => {
        this.fdatos();
        this.modalRefCargos.dismiss();
        Swal.fire('Exito', 'Cargo modificado correctamente', 'success');
      });
    }else{
      this._cargosService.adicionar(this.cargo).subscribe(data => {
        this.fdatos();
        this.modalRefCargos.dismiss();
        Swal.fire('Exito', 'Cargo adicionado correctamente', 'success');
      });
    }
  }

  fcancelar(){
    this.modalRefCargos.dismiss();
  }
}
