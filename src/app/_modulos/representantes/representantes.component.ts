import { HttpEventType } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl, SafeUrl } from '@angular/platform-browser';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { AccesoService } from 'src/app/_aods/acceso.service';
import { PersonasService } from 'src/app/_aods/personas.service';
import { RepresentantesService } from 'src/app/_aods/representantes.service';
import { RolesService } from 'src/app/_aods/roles.service';
import { TiposdocumentosService } from 'src/app/_aods/tiposdocumentos.service';
import { TiposextensionesService } from 'src/app/_aods/tiposextensiones.service';
import { TiposgenerosService } from 'src/app/_aods/tiposgeneros.service';
import { UsuariosService } from 'src/app/_aods/usuarios.service';
import { UtilsService } from 'src/app/_aods/utils.service';
import { MustMatch } from 'src/app/_config/application';
import { Personas } from 'src/app/_entidades/personas';
import { Representantes } from 'src/app/_entidades/representantes';
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
  representantes: Representantes[];

  pagina:number = 1;
  numPaginas:number = 0;
  cantidad:number = 10;
  buscar:string = '';
  total:number = 0;
  estado:string = '';

  imagen: any;
  imagenRepAnverso: any[];
  imagenRepReverso: any[];

  formulario: FormGroup;
  formImagen: FormGroup;
  formClave: FormGroup;
  submitted:boolean = false;

  modalRefRep: NgbModalRef;
  modalRefImagen: NgbModalRef;
  modalRefClave: NgbModalRef;
  modalRefCarnet: NgbModalRef;

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
    1: '1 HIJO',
    2: '2 HIJOS',
    3: '3 HIJOS',
    4: '4 HIJOS',
    5: '5 A MAS HIJOS',
    6: 'SIN HIJOS',
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

  @ViewChild('archivoInput') archivoInput: ElementRef;
  archivoSeleccionado: File = null;
  miniaturaUrl: string | ArrayBuffer = null;
  sizeFileFormat: string | null = null;
  cargando: boolean = false;
  progreso: number = 0;

  attempts: number = 0;
  maxAttempts: number = 3;
  lockEndTime: number = 0;
  intervalId: any;

  pdfUrl: SafeResourceUrl | null = null;

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
    private _toast: ToastrService,
    private sanitizer: DomSanitizer,
    private utilsService: UtilsService
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
    this._representantesService.cantidad(this.buscar).subscribe((data) => {
      this.total = data;
    });
  }

  fbuscar() {
    this.pagina = 0;
    this.fdatos();
  }

  fdatos() {
    this._representantesService.datos(this.pagina, this.cantidad, this.buscar).subscribe((data) => {
        this.fcantidad();
        this.representantes = data;
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

    let parteUsuario = '';
    if (segundoApellido) {
        parteUsuario = primerApellido.slice(0, 2) + segundoApellido.slice(0, 2) + primerNombre.slice(0, 2);
    } else {
        parteUsuario = primerApellido.slice(0, 4) + primerNombre.slice(0, 2);
    }
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
      size: 'lg',
      scrollable: true
    });
  }

  fmodificar(id: number, content: any) {
    this.utilsService.mostrarCargando();
    this.estado = 'Modificar';
    this.goToStep(1);
    this._usuariosService.datorep(id).subscribe(
      (data) => {
        this.user = data;
        this.fformulario(this.user, true);
        this.modalRefRep = this._modalService.open(content, {
          backdrop: 'static',
          keyboard: false,
          size: 'lg',
          scrollable: true
        });
        this.utilsService.cerrarCargando();
      }
      // (error) => {
      //   this.utilsService.cerrarCargando();
      //   swal.fire({
      //       icon: 'error',
      //       title: 'Error',
      //       text: 'Ocurrió un error al cargar los datos. Por favor, intente nuevamente.'
      //   });
      //   if (this.modalRefRep) {
      //     this.modalRefRep.dismiss();
      //   }
      // }
    );
  }

  fverrep(idpersona: number, content: any) {
    this.utilsService.mostrarCargando();
    this.estado = 'Ver';
    this._usuariosService.datorep(idpersona).subscribe(
      (data) => {
        this.user = data;
        this.fdescargar('repanverso');
        this.fdescargar('repreverso');

        this.modalRefRep = this._modalService.open(content, {
          backdrop:'static',
          keyboard: false,
          size: 'lg',
          scrollable: true
        });
        this.utilsService.cerrarCargando();
      },
      (error) => {
        this.utilsService.cerrarCargando();
        if (error.status === 404) {
          // Mostrar Swal para crear usuario y clave
          swal.fire({
            icon: 'warning',
            title: 'Usuario no encontrado',
            text: 'El representante no tiene un usuario registrado. ¿Desea generar un usuario y clave?',
            showCancelButton: true,
            confirmButtonText: 'Sí, generar',
            cancelButtonText: 'No, cancelar',
            customClass: {
              confirmButton: 'btn btn-success rounded-pill mr-3',
              cancelButton: 'btn btn-secondary rounded-pill',
            },
            buttonsStyling: false,
          }).then((result) => {
            if (result.isConfirmed) {
              this._personasService.generar({ id: idpersona }).subscribe(
                (data) => {
                  swal.fire('Éxito', 'Usuario y clave generados exitosamente', 'success');
                  this._toast.success('', 'Usuario y clave generados.');
                },
                (error) => {
                  swal.fire('Error', 'Ocurrió un error al generar el usuario y la clave.', 'error');
                  this._toast.error('', 'Error al generar usuario y clave.');
                }
              );
            }
          });
        }
      }
    );
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
    this.dato.telefono = this.formulario.value.telefono;
    this.dato.celular = this.formulario.value.celular;
    this.dato.formacion = this.formulario.value.formacion;
    this.dato.estadocivil = this.formulario.value.estadocivil;
    this.dato.hijos = this.formulario.value.hijos;
    this.dato.usuario.usuario = this.formulario.value.usuario;
    this.dato.usuario.clave = this.formulario.value.clave;

    if (this.estado === 'Modificar') {
      this.utilsService.mostrarCargando();
      this.dato.idpersona = this.user.persona?.idpersona;

      this._personasService.modificar(this.dato).subscribe((data) => {
        this.fdatos();
        this.modalRefRep.dismiss();
        this.utilsService.cerrarCargando();
        swal.fire('Exito', 'Representante modificado con exito', 'success');
        this._toast.success('','Operacion exitosa');
      });
    } else {
      this.utilsService.mostrarCargando();
      this._personasService.adicionar2(this.dato).subscribe((data) => {
        this.fdatos();
        this.modalRefRep.dismiss();
        this.utilsService.cerrarCargando();
        swal.fire('Exito', 'Representante registrado con exito', 'success');
        this._toast.success('','Operacion exitosa');
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
    this.archivoSeleccionado = null;
  }

  fcancelarClave(){
    this.modalRefClave.dismiss();
  }

  feliminar(id: number) {
    this._usuariosService.datorep(id).subscribe(
      (data) => {
        swal.fire({
          title: '¿Estás seguro?',
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
        }).then((result) => {
          if (result.value) {
            swal.fire({
              title: 'Confirmación de clave',
              html: `
                <input id="clave-input" class="swal2-input" placeholder="Ingrese su clave" type="password">
                <div id="intentos-restantes" style="margin-top: 10px;">Intentos restantes: ${this.maxAttempts - this.attempts}</div>
              `,
              showCancelButton: true,
              cancelButtonText: 'Cancelar',
              confirmButtonText: 'Confirmar',
              customClass: {
                confirmButton: 'btn btn-success rounded-pill mr-3',
                cancelButton: 'btn btn-secondary rounded-pill',
              },
              buttonsStyling: false,
              preConfirm: () => {
                const clave = (document.getElementById('clave-input') as HTMLInputElement).value;
                if (!clave) {
                  swal.showValidationMessage('Debe ingresar una clave');
                  return false;
                }
                return clave;
              }
            }).then((claveResult) => {
              if (claveResult.value) {
                if (!this.esCargoPasante) {
                  this._usuariosService.eliminarrep(id).subscribe(
                    (data) => {
                      this.fdatos();
                      swal.fire('Exito', 'Representante elimnado con exito', 'success');
                      this._toast.success('','Operacion exitosa');
                    },
                    (error) => {
                      this.attempts++;
                      if (this.attempts >= this.maxAttempts) {
                        this._toast.error('Se bloqueron los accesos.','Intentos excedidos.');
                        this.blockUI();
                      } else {
                        this._toast.error('','Clave incorrecta.');
                        this.feliminar(id);
                      }
                    }
                  );
                }else{
                  swal.fire('Error', 'Procedimiento NO autorizado, por favor contacte al Administrador', 'error');
                }
              }
            });
          }
        });
      },
      (error) => {
        if (error.status === 404) {
          swal.fire('Error en los datos', 'Usuario no encontrado', 'error');
        }
      }
    );
  }

  fimprimir(id: number, content: any){
    this.utilsService.mostrarCargando();
    this._personasService.documentoPDF(id, 'carnet').subscribe(
      data => {
        const url = window.URL.createObjectURL(data);
        this.pdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
        this.modalRefCarnet =  this._modalService.open(content, {
          backdrop: 'static',
          keyboard: false,
          size: 'xl'
        });
        this.utilsService.cerrarCargando();
      },
      error => {
        const mensaje = error.error?.mensaje || 'Error desconocido. Intenta nuevamente.';
        this.utilsService.cerrarCargando();
        // Mostramos el SweetAlert con el mensaje de error
        swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: mensaje,
          confirmButtonText: 'Aceptar'
        });
        this._toast.error('', 'Error desconocido');

      }
    );
  }

  fcambiarestado(idpersona: number, estado: boolean){
    swal.fire({
      title: !estado ? '¿Está seguro de deshabilitar?' : '¿Está seguro de habilitar?',
      icon: 'warning',
      text: !estado ? 'El representante NO se podrá utilizar para registros.' : 'El representante se podrá utilizar para registros.',
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
        swal.fire({
          title: 'Confirmación de clave',
          html: `
            <input id="clave-input" class="swal2-input" placeholder="Ingrese su clave" type="password">
            <div id="intentos-restantes" style="margin-top: 10px;">Intentos restantes: ${this.maxAttempts - this.attempts}</div>
          `,
          showCancelButton: true,
          cancelButtonText: 'Cancelar',
          confirmButtonText: 'Confirmar',
          customClass: {
            confirmButton: 'btn btn-success rounded-pill mr-3',
            cancelButton: 'btn btn-secondary rounded-pill',
          },
          buttonsStyling: false,
          preConfirm: () => {
            const clave = (document.getElementById('clave-input') as HTMLInputElement).value;
            if (!clave) {
              swal.showValidationMessage('Debe ingresar una clave');
              return false;
            }
            return clave;
          }
        }).then((claveResult) => {
          if (claveResult.value) {
            this._usuariosService.verificar({ clave: claveResult.value }).subscribe(
              (verificacionResponse) => {
                this._personasService.cambiarestado({ idpersona, estado }).subscribe(response => {
                  this.fdatos();
                  this._toast.success('','Clave correcta.');
                  swal.fire('Cambio realizado', 'El estado del representante ha sido cambiado con éxito.', 'success');
                  this.attempts = 0;
                });
              },
              (error) => {
                this.attempts++;
                if (this.attempts >= this.maxAttempts) {
                  this._toast.error('Se bloqueron los accesos.','Intentos excedidos.');
                  this.blockUI();
                } else {
                  this._toast.error('','Clave incorrecta.');
                  this.fcambiarestado(idpersona, estado);
                }
              }
            );
          }
        });
      }
    });
  }

  blockUI() {
    const remainingTime = 30; // Tiempo de bloqueo en segundos
    this.lockEndTime = Date.now() + remainingTime * 1000; // Calcular el tiempo de desbloqueo

    swal.fire({
      title: 'Intentos excedidos',
      html: `<div>Espere <strong id="countdown">${remainingTime}</strong> segundos para intentar de nuevo.</div>`,
      allowOutsideClick: false,
      allowEscapeKey: false,
      onBeforeOpen: () => {
        swal.showLoading(); // Mostrar el ícono de carga
        this.updateCountdown(); // Actualizar el contador
      }
    });
  }

  updateCountdown() {
    const interval = 1000; // Intervalo en milisegundos
    this.intervalId = setInterval(() => {
      const now = Date.now();
      const remainingTime = Math.max(0, Math.ceil((this.lockEndTime - now) / 1000));
      if (remainingTime <= 0) {
        clearInterval(this.intervalId);
        swal.close(); // Cerrar el Swal cuando se acabe el tiempo
        this.attempts = 0; // Reiniciar el contador de intentos
      } else {
        document.getElementById('countdown').innerText = remainingTime.toString();
      }
    }, interval);
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

  fcambiarclave(clave: string){
    swal.fire({
      title: 'Confirmación de clave',
      html: `
        <input id="clave-input" class="swal2-input" placeholder="Ingrese su clave" type="password">
        <div id="intentos-restantes" style="margin-top: 10px;">Intentos restantes: ${this.maxAttempts - this.attempts}</div>
      `,
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Confirmar',
      customClass: {
        confirmButton: 'btn btn-success rounded-pill mr-3',
        cancelButton: 'btn btn-secondary rounded-pill',
      },
      buttonsStyling: false,
      preConfirm: () => {
        const clave = (document.getElementById('clave-input') as HTMLInputElement).value;
        if (!clave) {
          swal.showValidationMessage('Debe ingresar una clave');
          return false;
        }
        return clave;
      }
    }).then((claveResult) => {
      if (claveResult.value) {
        this._usuariosService.verificar({ clave: claveResult.value }).subscribe(
          (verificacionResponse) => {
            this._usuariosService.cambiarclave({ clave }).subscribe(response => {
              this.fdatos();
              this._toast.success('','Clave correcta.');
              swal.fire('Clave Restablecida', 'La clave ha sido restablecida con éxito.', 'success');
              this.attempts = 0;
            });
          },
          (error) => {
            this.attempts++;
            if (this.attempts >= this.maxAttempts) {
              this._toast.error('Se bloqueron los accesos.','Intentos excedidos.');
              this.blockUI();
            } else {
              this._toast.error('','Clave incorrecta.');
              this.fcambiarclave(clave);
            }
          }
        );
      }
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

  fimagenRepA(contenido: any) {
    this.estado = 'Carnet Anverso';
    this.modalRefImagen = this._modalService.open(contenido, {
      backdrop: 'static',
      keyboard: false
    });
  }
  fimagenRepR(contenido: any) {
    this.estado = 'Carnet Reverso';
    this.modalRefImagen = this._modalService.open(contenido, {
      backdrop: 'static',
      keyboard: false
    });
  }

  fseleccionarArchivo(event) {
    const archivo = event.target.files[0];
    if (!archivo) {
      return;
    }

    const tamañoMaximoMB = 2;
    const tamañoMaximoBytes = tamañoMaximoMB * 1024 * 1024;
    if (archivo.size > tamañoMaximoBytes) {
      this._toast.error(`El archivo supera el límite de ${tamañoMaximoMB} MB.`, 'Tamaño de archivo no permitido');
      this.fremoverArchivo();
      return;
    }

    const tipoArchivo = archivo.type;
    if (tipoArchivo !== 'image/png' && tipoArchivo !== 'image/jpeg') {
      this._toast.error('Solo se permiten archivos PNG o JPG.', 'Formato no soportado');
      this.fremoverArchivo();
      return;
    }

    this.archivoSeleccionado = archivo;
    this.sizeFileFormat = this.fformatearTamañoArchivo(archivo.size);
    this.fcrearMiniatura();
  }

  fformatearTamañoArchivo(tamañoBytes: number): string {
    const tamañoMB = tamañoBytes / (1024 * 1024);
    return `${tamañoMB.toFixed(2)} MB`;
  }

  farrastrarSobre(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    (event.currentTarget as HTMLElement).classList.add('dragover');
  }

  farrastrarFuera(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    (event.currentTarget as HTMLElement).classList.remove('dragover');
  }

  fsoltarArchivo(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    (event.currentTarget as HTMLElement).classList.remove('dragover');

    if (event.dataTransfer.files.length > 0) {
      this.archivoSeleccionado = event.dataTransfer.files[0];
      this.fcrearMiniatura();
    }
  }

  fcrearMiniatura() {
    if (this.archivoSeleccionado) {
      const reader = new FileReader();
      reader.onload = (e) => this.miniaturaUrl = reader.result;
      reader.readAsDataURL(this.archivoSeleccionado);
    }
  }

  fremoverArchivo() {
    this.archivoSeleccionado = null;
    this.miniaturaUrl = null;
  }

  fcargar() {
    swal.fire({
      title: 'Cargando archivo...',
      html: 'Progreso: <b>0%</b>',
      allowOutsideClick: false,
      onBeforeOpen: () => {
        swal.showLoading();
      }
    });
    if (this.estado === 'Carnet Anverso') {
      this._personasService.upload(this.user.persona.idpersona.toString(), 'repanverso', this.archivoSeleccionado).subscribe(event => {
        if (event.type === HttpEventType.UploadProgress) {
          const progreso = Math.round((event.loaded / event.total) * 100);
          swal.getHtmlContainer().querySelector('b').textContent = `${progreso}%`;
        } else if (event.type === HttpEventType.Response) {
          swal.close();
          swal.fire('Archivo cargado', 'Archivo cargado con éxito', 'success');
          this._toast.success('', 'Carnet Anverso cambiado.');
          this.fdescargar('repanverso');
          this.modalRefImagen.dismiss();
          this.archivoSeleccionado = null;
        }
      }, error => {
        swal.close();
        swal.fire('Error', 'Ocurrió un error durante la subida, por favor contacte al ADMINISTRADOR', 'error');
      });
    }else if (this.estado === 'Carnet Reverso') {
      this._personasService.upload(this.user.idpersona.toString(), 'repreverso', this.archivoSeleccionado).subscribe(event => {
        if (event.type === HttpEventType.UploadProgress) {
          const progreso = Math.round((event.loaded / event.total) * 100);
          swal.getHtmlContainer().querySelector('b').textContent = `${progreso}%`;
        } else if (event.type === HttpEventType.Response) {
          swal.close();
          swal.fire('Archivo cargado', 'Archivo cargado con éxito', 'success');
          this._toast.success('', 'Carnet Reverso cambiado.');
          this.fdescargar('repreverso');
          this.modalRefImagen.dismiss();
          this.archivoSeleccionado = null;
        }
      }, error => {
        swal.close();
        swal.fire('Error', 'Ocurrió un error durante la subida, por favor contacte al ADMINISTRADOR', 'error');
      });
    }
  }

  fdescargar(rol: string) {
    if (rol == 'repanverso') {
      this.imagenRepAnverso = [];
      this._personasService.download(this.user.idpersona, 'repanverso').subscribe((data) => {
        this.imagenRepAnverso = data;
      });
    }
    if (rol == 'repreverso') {
      this.imagenRepReverso = [];
      this._personasService.download(this.user.idpersona, 'repreverso').subscribe((data) => {
        this.imagenRepReverso = data;
      });
    }
  }

  sanitizarImagen(data: string, mimeType: string): SafeUrl {
    return this.sanitizer.bypassSecurityTrustUrl(`data:${mimeType};base64,${data}`);
  }
}
