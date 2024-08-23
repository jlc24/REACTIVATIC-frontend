import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { AccesoService } from 'src/app/_aods/acceso.service';
import { PersonasService } from 'src/app/_aods/personas.service';
import { RepresentantesService } from 'src/app/_aods/representantes.service';
import { RolesService } from 'src/app/_aods/roles.service';
import { TiposdocumentosService } from 'src/app/_aods/tiposdocumentos.service';
import { TiposextensionesService } from 'src/app/_aods/tiposextensiones.service';
import { TiposgenerosService } from 'src/app/_aods/tiposgeneros.service';
import { UsuariosService } from 'src/app/_aods/usuarios.service';
import { MustMatch } from 'src/app/_config/application';
import { Personas } from 'src/app/_entidades/personas';
import { Roles } from 'src/app/_entidades/roles';
import { Tiposdocumentos } from 'src/app/_entidades/tiposdocumentos';
import { Tiposextensiones } from 'src/app/_entidades/tiposextensiones';
import { Tiposgeneros } from 'src/app/_entidades/tiposgeneros';
import { Usuarios } from 'src/app/_entidades/usuarios';
import swal from 'sweetalert2';

@Component({
  selector: 'app-representantes',
  templateUrl: './representantes.component.html',
  styleUrls: ['./representantes.component.css']
})
export class RepresentantesComponent implements OnInit {

  datos: Usuarios[];
  dato: Personas;
  user: Usuarios;
  documento: Tiposdocumentos[];
  extension: Tiposextensiones[];
  genero: Tiposgeneros[];
  rol: Roles[];

  pagina:number = 1;
  numPaginas:number = 0;
  cantidad:number = 10;
  buscar:string = '';
  total:number = 0;
  estado:string = '';

  archivoseleccionado: File;
  imagen: any;

  formulario: FormGroup;
  formImagen: FormGroup;
  formClave: FormGroup;
  submitted:boolean = false;

  modalRefRep: NgbModalRef;
  modalRefImagen: NgbModalRef;
  modalRefClave: NgbModalRef;

  formacionMap: { [key: number]: string } = {
    1: 'INICIAL',
    2: 'PRIMARIA',
    3: 'SECUNDARIA',
    4: 'TENICO',
    5: 'LICENCIATURA'
  };

  estadocivilMap: { [key: number]: string } = {
    1: 'SOLTERO(A)',
    2: 'CASADO(A)',
    3: 'VIUDO(A)',
    4: 'CONVIVIENTE',
    5: 'SEPARADO(A)'
  }

  hijosMap: { [key: number]: string } = {
    0: 'SIN HIJOS',
    1: '1 HIJO',
    2: '2 HIJOS',
    3: '3 HIJOS',
    4: '4 HIJOS',
    5: '5 A MAS HIJOS'
  }

  step: number = 1;

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
    private _usuariosService: UsuariosService,
    private _personasService: PersonasService,
    private _representantesService: RepresentantesService,
    private _documentoService: TiposdocumentosService,
    private _extensionesService: TiposextensionesService,
    private _generosService: TiposgenerosService,
    private _rolService: RolesService,
    private _accesoService: AccesoService,
    private _fb: FormBuilder,
    private _fbI: FormBuilder,
    private _fbC: FormBuilder,
    private _modalService: NgbModal,
    private _sanitizer: DomSanitizer,
  ) { }

  ngOnInit(): void {
    this.fdatos();
    this.fdocumento();
    this.fextension();
    this.fgenero();
    this.frol();
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

  getFormacionDescription(value: number): string {
    return this.formacionMap[value] || 'Desconocido';
  }
  getEstadoDescription(value: number): string {
    return this.estadocivilMap[value] || 'Desconocido';
  }
  getHijosDescription(value: number): string {
    return this.hijosMap[value] || 'Desconocido';
  }

  nextStep() {
    if (this.step < 4) {
      this.step++;
    }
  }

  prevStep() {
    if (this.step > 1) {
      this.step--;
    }
  }

  goToStep(step: number) {
    this.step = step;
  }

  fdocumento() {
    this._documentoService.listar().subscribe( data => {
      this.documento = data;
    });
  }

  fextension() {
    this._extensionesService.listar().subscribe( data => {
      this.extension = data;
    });
  }

  fgenero() {
    this._generosService.listar().subscribe( data => {
      this.genero = data;
    });
  }

  frol(){
    this._rolService.listar().subscribe( data => {
      this.rol = data;
    });
  }

  fcantidad() {
    this._usuariosService.cantidadrep(this.buscar).subscribe((data) => {
      this.total = data;
    });
  }

  fbuscar() {
    this.pagina = 0;
    this.fdatos();
  }

  fdatos() {
    this._usuariosService.datosrep(this.pagina, this.cantidad, this.buscar).subscribe((data) => {
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

  fformulario(user: Usuarios, disabled: boolean = false) {
    this.formulario = this._fb.group({
      primerapellido: [
        user.persona.primerapellido,
        [
          Validators.required,
          Validators.pattern('^[a-zA-ZÀ-ÿ\u00f1\u00d1\\s]+$'),
          Validators.maxLength(50)
        ],
      ],
      segundoapellido: [
        user.persona.segundoapellido,
        [
          Validators.pattern('^[a-zA-ZÀ-ÿ\u00f1\u00d1\\s]+$'),
          Validators.maxLength(50)
        ]
      ],
      primernombre: [
        user.persona.primernombre,
        [
          Validators.required,
          Validators.pattern('^[a-zA-ZÀ-ÿ\u00f1\u00d1\\s]+$'),
          Validators.maxLength(50)
        ]
      ],
      idtipogenero: [
        user.persona?.tipogenero?.idtipogenero,
        [
          Validators.required
        ]
      ],
      idtipodocumento: [
        user.persona?.tipodocumento?.idtipodocumento,
        [
          Validators.required
        ]
      ],
      dip: [
        user.persona.dip,
        [
          Validators.required,
          Validators.pattern('^[0-9]+$'),
          Validators.maxLength(15)
        ]
      ],
      complementario:[
        user.persona.complementario,
        [
          Validators.pattern('^[a-zA-Z0-9\u00f1\u00d1]+$'),
          Validators.maxLength(5)
        ]
      ],
      idtipoextension:[
        user.persona?.tipoextension?.idtipoextension,
        [
          Validators.required
        ]
      ],
      formacion: [
        user.persona.formacion,
        [
          Validators.required,
        ]
      ],
      estadocivil: [
        user.persona.estadocivil,
        [
          Validators.required,
        ]
      ],
      hijos: [
        user.persona.hijos,
        [
          Validators.required,
        ]
      ],
      celular: [
        user.persona.celular,
        [
          Validators.required,
          Validators.pattern('^[0-9]+$'),
          Validators.maxLength(15)
        ],
      ],
      telefono: [
        user.persona.telefono,
        [
          Validators.pattern('^[0-9]+$'),
          Validators.maxLength(15)
        ],
      ],
      direccion: [
        user.persona.direccion,
        [
          Validators.required,
          Validators.pattern('^[a-zA-Z0-9\u00f1\u00d1\\s.,#-]+$'),
          Validators.minLength(5),
          Validators.maxLength(255)
        ],
      ],
      correo: [
        user.persona.correo,
        [
          Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$'),
          Validators.minLength(5),
          Validators.maxLength(255)
        ],
      ],
      usuario: [
        user.usuario,
        [
          Validators.required,
          Validators.pattern('^[a-zA-Z0-9\u00f1\u00d1]+$'),
          Validators.minLength(5),
          Validators.maxLength(20)
        ]
      ],
      clave: [
        user.clave ? '**********' : '',
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
    this.formulario.get('dip')?.valueChanges.subscribe(() => this.generateUserAndPassword());
  }

  generateUserAndPassword() {
    const primerApellido = this.formulario.get('primerapellido')?.value || '';
    const segundoApellido = this.formulario.get('segundoapellido')?.value || '';
    const primerNombre = this.formulario.get('primernombre')?.value || '';
    const dip = this.formulario.get('dip')?.value || '';

    const parteUsuario = primerApellido.slice(0, 2) + segundoApellido.slice(0, 2) + primerNombre.slice(0, 2);

    const parteDIP = dip.slice(-3);

    const usuario = parteUsuario.toLowerCase() + parteDIP;
    const clave = parteUsuario.toLowerCase() + parteDIP;

    this.formulario.patchValue({
      usuario: usuario,
      clave: clave
    });
  }

  get f() { return this.formulario.controls; }

  onInput(event: any, controlName: string, type: 'letras' | 'letrasyespacios' | 'numeros' | 'letrasynumerosguion' | 'direccion'): void {
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
      case 'letrasynumerosguion':
        input = input.replace(/[^a-zA-Z0-9\u00f1\u00d1]/g, '');
        break;
      case 'direccion':
        input = input.replace(/[^a-zA-Z0-9\u00f1\u00d1\s.,#-]/g, '');
        break;
    }
    // this.formulario.get(controlName)?.setValue(input.toUpperCase(), { emitEvent: false });
    if (this.formulario.get(controlName)) {
      this.formulario.get(controlName)?.setValue(input.toUpperCase(), { emitEvent: false });
    }

    if (this.formImagen.get(controlName)) {
      this.formImagen.get(controlName)?.setValue(input.toUpperCase(), { emitEvent: false });
    }
    if (this.formClave.get(controlName)) {
      this.formClave.get(controlName)?.setValue(input.toUpperCase(), {emitEvent: false });
    }
  }

  fadicionar(content: any) {
    this.estado = 'Adicionar';
    this.user = new Usuarios();
    this.user.persona = new Personas();
    this.user.rol = new Roles();
    this.goToStep(1);
    this.fformulario(this.user);
    this.modalRefRep = this._modalService.open(content, {
      backdrop:'static',
      keyboard: false,
      size: 'lg'
    });
  }

  fmodificar(id: number, content: any) {
    this.estado = 'Modificar';
    this.goToStep(1);
    this._usuariosService.dato(id).subscribe((data) => {
      this.user = data;
      this.fformulario(this.user, true);
      this.modalRefRep = this._modalService.open(content, {
        backdrop: 'static',
        keyboard: false,
        size: 'lg'
      });
    });
  }

  fverrep(id: number, content: any) {
    this.estado = 'Ver';
    this._usuariosService.dato(id).subscribe((data) => {
      this.user = data;
      this.modalRefRep = this._modalService.open(content, {
        backdrop:'static',
        keyboard: false,
        size: 'lg'
      });
    });
  }

  faceptar(): void {
    function toUpperCaseDefined(value: string | undefined): string {
      return value ? value.toUpperCase() : '';
    }
    this.submitted = true;

    this.dato = new Personas();
    this.dato.usuario = new Usuarios();

    this.dato.primerapellido = toUpperCaseDefined(this.formulario.value.primerapellido);
    this.dato.segundoapellido = toUpperCaseDefined(this.formulario.value.segundoapellido);
    this.dato.primernombre = toUpperCaseDefined(this.formulario.value.primernombre);
    this.dato.idtipogenero = this.formulario.value.idtipogenero;
    this.dato.idtipodocumento = this.formulario.value.idtipodocumento;
    this.dato.dip = this.formulario.value.dip;
    this.dato.complementario = toUpperCaseDefined(this.formulario.value.complementario);
    this.dato.idtipoextension = this.formulario.value.idtipoextension;
    this.dato.telefono = this.formulario.value.celular;
    this.dato.celular = this.formulario.value.celular;
    this.dato.formacion = this.formulario.value.formacion;
    this.dato.estadocivil = this.formulario.value.estadocivil;
    this.dato.hijos = this.formulario.value.hijos;
    this.dato.usuario.usuario = this.formulario.value.usuario;
    this.dato.usuario.clave = this.formulario.value.clave;

    if (this.estado === 'Modificar') {
      this._personasService.modificar(this.dato).subscribe((data) => {
        this.fdatos();
        this.modalRefRep.dismiss();
        swal.fire('Exito', 'Representante modificado con exito', 'success');
      });
    } else {
      this._personasService.adicionar2(this.dato).subscribe((data) => {
        this.fdatos();
        this.modalRefRep.dismiss();
        swal.fire('Exito', 'Representante registrado con exito', 'success');
      });
    }
  }

  getFormControls(): string[] {
    return Object.keys(this.formulario.controls);
  }

  fcancelar() {
    this.modalRefRep.dismiss();
  }

  fcancelarImagen(){
    this.modalRefImagen.dismiss();
  }

  fcancelarClave(){
    this.modalRefClave.dismiss();
  }

  feliminar(id: number) {
    swal.fire({
      title: 'Estás seguro?',
      icon: 'warning',
      text: 'No podrás revertir el borrado de este dato!',
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Borrar',
    }).then((result) => {
      if (result.value) {
        // this._usuariosService.eliminarrep(id).subscribe((data) => {
        //   this.fdatos();
        // });
        swal.fire('Error', 'Procedimiento NO autorizado, por favor contacte al Administrador', 'error');
      }
    });
  }

  fcambiarestado(idpersona: number, estado: boolean){
    swal.fire({
      title: !estado ? '¿Está seguro de deshabilitar?' : '¿Está seguro de habilitar?',
      icon: 'warning',
      text: !estado ? 'El rubro NO se podrá utilizar para registros.' : 'El rubro se podrá utilizar para registros.',
      showCancelButton: true,
      cancelButtonText: 'cancelar',
      confirmButtonText: 'Cambiar',
    }).then((result) => {
      if (result.value) {
        // this._rubrosService.cambiarestado({ idrubro, estado }).subscribe( response => {
        //   this.fdatos();
        //   swal.fire('Cambio realizado', 'El estado del rubro ha sido cambiado con éxito.', 'success');
        // });
      }
    });
  }

  fdatosXLS() {
    this._representantesService.datosXLS(this.buscar).subscribe(data => {
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
    this._representantesService.datosPDF(this.buscar).subscribe(data => {
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

  fcambiarclave(contenido: any){
    this.estado = 'Actualizar';
    this.crearformulario();
    this.modalRefClave = this._modalService.open(contenido, {
      backdrop: 'static',
      keyboard: false
    });
  }

  crearformulario() {
    this.formClave = this._fbC.group ({
      cclave: [
        '',
        [
          Validators.required,
          Validators.pattern('[a-zA-Z0-9]*'),
          Validators.minLength(8),
          Validators.maxLength(50)
        ]
      ],
      clave: [
        '',
        [
          Validators.required,
          Validators.pattern('[a-zA-Z0-9]*'),
          Validators.minLength(8),
          Validators.maxLength(50)
        ]
      ]
    },
    {
      validator: MustMatch('clave', 'cclave')
    });
  }

  get fC() { return this.formClave.controls; }

  faceptarcambiarclave() {
    this.submitted = true;
    this.user = new Usuarios();
    this.user.clave = this.formulario.value.clave;
    this._usuariosService.cambiarclave(this.user).subscribe( data=>{
      swal.fire(
        "Exito",
        "Clave cambiada con exito",
        "success"
      );
      this.modalRefClave.dismiss();
    })
  }

  fcambiarimagen(contenido: any) {
    this.estado = 'Actualizar';
    this.modalRefImagen = this._modalService.open(contenido, {
      backdrop: 'static',
      keyboard: false
    });
  }

  fseleccionarArchivo(event) {
    this.archivoseleccionado = event.target.files[0];
  }

  fcargar() {
    this._personasService.cargarImagen(this.archivoseleccionado).subscribe(data => {
      this.modalRefImagen.dismiss();
      this.fdescargar()
      swal.fire('Archivo cargado', 'Archivo cargado con exito', 'success')
    })
  }

  fdescargar() {
    this.imagen = null;
    this._personasService.descargarImagen().subscribe(data=>{
      const objectURL = window.URL.createObjectURL(data);
      this.imagen = this._sanitizer.bypassSecurityTrustUrl(objectURL);
    })
  }


}
