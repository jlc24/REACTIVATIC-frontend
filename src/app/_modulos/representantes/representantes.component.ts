import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { PersonasService } from 'src/app/_aods/personas.service';
import { RepresentantesService } from 'src/app/_aods/representantes.service';
import { RolesService } from 'src/app/_aods/roles.service';
import { TiposdocumentosService } from 'src/app/_aods/tiposdocumentos.service';
import { TiposextensionesService } from 'src/app/_aods/tiposextensiones.service';
import { TiposgenerosService } from 'src/app/_aods/tiposgeneros.service';
import { UsuariosService } from 'src/app/_aods/usuarios.service';
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

  pagina:number = 0;
  numPaginas:number = 0;
  cantidad:number = 10;
  buscar:string = '';
  total:number = 0;
  estado:string = '';

  formulario: FormGroup;
  submitted:boolean = false;

  modalRefRep: NgbModalRef;


  constructor(
    private _usuariosService: UsuariosService,
    private _personasService: PersonasService,
    private _representantesService: RepresentantesService,
    private _documentoService: TiposdocumentosService,
    private _extensionesService: TiposextensionesService,
    private _generosService: TiposgenerosService,
    private _rolService: RolesService,
    private _fb: FormBuilder,
    private _modalService: NgbModal
  ) { }

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
        user.persona.idtipogenero,
        [
          Validators.required
        ]
      ],
      idtipodocumento: [
        user.persona.idtipodocumento,
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
        user.persona.idtipoextension,
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
          Validators.pattern('^[a-zA-Z0-9\u00f1\u00d1]+$'),
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
    this.formulario.get(controlName)?.setValue(input.toUpperCase(), { emitEvent: false });
  }

  fadicionar(content: any) {
    this.estado = 'Adicionar';
    this.user = new Usuarios();
    this.user.persona = new Personas();
    this.user.rol = new Roles();
    this.fformulario(this.user);
    this.modalRefRep = this._modalService.open(content, {
      backdrop:'static',
      keyboard: false,
      size: 'lg'
    });
  }

  fmodificar(id: number, content: any) {
    this.estado = 'Modificar';
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

  faceptar(): void {
    function toUpperCaseDefined(value: string | undefined): string {
      return value ? value.toUpperCase() : '';
    }
    this.submitted = true;

    this.dato = new Personas();
    this.dato.usuario = new Usuarios();

    // console.log('Formulario Valores:', this.formulario.value);

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
    // console.log(this.dato);
  }

  fcancelar() {
    this._modalService.dismissAll();
    // for (const field in this.formulario.controls) {
    //   const control = this.formulario.get(field);
    //   if (control && control.invalid) {
    //     console.log(`El campo ${field} no es válido.`);
    //     console.log(control.errors); // Muestra qué errores específicos tiene el control
    //   }
    // }
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
          this._usuariosService.eliminarrep(id).subscribe((data) => {
            this.fdatos();
          });
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

}
