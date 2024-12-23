import { AccesoService } from 'src/app/_aods/acceso.service';
import { PersonasService } from './../../_aods/personas.service';
import { Personas } from './../../_entidades/personas';
import { TiposdocumentosService } from 'src/app/_aods/tiposdocumentos.service';
import { Tiposdocumentos } from 'src/app/_entidades/tiposdocumentos';
import { TiposextensionesService } from 'src/app/_aods/tiposextensiones.service';
import { Tiposextensiones } from 'src/app/_entidades/tiposextensiones';
import { TiposgenerosService } from 'src/app/_aods/tiposgeneros.service';
import { Tiposgeneros } from 'src/app/_entidades/tiposgeneros';
import { RolesService } from 'src/app/_aods/roles.service';
import { Roles } from 'src/app/_entidades/roles';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { UsuariosService } from 'src/app/_aods/usuarios.service';
import { Usuarios } from 'src/app/_entidades/usuarios';
import swal from 'sweetalert2';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { Cargos } from 'src/app/_entidades/cargos';
import { CargosService } from 'src/app/_aods/cargos.service';
import { ToastrService } from 'ngx-toastr';
import { UtilsService } from 'src/app/_aods/utils.service';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css'],
})
export class UsuariosComponent implements OnInit {
  datos: Usuarios[];
  dato: Personas;
  user: Usuarios;
  documento: Tiposdocumentos[];
  extension: Tiposextensiones[];
  genero: Tiposgeneros[];
  rol: Roles[];
  cargos: Cargos[];

  imagenUsuario: any[];

  pagina: number = 1;
  numPaginas: number = 0;
  cantidad: number = 10;
  buscar: string = '';
  total: number = 0;
  estado: string = '';

  formulario: FormGroup;
  submitted: boolean = false;

  esadmin: boolean = false;
  essddpi: boolean = false;
  esdpeic: boolean = false;
  esreactivatic: boolean = false;

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

  archivoseleccionado: File;
  imagen: any;

  step: number = 1;

  attempts: number = 0;
  maxAttempts: number = 3;
  lockEndTime: number = 0;
  intervalId: any;

  constructor(
    private _usuariosService: UsuariosService,
    private _personasService: PersonasService,
    private _documentoService: TiposdocumentosService,
    private _extensionesService: TiposextensionesService,
    private _generosService: TiposgenerosService,
    private _accesoService: AccesoService,
    private _rolService: RolesService,
    private _cargosService: CargosService,
    private sanitizer: DomSanitizer,
    private _fb: FormBuilder,
    config: NgbModalConfig,
    private _modalService: NgbModal,
    private _toast: ToastrService,
    private utilsService: UtilsService
  ) {
    config.backdrop = 'static';
    config.keyboard = false;
  }

  ngOnInit(): void {
    this.utilsService.mostrarCargando();
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
    this.utilsService.cerrarCargando();
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
    this.esadmin = this._accesoService.esRolAdmin();
    this.essddpi = this._accesoService.esRolSddpi();
    this.esdpeic = this._accesoService.esRolDpeic();
    this.esreactivatic = this._accesoService.esRolReactivatic();
    if (this.esadmin) {
      this._rolService.listaradmin().subscribe( data => {
        this.rol = data;
      });
    }
    if (this.essddpi) {
      this._rolService.listarsddpi().subscribe( data => {
        this.rol = data;
      });
    }
    if (this.esdpeic) {
      this._rolService.listardpeic().subscribe( data => {
        this.rol = data;
      });
    }
    if (this.esreactivatic) {
      this._rolService.listarreactivatic().subscribe( data => {
        this.rol = data;
      })
    }
  }

  fcargo(id: number){
    this._cargosService.listar(id).subscribe((data) => {
      this.cargos = data;

    })
  }

  fcantidad() {
    this.esadmin = this._accesoService.esRolAdmin();
    this.essddpi = this._accesoService.esRolSddpi();
    this.esdpeic = this._accesoService.esRolDpeic();
    this.esreactivatic = this._accesoService.esRolReactivatic();
    if (this.esadmin) {
      this._usuariosService.cantidad(this.buscar).subscribe((data) => {
        this.total = data;
      });
    }
    if (this.essddpi) {
      this._usuariosService.cantidadsddpi(this.buscar).subscribe((data) => {
        this.total = data;
      });
    }
    if (this.esdpeic) {
      this._usuariosService.cantidaddpeic(this.buscar).subscribe((data) => {
        this.total = data;
      });
    }
    if (this.esreactivatic) {
      this._usuariosService.cantidadreactivatic(this.buscar).subscribe((data) => {
        this.total = data;
      });
    }
  }

  fbuscar() {
    this.pagina = 0;
    this.fdatos();
  }

  fdatos() {
    this.esadmin = this._accesoService.esRolAdmin();
    this.essddpi = this._accesoService.esRolSddpi();
    this.esdpeic = this._accesoService.esRolDpeic();
    this.esreactivatic = this._accesoService.esRolReactivatic();
    if (this.esadmin) {
      this._usuariosService.datos(this.pagina, this.cantidad, this.buscar).subscribe((data) => {
        this.fcantidad();
        this.datos = data;
      });
    }
    if (this.essddpi) {
      this._usuariosService.datossddpi(this.pagina, this.cantidad, this.buscar).subscribe((data) => {
        this.fcantidad();
        this.datos = data;
      });
    }
    if (this.esdpeic) {
      this._usuariosService.datosdpeic(this.pagina, this.cantidad, this.buscar).subscribe((data) => {
        this.fcantidad();
        this.datos = data;
      });
    }
    if (this.esreactivatic) {
      this._usuariosService.datosreactivatic(this.pagina, this.cantidad, this.buscar).subscribe((data) => {
        this.fcantidad();
        this.datos = data;
      });
    }
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

  getFormControls(): string[] {
    return Object.keys(this.formulario.controls);
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
        user.persona.tipogenero?.idtipogenero,
        [
          Validators.required
        ]
      ],
      idtipodocumento: [
        user.persona.tipodocumento?.idtipodocumento,
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
        user.persona.tipoextension?.idtipoextension,
        [
          Validators.required
        ]
      ],
      direccion: [
        user.persona.direccion,
        [
          Validators.required,
          Validators.pattern('^[a-zA-Z0-9\u00f1\u00d1\\s.,#-]+$'),
          Validators.maxLength(255)
        ]
      ],
      telefono: [
        user.persona.telefono,
        [
          Validators.pattern('^[0-9]+$'),
          Validators.maxLength(15)
        ],
      ],
      celular: [
        user.persona.celular,
        [
          Validators.required,
          Validators.pattern('^[0-9]+$'),
          Validators.maxLength(15)
        ],
      ],
      correo: [
        user.persona.correo,
        [
          Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$'),
          Validators.maxLength(255)
        ],
      ],
      usuario: [
        user.usuario,
        [
          Validators.required,
          Validators.pattern('^[a-zA-Z0-9\u00f1\u00d1]+$'),
          Validators.maxLength(10)
        ]
      ],
      clave: [
        user.clave ? '**********' : '',
        [
          Validators.required,
          Validators.minLength(8),
          Validators.maxLength(20)
        ]
      ],
      idrol: [
        user.rol.idrol,
        [
          Validators.required
        ]
      ],
      idcargo: [
        user.cargo?.idcargo,
        [
          Validators.required
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

  get f() {
    return this.formulario.controls;
  }

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
    this.formulario.get(controlName)?.setValue(input.toUpperCase(), { emitEvent: false });
  }

  fadicionar(content: any) {
    this.estado = 'Adicionar';
    this.user = new Usuarios();
    this.user.persona = new Personas();
    this.user.rol = new Roles();
    this.goToStep(1);
    this.fformulario(this.user);
    this._modalService.open(content,
      {
        size: 'lg',
        scrollable: true
      }
    );
  }

  fmodificar(id: number, content: any) {
    this.estado = 'Modificar';
    this.goToStep(1);
    this._usuariosService.dato(id).subscribe((data) => {
      this.user = data;
      this.fformulario(this.user, true);
      this.fcargo(data.rol.idrol);
      this._modalService.open(content,
        {
          size: 'lg',
          scrollable: true
        }
      );
    });
  }

  fver(id: number, content: any) {
    this.estado = 'Ver';
    this._usuariosService.dato(id).subscribe((data) => {
      this.user = data;
      this.fformulario(this.user);
      this.fdescargar('usuarios');
      this._modalService.open(content,
        {
          size: 'lg',
          scrollable: true
        }
      );
    });
  }

  feliminar(id: number) {
    swal
      .fire({
        title: 'Confirmar eliminación',
        text: '¿Realmente quieres eliminar este usuario? Esta acción no se puede revertir.',
        icon: 'warning',
        showCancelButton: true,
        cancelButtonText: 'No, mantener usuario',
        confirmButtonText: 'Sí, eliminar',
        customClass: {
          confirmButton: 'btn btn-success rounded-pill mr-3',
          cancelButton: 'btn btn-secondary rounded-pill',
        },
        buttonsStyling: false,
      })
      .then((result) => {
        if (result.value) {
          // this._usuariosService.eliminar(id).subscribe((data) => {
          //   this.fdatos();
          //   this._toast.success('Usuario eliminado correctamente.', 'Error en la carga');
          // });
          swal.fire('Error', 'Procedimiento NO autorizado, por favor contacte al administrador', 'error');
          this._toast.error('', 'Error de eliminación');
        }
      });
  }

  fcambiarestado(idusuario: number, estado: boolean){
    swal.fire({
      title: estado ? 'Está seguro de deshabilitar?' : 'Está seguro de habilitar?',
      icon: 'warning',
      text: estado ? 'El usuario no podrá acceder al sistema.' : 'El usuario podrá acceder al sistema.',
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
        this._usuariosService.cambiarestado({ idusuario, estado }).subscribe(
          (response) => {
            this.fdatos();
            //swal.fire('Cambio realizado', 'El estado del usuario ha sido cambiado con éxito.', 'success');
            this._toast.success('', 'Operación exitosa');
          },
          (error) => {
            //swal.fire('Error', 'Hubo un problema al intentar cambiar el estado del usuario.', 'error');
            this._toast.error('', 'Error de operación');
          }
        );
      }
    });
  }

  faceptar(): void {
    function toUpperCaseDefined(value: string | undefined): string {
      return value ? value.toUpperCase() : '';
    }
    this.submitted = true;

    this.dato = new Personas();
    this.dato.usuario = new Usuarios();
    this.dato.rol = new Roles();

    this.dato.idpersona = this.user.persona.idpersona;
    this.dato.primerapellido = toUpperCaseDefined(this.formulario.value.primerapellido);
    this.dato.segundoapellido = toUpperCaseDefined(this.formulario.value.segundoapellido);
    this.dato.primernombre = toUpperCaseDefined(this.formulario.value.primernombre);
    this.dato.idtipogenero = this.formulario.value.idtipogenero;
    this.dato.idtipodocumento = this.formulario.value.idtipodocumento;
    this.dato.dip = this.formulario.value.dip;
    this.dato.complementario = toUpperCaseDefined(this.formulario.value.complementario);
    this.dato.idtipoextension = this.formulario.value.idtipoextension;
    this.dato.direccion = toUpperCaseDefined(this.formulario.value.direccion);
    this.dato.telefono = this.formulario.value.telefono;
    this.dato.celular = this.formulario.value.celular;
    this.dato.correo = this.formulario.value.correo;
    this.dato.usuario.idusuario = this.user.idusuario;
    this.dato.usuario.usuario = this.formulario.value.usuario;
    this.dato.usuario.clave = this.formulario.value.clave;
    this.dato.usuario.idcargo = this.formulario.value.idcargo;
    this.dato.rol.idrol = this.formulario.value.idrol;

    console.log(this.dato);

    if (this.estado === 'Modificar') {
      this._personasService.modificar(this.dato).subscribe(
        (data) => {
          this.fdatos();
          this._modalService.dismissAll();
          swal.fire('Modificación exitosa', 'El dato ha sido modificado con éxito.', 'success');
          this._toast.success('', 'Operación exitosa');
        },
        (error) => {
          swal.fire('Error de modificación', 'Hubo un problema al intentar modificar el dato. Por favor, intenta nuevamente.', 'error');
          this._toast.error('', 'Error de operación');
        }
      );
    } else {
      this._personasService.adicionar4(this.dato).subscribe(
        (data) => {
          this.fdatos();
          this._modalService.dismissAll();
          swal.fire('Registro exitoso', 'El dato ha sido registrado con éxito.', 'success');
          this._toast.success('', 'Operación exitosa');
        },
        (error) => {
          swal.fire('Error de registro', 'Hubo un problema al intentar registrar el dato. Por favor, intenta nuevamente.', 'error');
          this._toast.error('', 'Error de operación');
        }
      );
    }
  }

  fcancelar() {
    this._modalService.dismissAll();
  }

  fdatosXLS() {
    this._usuariosService.datosXLS(this.buscar).subscribe(data => {
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
    this._usuariosService.datosPDF(this.buscar).subscribe(data => {
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

  fseleccionarArchivo(event) {
    this.archivoseleccionado = event.target.files[0];
  }

  // fcargar() {
  //   this._personasService.cargarImagen(this.archivoseleccionado).subscribe(data => {
  //     this._modalService.dismissAll();
  //     this.fdescargar()
  //     swal.fire('Archivo cargado', 'Archivo cargado con exito', 'success')
  //   })
  // }

  // fdescargar() {
  //   this.imagen = null;
  //   this._personasService.descargarImagen().subscribe(data=>{
  //     const objectURL = window.URL.createObjectURL(data);
  //     this.imagen = this._sanitizer.bypassSecurityTrustUrl(objectURL);
  //   })
  // }

  fdescargar(rol: string) {
    if(rol == 'usuarios'){
      this.imagenUsuario = [];
      this._personasService.downloadperfil('usuarios').subscribe((data) => {
        this.imagenUsuario = data;
      });
    }
  }

  sanitizarImagen(data: string, mimeType: string): SafeUrl {
    return this.sanitizer.bypassSecurityTrustUrl(`data:${mimeType};base64,${data}`);
  }

  faceptarcambiarclave(id: number, clave: string) {
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
    })
    .then((result) => {
      if (result.value) {
        this._usuariosService.verificar({ clave: result.value }).subscribe(
          (verificacionResponse) => {
            this._usuariosService.cambiarclave({ idusuario:id, clave: clave }).subscribe(response => {
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
              this.faceptarcambiarclave(id,clave);
            }
          }
        );
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
}
