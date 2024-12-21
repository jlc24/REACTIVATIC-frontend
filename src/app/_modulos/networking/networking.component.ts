import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { BeneficiosService } from 'src/app/_aods/beneficios.service';
import { BeneficiosempresasService } from 'src/app/_aods/beneficiosempresas.service';
import { ClientesService } from 'src/app/_aods/clientes.service';
import { DemandasService } from 'src/app/_aods/demandas.service';
import { EmpresasService } from 'src/app/_aods/empresas.service';
import { OfertasService } from 'src/app/_aods/ofertas.service';
import { PersonasService } from 'src/app/_aods/personas.service';
import { TradesService } from 'src/app/_aods/trades.service';
import { RUTA } from 'src/app/_config/application';
import { Beneficios } from 'src/app/_entidades/beneficios';
import { Beneficiosempresas } from 'src/app/_entidades/beneficiosempresas';
import { Clientes } from 'src/app/_entidades/clientes';
import { Demandas } from 'src/app/_entidades/demandas';
import { Empresas } from 'src/app/_entidades/empresas';
import { Negocios } from 'src/app/_entidades/negocios';
import { Ofertas } from 'src/app/_entidades/ofertas';
import { Personas } from 'src/app/_entidades/personas';
import { Roles } from 'src/app/_entidades/roles';
import { Usuarios } from 'src/app/_entidades/usuarios';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-networking',
  templateUrl: './networking.component.html',
  styleUrls: ['./networking.component.css']
})
export class NetworkingComponent implements OnInit {

  ruta = `${RUTA}/catalogos/descargarempresa/`;

  empresa: Empresas;
  beneficio: Beneficios;
  beneficiosempresas: Beneficiosempresas[];
  negocios: Negocios[];
  negocio: Negocios;

  fechas: Negocios[];
  horas: Negocios[];

  isSameDate: boolean = false;

  ofertas: Ofertas[];
  oferta: Ofertas;
  isEditingOferta = false;
  demandas: Demandas[];
  demanda: Demandas;
  isEditingDemanda = false;

  buscarnegocios: string = '';
  buscarinscritos: string = '';
  buscarCliente: string = '';

  totalEmp: number = 0;
  totalcitas: number = 0;

  formOferta: FormGroup;
  formDemanda: FormGroup;
  formulario: FormGroup;
  submitted:boolean = false;

  dato: Personas;
  clientes: Clientes[];
  cliente: Clientes;
  user: Usuarios;
  persona: Personas = null;

  personaseleccionada: Personas;
  horarioseleccionado: Negocios = null;
  mesas: number[] = [];
  mesa: number = 0;

  modalRefVer: NgbModalRef;
  modalRefConectar: NgbModalRef;

  constructor(
    private _empresasService: EmpresasService,
    private _beneficiosService: BeneficiosService,
    private _beneficiosempresasService: BeneficiosempresasService,
    private _tradesService: TradesService,
    private _ofertasService: OfertasService,
    private _demandasService: DemandasService,
    private _personasService: PersonasService,
    private _clientesService: ClientesService,
    private _fO: FormBuilder,
    private _fD: FormBuilder,
    private _fC: FormBuilder,
    private _modalService: NgbModal,
    private _toast: ToastrService,
  ) { }

  ngOnInit(): void {
    this.formOferta = this._fO.group({
      idoferta: [''],
      tipooferta: [''],
      oferta: ['']
    });
    this.formDemanda = this._fD.group({
      iddemanda: [''],
      tipodemanda: [''],
      demanda: ['']
    });
    this.fbeneficio();
    this.fclientes();
  }

  fbeneficio(){
    this._beneficiosService.negocios().subscribe((data) => {
      this.beneficio = data;
      const fechaInicio = new Date(this.beneficio.fechainicio);
      const fechaFin = new Date(this.beneficio.fechafin);
      this.isSameDate = fechaInicio.toDateString() === fechaFin.toDateString();
      this.fbeneficiosempresas();
      this.fdatos();
    });
  }

  fbuscarnegocios(){
    this.fdatos();
  }

  fcantidad(){
    this._tradesService.cantidad(this.buscarnegocios, this.beneficio.idbeneficio).subscribe(data => {
      this.totalcitas = data;
    });
  }

  fdatos(){
    this._tradesService.datos(this.buscarnegocios, this.beneficio.idbeneficio).subscribe(data => {
      this.negocios = data;
      this.fcantidad();
    });
  }

  fbuscarinscritos(){
    this.fbeneficiosempresas();
  }

  fcantidadempresas(id: number){
    this._beneficiosempresasService.cantidadbeneficio(this.buscarinscritos, id).subscribe((data) => {
      this.totalEmp = data;
    });
  }

  fbeneficiosempresas(){
    this._beneficiosempresasService.datosl(this.beneficio.idbeneficio).subscribe(data => {
      this.beneficiosempresas = data;
      this.fcantidadempresas(this.beneficio.idbeneficio);
    });
  }

  fofertas(id: number){
    this._ofertasService.ofertas(id).subscribe(data => {
      this.ofertas = data;
    });
  }

  fdemandas(id: number){
    this._demandasService.demandas(id).subscribe(data => {
      this.demandas = data;
    });
  }

  fver(id: number, content: any){
    this._empresasService.dato(id).subscribe(data => {
      this.empresa = data;
      this.fofertas(data.idempresa);
      this.fdemandas(data.idempresa);
      this.modalRefVer = this._modalService.open(content, {
        backdrop: 'static',
        keyboard: false,
        size: 'md',
        scrollable: true
      });
    });
  }

  fadicionaroferta(){
    this.submitted = true;

    this.oferta = new Ofertas;

    this.oferta.idempresa = this.empresa.idempresa;
    this.oferta.tipooferta = this.formOferta.value.tipooferta;
    this.oferta.oferta = this.formOferta.value.oferta;

    this._ofertasService.adicionar(this.oferta).subscribe(
      response => {
        this.fofertas(this.empresa.idempresa);
        this.formOferta.reset();
        this.submitted = false;
        this._toast.success('Oferta agregada', 'Hecho');
      },
      (error) => {
        this._toast.error('', 'Error en la operación');
      }
    );
  }

  fformOfertas(dato: Ofertas){
    this.formOferta = this._fO.group({
      idoferta: [
        dato.idoferta,
      ],
      tipooferta: [
        dato.tipooferta,
        [
          Validators.required
        ]
      ],
      oferta: [
        dato.oferta,
        [
          Validators.required,
          Validators.pattern('^[a-zA-ZÀ-ÿ\u00f1\u00d1\\s]+$')
        ]
      ]
    });
  }

  get fO() { return this.formOferta.controls; }

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
    if (this.formOferta.get(controlName)) {
      this.formOferta.get(controlName)?.setValue(input.toUpperCase(), { emitEvent: false });
    }

    if (this.formDemanda.get(controlName)) {
      this.formDemanda.get(controlName)?.setValue(input.toUpperCase(), { emitEvent: false });
    }
  }

  feditaroferta(id: number){
    this.isEditingOferta = true;
    this._ofertasService.dato(id, this.empresa.idempresa.toString()).subscribe(data => {
      this.oferta = data;
      this.fformOfertas(this.oferta);
    });
  }

  fmodificaroferta(){
    this.submitted = true

    this.oferta.idoferta = this.formOferta.value.idoferta;
    this.oferta.idempresa = this.empresa.idempresa;
    this.oferta.tipooferta = this.formOferta.value.tipooferta;
    this.oferta.oferta = this.formOferta.value.oferta;

    this._ofertasService.modificar(this.oferta).subscribe(
      data => {
        this.fofertas(this.empresa.idempresa);
        this.formOferta.reset();
        this.submitted = false;
        this.isEditingOferta = false;
        this._toast.success('Oferta modificada', 'Hecho');
      },
      (error) => {
        this._toast.error('', 'Error en la operación');
      }
    );
  }

  feliminaroferta(id: number){
    this._ofertasService.eliminar(id).subscribe(
      data => {
        this.fofertas(this.empresa.idempresa);
        this._toast.success('Oferta eliminada', 'Hecho');
      },
      (error) => {
        this._toast.error('', 'Error en la operación');
      }
    );
  }

  fcancelareditoferta(){
    this.submitted = false;
    this.isEditingOferta = false;
    this.formOferta.reset();
  }

  fadicionardemanda(){
    this.submitted = true;

    this.demanda = new Demandas;

    this.demanda.idempresa = this.empresa.idempresa;
    this.demanda.tipodemanda = this.formDemanda.value.tipodemanda;
    this.demanda.demanda = this.formDemanda.value.demanda;

    this._demandasService.adicionar(this.demanda).subscribe(
      response => {
        this.fdemandas(this.empresa.idempresa);
        this.formDemanda.reset();
        this.submitted = false;
        this._toast.success('Demanda agregada', 'Hecho');
      },
      (error) => {
        this._toast.error('', 'Error en la operación');
      }
    );
  }

  fformDemandas(dato: Demandas){
    this.formDemanda = this._fO.group({
      iddemanda: [
        dato.iddemanda,
      ],
      tipodemanda: [
        dato.tipodemanda,
        [
          Validators.required
        ]
      ],
      demanda: [
        dato.demanda,
        [
          Validators.required,
          Validators.pattern('^[a-zA-ZÀ-ÿ\u00f1\u00d1\\s]+$')
        ]
      ]
    });
  }

  get fD() { return this.formDemanda.controls; }

  feditarDemanda(id: number){
    this.isEditingDemanda = true;
    this._demandasService.dato(id, this.empresa.idempresa.toString()).subscribe(data => {
      this.demanda = data;
      this.fformDemandas(this.demanda);
    });
  }

  fmodificardemanda(){
    this.submitted = true

    this.demanda.iddemanda = this.formDemanda.value.iddemanda;
    this.demanda.idempresa = this.empresa.idempresa;
    this.demanda.tipodemanda = this.formDemanda.value.tipodemanda;
    this.demanda.demanda = this.formDemanda.value.demanda;

    this._demandasService.modificar(this.demanda).subscribe(
      data => {
        this.fdemandas(this.empresa.idempresa);
        this.formDemanda.reset();
        this.submitted = false;
        this.isEditingDemanda = false;
        this._toast.success('Demanda modificada', 'Hecho');
      },
      (error) => {
        this._toast.error('', 'Error en la operación');
      }
    );
  }

  feliminardemanda(id: number){
    this._demandasService.eliminar(id).subscribe(
      data => {
        this.fdemandas(this.empresa.idempresa);
        this._toast.success('Demanda eliminada', 'Hecho');
      },
      (error) => {
        this._toast.error('', 'Error en la operación');
      }
    );
  }

  fcancelareditdemanda(){
    this.submitted = false;
    this.isEditingDemanda = false;
    this.formDemanda.reset();
  }

  fcancelar(){
    if (this.modalRefVer) {
      this.modalRefVer.dismiss();
      if (this.persona) {
        this.persona = null;
        this.buscarCliente = null;

      }
      if (this.horarioseleccionado){
        this.horarioseleccionado = null
        this.horas = [];
      }
    }
  }

  fcancelarcliente(){
    if (this.modalRefConectar){
      this.modalRefConectar.dismiss();
    }
  }

  ffechas(){
    this._tradesService.fechas(this.empresa.idempresa.toString(), this.beneficio.idbeneficio.toString()).subscribe(data => {
      this.fechas = data;
    });
  }

  fhoras(event: any){
    const fechaSeleccionada = event.target.value;
    this._tradesService.horas(this.empresa.idempresa.toString(), this.beneficio.idbeneficio.toString(), fechaSeleccionada).subscribe(data => {
      this.horas = data
    });
  }

  sumarCincoMinutos(hora: string): string {
    const [horas, minutos] = hora.split(':').map(num => parseInt(num, 10));
    const fecha = new Date();
    fecha.setHours(horas);
    fecha.setMinutes(minutos + 5);

    const hh = fecha.getHours().toString().padStart(2, '0');
    const mm = fecha.getMinutes().toString().padStart(2, '0');

    return `${hh}:${mm}`;
  }

  seleccionarHora(hora: any) {
    this.horarioseleccionado = hora;
  }

  fconectar(){
    if (this.persona == null ) {
      Swal.fire({
        icon: 'warning',
        title: 'Información',
        text: `Por favor selecione una persona`,
        confirmButtonText: 'Aceptar',
        customClass: {
          confirmButton: 'btn btn-success rounded-pill mr-3',
        },
        buttonsStyling: false,
      });
    }else if (this.horarioseleccionado == null) {
      Swal.fire({
        icon: 'warning',
        title: 'Información',
        text: `Por favor selecione un horario`,
        confirmButtonText: 'Aceptar',
        customClass: {
          confirmButton: 'btn btn-success rounded-pill mr-3',
        },
        buttonsStyling: false,
      });
    }else{

      // this.negocio.idnegocio = this.horarioseleccionado.idnegocio;
      // this.

      this._tradesService.modificar({ idnegocio: this.horarioseleccionado.idnegocio,
                                      idpersona: this.persona.idpersona,
                                      estadoempresa: 6,
                                      estadopersona: 6,
                                      mesa: this.mesa,

                                    }).subscribe(data => {
        this.fdatos();
        this.modalRefVer.dismiss();
        this._toast.success('Cita agendada con exito', 'Hecho');
      });
    }
  }

  fverinfo(id: number, content: any){
    this._empresasService.dato(id).subscribe(data => {
      this.empresa = data;
      this.horas = [];
      this.ffechas();
      this.fclientes();
      this.modalRefVer = this._modalService.open(content, {
        backdrop: 'static',
        keyboard: false,
        size: 'lg',
        scrollable: true
      });
    });
  }

  fformulario(dato: Usuarios,) {
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
    this.formulario.get('primerapellido')?.valueChanges.subscribe(() => this.generateUserAndPassword());
    this.formulario.get('segundoapellido')?.valueChanges.subscribe(() => this.generateUserAndPassword());
    this.formulario.get('primernombre')?.valueChanges.subscribe(() => this.generateUserAndPassword());
    this.formulario.get('celular')?.valueChanges.subscribe(() => this.generateUserAndPassword());
  }

  generateUserAndPassword() {
    const primerApellido = this.formulario.get('primerapellido')?.value || '';
    const segundoApellido = this.formulario.get('segundoapellido')?.value || '';
    const primerNombre = this.formulario.get('primernombre')?.value || '';
    const dip = this.formulario.get('celular')?.value || '';

    const parteUsuario = primerApellido.slice(0, 2) + segundoApellido.slice(0, 2) + primerNombre.slice(0, 2);

    const parteDIP = dip.slice(-3);

    const usuario = parteUsuario.toLowerCase() + parteDIP;
    const clave = parteUsuario.toLowerCase() + parteDIP;

    this.formulario.patchValue({
      usuario: usuario,
      clave: clave
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

    this.user = new Usuarios();
    this.user.persona = new Personas();
    this.user.rol = new Roles();
    this.fformulario(this.user);

    this.modalRefConectar = this._modalService.open(content, {
      backdrop:'static',
      keyboard: false,
      size: 'lg',
      scrollable: true
    });
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

    this._personasService.adicionarCli(this.dato).subscribe((data) => {
      this.fdatos();
      this.modalRefConectar.dismiss();
      Swal.fire('Exito', 'Representante registrado con exito', 'success');
      this._toast.success('','Operacion exitosa');
    });
  }

  fclientes(){
    this._clientesService.buscar(this.buscarCliente).subscribe(data => {
      this.clientes = data;
    });
  }

  fbuscarCliente(){
    if (this.buscarCliente.trim().length > 0) {
      this.fclientes();
    }else{
      this.clientes = [];
      this.cliente = null;
    }
  }

  flimpiarbuscar(){
    this.buscarCliente = '';
    this.persona = null;
  }

  onSelect(nombre: string){
    const cliSeleccionado = this.clientes.find(cli => {
      return (
        `${cli.persona.primerapellido} ${cli.persona.segundoapellido} ${cli.persona.primernombre}` === nombre
      );
    });

    if (cliSeleccionado) {
      this.fselcliente(cliSeleccionado.persona.idpersona);
    }
  }

  fselcliente(id: number){
    this._personasService.dato(id).subscribe(data => {
      this.persona = data;
    });
  }

  fvercita(id: number, content: any){
    this._tradesService.dato(id, this.beneficio.idbeneficio).subscribe(data => {
      this.negocio = data;
      this.modalRefVer = this._modalService.open(content, {
        backdrop:'static',
        keyboard: false,
        size: 'lg',
        scrollable: true
      });
    });
  }

  generarMesas(): void {
    this.mesas = Array.from({ length: this.beneficio.mesas }, (_, i) => i + 1);
  }

}
