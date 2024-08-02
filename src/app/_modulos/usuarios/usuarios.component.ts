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

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css'],
})
export class UsuariosComponent implements OnInit {
  datos: Usuarios[];
  dato: Personas;
  documento: Tiposdocumentos[];
  extension: Tiposextensiones[];
  genero: Tiposgeneros[];
  rol: Roles[];

  pagina: number = 0;
  numPaginas: number = 0;
  cantidad: number = 10;
  buscar: string = '';
  total: number = 0;
  estado: string = '';

  formulario: FormGroup;
  submitted: boolean = false;

  esadmin: boolean = false;
  essddpi: boolean = false;
  esreactivatic: boolean = false;

  constructor(
    private _usuariosService: UsuariosService,
    private _personasService: PersonasService,
    private _documentoService: TiposdocumentosService,
    private _extensionesService: TiposextensionesService,
    private _generosService: TiposgenerosService,
    private _accesoService: AccesoService,
    private _rolService: RolesService,
    private _fb: FormBuilder,
    config: NgbModalConfig,
    private _modalService: NgbModal
  ) {
    config.backdrop = 'static';
    config.keyboard = false;
  }

  ngOnInit(): void {
    this.fdatos();
    this.fdocumento();
    this.fextension();
    this.fgenero();
    this.frol();
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
    if (this.esreactivatic) {
      this._rolService.listarreactivatic().subscribe( data => {
        this.rol = data;
      })
    }
  }

  fcantidad() {
    this.esadmin = this._accesoService.esRolAdmin();
    this.essddpi = this._accesoService.esRolSddpi();
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
    this.esreactivatic = this._accesoService.esRolReactivatic();
    if (this.esadmin) {
      this._usuariosService
        .datos(this.pagina, this.cantidad, this.buscar)
        .subscribe((data) => {
          this.fcantidad();
          this.datos = data;
        });
    }
    if (this.essddpi) {
      this._usuariosService
        .datossddpi(this.pagina, this.cantidad, this.buscar)
        .subscribe((data) => {
          this.fcantidad();
          this.datos = data;
        });
    }
    if (this.esreactivatic) {
      this._usuariosService
        .datosreactivatic(this.pagina, this.cantidad, this.buscar)
        .subscribe((data) => {
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

  fformulario(dato: Personas, disabled: boolean = false) {
    this.formulario = this._fb.group({

      primerapellido: [
        dato.primerapellido, 
        [
          Validators.required,
          Validators.pattern('^[a-zA-ZÀ-ÿ\u00f1\u00d1\\s]+$'),
          Validators.maxLength(50)
        ],
      ],
      segundoapellido: [
        dato.segundoapellido,
        [
          Validators.pattern('^[a-zA-ZÀ-ÿ\u00f1\u00d1\\s]+$'),
          Validators.maxLength(50)
        ]
      ],
      primernombre: [
        dato.primernombre, 
        [
          Validators.required,
          Validators.pattern('^[a-zA-ZÀ-ÿ\u00f1\u00d1\\s]+$'),
          Validators.maxLength(50)
        ]
      ],
      idtipogenero: [
        dato.idtipogenero,
        [
          Validators.required
        ]
      ],
      idtipodocumento: [
        dato.idtipodocumento,
        [
          Validators.required
        ]
      ],
      dip: [
        dato.dip, 
        [
          Validators.required,
          Validators.pattern('^[0-9]+$'),
          Validators.maxLength(15)
        ]
      ],
      complementario:[
        dato.complementario,
        [
          Validators.pattern('^[a-zA-Z0-9\u00f1\u00d1]+$'),
          Validators.maxLength(5)
        ]
      ],
      idtipoextension:[
        dato.idtipoextension,
        [
          Validators.required
        ]
      ],
      direccion: [
        dato.direccion, 
        [
          Validators.required,
          Validators.pattern('^[a-zA-Z0-9\u00f1\u00d1\\s.,#-]+$'),
          Validators.maxLength(255)
        ]
      ],
      telefono: [
        dato.telefono, 
        [
          Validators.pattern('^[0-9]+$'),
          Validators.maxLength(15)
        ],
      ],
      celular: [
        dato.celular,
        [
          Validators.required, 
          Validators.pattern('^[0-9]+$'),
          Validators.maxLength(15)
        ],
      ],
      correo: [
        dato.correo,
        [
          Validators.required,
          Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$'),
          Validators.maxLength(255)
        ],
      ],
      usuario: [
        { value: dato.usuario.usuario, disabled: disabled }, 
        [
          Validators.required,
          Validators.pattern('^[a-zA-Z0-9\u00f1\u00d1]+$'),
          Validators.maxLength(10)
        ]
      ],
      clave: [
        { value: dato.usuario.clave ? '**********' : '', disabled: disabled},
        [
          Validators.required,
          Validators.pattern('^[a-zA-Z0-9\u00f1\u00d1]+$'),
          Validators.minLength(8),
          Validators.maxLength(20)
        ]
      ],
      idrol: [
        { value: dato.rol.idrol, disabled: disabled},
        [
          Validators.required
        ]
      ]
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

  // onInputCorreo(event: any, controlName: string, type: 'correo'): void {
  //   let input = event.target.value;
  //   switch (type) {
  //     case 'correo':
  //       input = input.replace(/[^a-zA-Z0-9._%+-@]/g, '');
  //       break;
  //   }
  // }

  fadicionar(content: any) {
    this.estado = 'Adicionar';
    this.dato = new Personas();
    this.dato.usuario = new Usuarios();
    this.dato.rol = new Roles();
    this.fformulario(this.dato);
    this._modalService.open(content, { size: 'lg' });
  }

  fmodificar(id: number, content: any) {
    this.estado = 'Modificar';
    this._personasService.persona(id).subscribe((data) => {
      this.dato = data;
      this.fformulario(this.dato, true);
      this._modalService.open(content, { size: 'lg' });
    });
  }
  fver(id: number, content: any) {
    this.estado = 'Ver';
    this._personasService.persona(id).subscribe((data) => {
      this.dato = data;
      this.fformulario(this.dato);
      this._modalService.open(content, { size: 'lg' });
    });
  }

  feliminar(id: number) {
    swal
      .fire({
        title: 'Estás seguro?',
        icon: 'warning',
        text: 'No podrás revertir el borrado de este dato!',
        showCancelButton: true,
        cancelButtonText: 'Cancelar',
        confirmButtonText: 'Borrar',
      })
      .then((result) => {
        if (result.value) {
          this._usuariosService.eliminar(id).subscribe((data) => {
            this.fdatos();
          });
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
    }).then((result) => {
      if (result.value) {
        this._usuariosService.cambiarestado({ idusuario, estado }).subscribe( response => {
          this.fdatos();
          swal.fire('Cambio realizado', 'El estado del usuario ha sido cambiado con éxito.', 'success');
        });
      }
    }); 
  }

  faceptar(): void {
    function toUpperCaseDefined(value: string | undefined): string {
      return value ? value.toUpperCase() : '';
    }
    this.submitted = true;

    this.dato.primerapellido = toUpperCaseDefined(this.formulario.value.primerapellido);
    this.dato.segundoapellido = toUpperCaseDefined(this.formulario.value.segundoapellido);
    this.dato.primernombre = toUpperCaseDefined(this.formulario.value.primernombre);
    this.dato.idtipogenero = this.formulario.value.idtipogenero;
    this.dato.idtipodocumento = this.formulario.value.idtipodocumento;
    this.dato.dip = this.formulario.value.dip;
    this.dato.complementario = toUpperCaseDefined(this.formulario.value.complementario);
    this.dato.idtipoextension = this.formulario.value.idtipoextension;
    this.dato.direccion = toUpperCaseDefined(this.formulario.value.direccion);
    this.dato.telefono = this.formulario.value.celular;
    this.dato.celular = this.formulario.value.celular;
    this.dato.correo = this.formulario.value.correo;
    this.dato.usuario.usuario = this.formulario.value.usuario;
    this.dato.usuario.clave = this.formulario.value.clave;
    this.dato.rol.idrol = this.formulario.value.idrol;

    if (this.estado === 'Modificar') {
      this._personasService.modificar(this.dato).subscribe((data) => {
        this.fdatos();
        this._modalService.dismissAll();
        swal.fire('Dato modificado', 'Dato modificado con exito', 'success');
      });
    } else {
      this._personasService.adicionar4(this.dato).subscribe((data) => {
        this.fdatos();
        this._modalService.dismissAll();
        swal.fire('Dato adicionado', 'Dato registrado con exito', 'success');
      });
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
}
