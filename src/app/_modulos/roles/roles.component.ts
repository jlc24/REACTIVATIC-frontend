import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { EnlacesService } from 'src/app/_aods/enlaces.service';
import { EnlacesrolesService } from 'src/app/_aods/enlacesroles.service';
import { RolesService } from 'src/app/_aods/roles.service';
import { Enlaces } from 'src/app/_entidades/enlaces';
import { Enlacesroles } from 'src/app/_entidades/enlacesroles';
import { Roles } from 'src/app/_entidades/roles';

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

  constructor(
    private _rolesService: RolesService,
    private _enlacesService: EnlacesService,
    private _enlacesrolesService: EnlacesrolesService,
    private _fb: FormBuilder,
    config: NgbModalConfig,
    private _modalService: NgbModal
  ) {
    config.backdrop = 'static';
    config.keyboard = false;
  }

  ngOnInit(): void {
    this.fdatos();
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

  fveruser(id: number, content: any){
    this.estado = 'Ver';
    // this._enlacesService.listarEnlaces(id).subscribe((data) => {
    //   this.enlaces = data;
    //   this._modalService.open(content, { size: 'lg'});
    // })
  }

  fverenlace(id: number, content: any){
    this.estado = 'Ver';
    // this._enlacesService.listarEnlaces(id).subscribe((data) => {
    //   this.enlaces = data;
    //   this._modalService.open(content, { size: 'lg'});
    // })
    this._enlacesService.listarEnlaces(id).subscribe(enlaces => {
      this.categorias = this.groupByCategoria(enlaces);
      this._modalService.open(content, { size: 'lg'});
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

  }

  fverificar(idrol: number, idenlace: number){
    // this.enlacerol.idenlace = idenlace;
    // this.enlacerol.idrol = idrol;
    // this._enlacesrolesService.verificar(idrol, idenlace).subscribe(existe => {
    //   if (existe) {
    //     this._enlacesrolesService.modificar(this.enlacerol).subscribe;
    //   }
    // })
  }

  faceptar(){

  }

  faceptarenlace(idrol: number, idenlace: number, estado: boolean){
    alert(idrol + ' ' + idenlace + ' ' + !estado);
  }

  fcancelar() {
    this._modalService.dismissAll();
  }

}
