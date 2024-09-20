import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { AccesoService } from 'src/app/_aods/acceso.service';
import { EnlacesService } from 'src/app/_aods/enlaces.service';
import { EnlacesrolesService } from 'src/app/_aods/enlacesroles.service';
import { PersonasService } from 'src/app/_aods/personas.service';
import { RolesService } from 'src/app/_aods/roles.service';
import { Enlaces } from 'src/app/_entidades/enlaces';
import { Enlacesroles } from 'src/app/_entidades/enlacesroles';
import { Personas } from 'src/app/_entidades/personas';
import { Roles } from 'src/app/_entidades/roles';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-roles',
  templateUrl: './roles.component.html',
  styleUrls: ['./roles.component.css']
})
export class RolesComponent implements OnInit {
  roles: Roles[];
  rol: Roles;

  enlaces: Enlaces[];
  enlacerol: Enlacesroles;
  enlace: Enlaces;
  personas: Personas[];

  categorias: any[] = [];

  pagina: number = 1;
  numPaginas: number = 0;
  cantidad: number = 10;
  buscar: string = '';
  total: number = 0;
  estado: string = '';

  formulario: FormGroup;
  submitted: boolean = false;

  existe: boolean;

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
    private _rolesService: RolesService,
    private _enlacesService: EnlacesService,
    private _enlacesrolesService: EnlacesrolesService,
    private _personasService: PersonasService,
    private _accesoService: AccesoService,
    private _fb: FormBuilder,
    config: NgbModalConfig,
    private _modalService: NgbModal,
    private _toast: ToastrService
  ) {
    config.backdrop = 'static';
    config.keyboard = false;
  }

  ngOnInit(): void {
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

  fbuscar() {
    this.pagina = 0;
    this.fdatos();
  }

  fcantidad(){
    this._rolesService.cantidad(this.buscar).subscribe((data) => {
      this.total = data;
    });
  }

  fdatos(){
    this._rolesService.datos(this.pagina, this.cantidad, this.buscar).subscribe((data) => {
      this.fcantidad();
      this.roles = data;
    })
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

  fformulario(rol: Roles, disabled: boolean = false){
    this.formulario = this._fb.group({
      rol: [
        rol.rol,
        [
          Validators.required,
          Validators.pattern('^[a-zA-ZÀ-ÿ\u00f1\u00d1_]+$'),
          Validators.minLength(5),
          Validators.maxLength(50)
        ]
      ],
      nombrerol: [
        rol.nombrerol,
        [
          Validators.required,
          Validators.pattern('^[a-zA-ZÀ-ÿ\u00f1\u00d1\\s]+$'),
          Validators.minLength(5),
          Validators.maxLength(50)
        ]
      ]
    })
  }

  get f() {
    return this.formulario.controls;
  }

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
    this.formulario.get(controlName)?.setValue(input.toUpperCase(), { emitEvent: false });
  }

  fadicionar(content: any) {
    this.estado = 'Adicionar';
    this.rol = new Roles();
    this.fformulario(this.rol);
    this._modalService.open(content);
  }

  flistusser(id: number){
    this._personasService.obtenerpersonasRol(id).subscribe((data) => {
      this.personas = data;
    })
  }

  fveruser(id: number, content: any){
    this.estado = 'Ver';
    this._rolesService.dato(id).subscribe((data) => {
      this.rol = data;
      this.flistusser(id);
      this._modalService.open(content, { size: 'lg'});
    })
  }

  fenlaces(id:number){
    this._enlacesService.listarEnlaces(id).subscribe(enlaces => {
      this.categorias = this.groupByCategoria(enlaces);
    });
  }

  fverenlace(id: number, content: any){
    this.estado = 'Ver';
    this._rolesService.dato(id).subscribe((data) => {
      this.rol = data;
      this.fenlaces(id);
      this._modalService.open(content,
        {
          size: 'lg',
          scrollable: true
        }
      );
    });
  }

  groupByCategoria(enlaces: any[]): any[] {
    const grouped = enlaces.reduce((acc, enlace) => {
      const categoria = enlace.categoria;
      if (!acc[categoria.idcategoria]) {
        acc[categoria.idcategoria] = { categoria, enlaces: [] };
      }
      acc[categoria.idcategoria].enlaces.push(enlace);
      return acc;
    }, {});

    return Object.values(grouped);
  }

  fmodificar(id: number, content: any){
    this.estado = 'Modificar';
    this._rolesService.dato(id).subscribe((data) => {
      this.rol = data;
      this.fformulario(this.rol, true);
      this._modalService.open(content);
    })
  }

  feliminar(id: number){
    Swal.fire({
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
        Swal.fire('Error', 'Procedimiento NO autorizado, por favor contacte al Administrador', 'error');
      }
    });
  }

  faceptar(): void{
    this.submitted = true;
    this.rol.rol = this.formulario.value.rol;
    this.rol.nombrerol = this.formulario.value.nombrerol;

    if (this.estado === 'Modificar') {
      this._rolesService.modificar(this.rol).subscribe(data => {
        this.fdatos();
        this._modalService.dismissAll();
        Swal.fire('Exito', 'Rol modificado correctamente', 'success');
      });
    }else{
      this._rolesService.adicionar(this.rol).subscribe(data => {
        this.fdatos();
        this._modalService.dismissAll();
        Swal.fire('Exito', 'Rol adicionado correctamente', 'success');
      });
    }
  }


  faceptarenlace(idrol: number, idenlace: number, event: Event) {
    const estado = (event.target as HTMLInputElement).checked;
    this.enlacerol = new Enlacesroles();

    this.enlacerol.idenlace = idenlace;
    this.enlacerol.idrol = idrol;

    if (estado) {
      this._enlacesrolesService.adicionar(this.enlacerol).subscribe({
        next: () => {
          this.fenlaces(idrol);
          //Swal.fire('Exito', 'Enlace adicionado exitosamente', 'success');
          this._toast.success('Enlace adicionado exitosamente','Hecho');
        },
        error: () => {
          //Swal.fire('Error', 'No se pudo adicionar el enlace-rol', 'error');
          this._toast.error('No se pudo adicionar el enlace-rol','Error');
        }
      });
    } else {
      this._enlacesrolesService.eliminar(this.enlacerol).subscribe({
        next: () => {
          this.fenlaces(idrol);
          //Swal.fire('Exito', 'Enlace eliminado exitosamente', 'success');
          this._toast.success('Enlace eliminado exitosamente','Hecho');
        },
        error: () => {
          //Swal.fire('Error', 'No se pudo eliminar el enlace-rol', 'error');
          this._toast.error('No se pudo eliminar el enlace-rol','Error');
        }
      });
    }
  }

  fcancelar() {
    this._modalService.dismissAll();
  }

}
