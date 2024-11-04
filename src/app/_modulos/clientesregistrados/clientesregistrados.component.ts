import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Solicitudes } from './../../_entidades/solicitudes';
import { Component, OnInit } from '@angular/core';
import { ClientesService } from 'src/app/_aods/clientes.service';
import { SolicitudesService } from 'src/app/_aods/solicitudes.service';
import { Clientes } from 'src/app/_entidades/clientes';
import { Usuarios } from 'src/app/_entidades/usuarios';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Personas } from 'src/app/_entidades/personas';
import { Roles } from 'src/app/_entidades/roles';
import { UtilsService } from 'src/app/_aods/utils.service';
import { UsuariosService } from 'src/app/_aods/usuarios.service';
import Swal from 'sweetalert2';
import { ToastrService } from 'ngx-toastr';
import { PersonasService } from 'src/app/_aods/personas.service';

@Component({
  selector: 'app-clientesregistrados',
  templateUrl: './clientesregistrados.component.html',
  styleUrls: ['./clientesregistrados.component.css']
})
export class ClientesregistradosComponent implements OnInit {

  dato: Personas;
  clientes: Clientes[];
  cliente: Clientes;
  user: Usuarios;

  submitted: boolean = false;
  formulario: FormGroup;

  pagina:number = 0;
  numPaginas:number = 0;
  cantidad:number = 10;
  buscar:string = '';
  total:number = 0;
  estado:string = '';

  modalRefCliente: NgbModalRef;

  constructor(
    private _personasService: PersonasService,
    private _solicitudesService: SolicitudesService,
    private _clientesService: ClientesService,
    private _usuariosService: UsuariosService,
    private _fC: FormBuilder,
    private _modalService: NgbModal,
    private utilsService: UtilsService,
    private _toast: ToastrService
  ) { }

  ngOnInit(): void {
    this.fdatos();
  }

  fcantidad() {
    this._clientesService.cantidad(this.buscar).subscribe((data) => {
      this.total = data;
    });
  }

  fbuscar() {
    this.pagina = 0;
    this.fdatos();
  }

  fdatos() {
    this._clientesService.datos(this.pagina, this.cantidad, this.buscar).subscribe((data) => {
      this.clientes = data;
      this.fcantidad();
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

  fformulario(dato: Usuarios) {
    this.formulario = this._fC.group({
      primerapellido: [
        dato.persona.primerapellido,
        [
          Validators.required,
          Validators.pattern('^[a-zA-ZÀ-ÿ\u00f1\u00d1\\s]+$')
        ]
      ],
      segundoapellido: [
        dato.persona.segundoapellido,
        [
          Validators.pattern('^[a-zA-ZÀ-ÿ\u00f1\u00d1\\s]+$')
        ]
      ],
      primernombre: [
        dato.persona.primernombre,
        [
          Validators.required,
          Validators.pattern('^[a-zA-ZÀ-ÿ\u00f1\u00d1\\s]+$')
        ]
      ],
      celular: [
        dato.persona.celular,
        [
          Validators.required,
          Validators.pattern('^[0-9]+$'),
          Validators.maxLength(15)
        ]
      ],
      direccion: [
        dato.persona.direccion,
        [
          Validators.pattern('^[a-zA-Z0-9\u00f1\u00d1\\s.,#-]+$'),
          Validators.maxLength(255)
        ]
      ],
      correo: [
        dato.persona.correo,
        [
          Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$'),
          Validators.maxLength(255)
        ]
      ],
      usuario: [
        dato.usuario,
        [
          Validators.required,
          Validators.pattern('^[a-zA-Z0-9\u00f1\u00d1]+$'),
          Validators.maxLength(10)
        ]
      ],
      clave: [
        dato.clave ? '**********' : '',
        [
          Validators.required,
          Validators.minLength(8),
          Validators.maxLength(20)
        ]
      ]
    });
  }

  get fC() {
    return this.formulario.controls;
  }

  onInputRegister(event: any, controlName: string, type: 'letrasyespacios' | 'numeros' | 'direccion'): void {
    let input = event.target.value;
    switch (type) {
      case 'letrasyespacios':
        input = input.replace(/[^a-zA-ZÀ-ÿ\u00f1\u00d1\s]/g, '');
        break;
      case 'numeros':
        input = input.replace(/[^0-9]/g, '');
        break;
      case 'direccion':
        input = input.replace(/[^a-zA-Z0-9\u00f1\u00d1\s.,#-]/g, '');
        break;
    }
    this.formulario.get(controlName)?.setValue(input.toUpperCase(), { emitEvent: false });
  }

  fadicionar(content: any){
    this.estado = 'Adicionar';
    this.user = new Usuarios();
    this.user.persona = new Personas();
    this.user.rol = new Roles();
    this.fformulario(this.user);
    this.modalRefCliente = this._modalService.open(content, {
      backdrop:'static',
      keyboard: false,
      size: 'lg',
      scrollable: true
    });
  }

  fmodificar(id: number, content: any) {
    this.utilsService.mostrarCargando();
    this.estado = 'Modificar';
    this._usuariosService.datorep(id).subscribe(
      (data) => {
        this.user = data;
        this.fformulario(this.user);
        this.modalRefCliente = this._modalService.open(content, {
          backdrop: 'static',
          keyboard: false,
          size: 'lg',
          scrollable: true
        });
        this.utilsService.cerrarCargando();
      }
    );
  }

  faceptar(){
    function toUpperCaseDefined(value: string | undefined): string {
      return value ? value.toUpperCase() : '';
    }
    this.submitted = true;

    this.dato = new Personas();
    this.dato.usuario = new Usuarios();

    this.dato.primerapellido = toUpperCaseDefined(this.formulario.value.primerapellido);
    this.dato.segundoapellido = toUpperCaseDefined(this.formulario.value.segundoapellido);
    this.dato.primernombre = toUpperCaseDefined(this.formulario.value.primernombre);
    this.dato.celular = this.formulario.value.celular;
    this.dato.direccion = this.formulario.value.direccion;
    this.dato.correo = this.formulario.value.correo;
    this.dato.usuario.usuario = this.formulario.value.usuario;
    this.dato.usuario.clave = this.formulario.value.clave;

    if (this.estado === 'Modificar') {
      this.dato.idpersona = this.user.persona?.idpersona;
      console.log(this.dato);

      this._personasService.modificar(this.dato).subscribe((data) => {
        this.fdatos();
        this.modalRefCliente.dismiss();
        this.utilsService.cerrarCargando();
        Swal.fire('Exito', 'Representante modificado con exito', 'success');
        this._toast.success('','Operacion exitosa');
      });
    } else {
      this.utilsService.mostrarCargando();

      this._personasService.adicionarCli(this.dato).subscribe((data) => {
        this.fdatos();
        this.modalRefCliente.dismiss();
        this.utilsService.cerrarCargando();
        Swal.fire('Exito', 'Representante registrado con exito', 'success');
        this._toast.success('','Operacion exitosa');
      });
    }
  }

  fcancelar(){
    if (this.modalRefCliente) {
      this.modalRefCliente.dismiss();
    }
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
