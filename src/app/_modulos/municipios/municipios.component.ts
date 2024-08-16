import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { MunicipiosService } from 'src/app/_aods/municipios.service';
import { Municipios } from 'src/app/_entidades/municipios';
import swal from 'sweetalert2';
import * as Mapboxgl from 'mapbox-gl';
import { Localidades } from 'src/app/_entidades/localidades';
import { LocalidadesService } from 'src/app/_aods/localidades.service';

@Component({
  selector: 'app-municipios',
  templateUrl: './municipios.component.html',
  styleUrls: ['./municipios.component.css']
})
export class MunicipiosComponent implements OnInit {

  datos: Municipios[];
  dato: Municipios;

  localidades: Localidades[];
  localidad: Localidades;

  pagina:number = 1;
  numPaginas:number = 0;
  cantidad:number = 10;
  buscar:string = '';
  total:number = 0;
  estado:string = '';

  sw: Boolean = false;

  formulario: FormGroup;
  formlocalidad: FormGroup;
  submitted:boolean = false;

  mapa: Mapboxgl.Map;

  modalRefMunicipio: NgbModalRef;
  modalRefLocalidad: NgbModalRef;

  constructor(
    private _municipiosService: MunicipiosService,
    private _localicadesService: LocalidadesService,
    private _fb: FormBuilder,
    private _fbl: FormBuilder,
    private _modalService: NgbModal
  ) { }

  ngOnInit(): void {
    /* this.cargarMapa(-67.11764114037868, -17.96887956250781); */
    this.formulario = this._fb.group({
      municipio: [''],

    });

    this.formlocalidad = this._fbl.group({
      localidad: [''],

    });
    this.fdatos();
  }

  fcantidad() {
    this._municipiosService.cantidad(this.buscar).subscribe((data) => {
      this.total = data;
    });
  }

  fbuscar() {
    this.pagina = 0;
    this.fdatos();
  }

  fdatos() {
    this._municipiosService.datos(this.pagina, this.cantidad, this.buscar).subscribe((data) => {
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

  flistar(){
    this._municipiosService.datosl().subscribe((data) => {
      this.datos = data;
    })
  }

  fformulario(dato: Municipios) {
    this.formulario = this._fb.group({
      municipio: [
        dato.municipio,
        [
          Validators.required,
          Validators.pattern('^[a-zA-ZÀ-ÿ\u00f1\u00d1\\s]+$'),
          Validators.minLength(5),
          Validators.maxLength(50)
        ]
      ],
    });
  }

  fformlocalidad(local: Localidades, disabled: boolean = false){
    this.formlocalidad = this._fbl.group({
      idmunicipio: [
        { value: local.idmunicipio, disabled: disabled },
        [
          Validators.required
        ]
      ],
      localidad: [
        local.localidad,
        [
          Validators.required,
          Validators.pattern('^[a-zA-ZÀ-ÿ\u00f1\u00d1\\s]+$'),
          Validators.minLength(5),
          Validators.maxLength(50)
        ]
      ]
    });
  }

  get f() { return this.formulario.controls; }
  get fl() { return this.formlocalidad.controls }

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
    // this.formulario.get(controlName)?.setValue(input, { emitEvent: false });
    // this.formEnlace.get(controlName)?.setValue(input, { emitEvent: false });
    if (this.formulario.get(controlName)) {
      this.formulario.get(controlName)?.setValue(input.toUpperCase(), { emitEvent: false });
    }

    if (this.formlocalidad.get(controlName)) {
      this.formlocalidad.get(controlName)?.setValue(input.toUpperCase(), { emitEvent: false });
    }
  }

  fadicionar(content: any) {
    this.estado = 'Adicionar';
    this.dato = new Municipios();
    this.fformulario(this.dato);
    this.modalRefMunicipio = this._modalService.open(content, { backdrop: 'static', keyboard: false });
  }

  fmodificar(id: number, content: any) {
    this.estado = 'Modificar';
    this._municipiosService.dato(id).subscribe((data) => {
      this.dato = data;
      this.fformulario(this.dato);
      this.modalRefMunicipio = this._modalService.open(content, { backdrop: 'static', keyboard: false });
    });
  }

  flocalidades(id: number){
    this._localicadesService.localidades(id).subscribe((data) => {
      this.localidades = data;
    })
  }

  fverlocalidades(id: number, content: any){
    this.estado = 'Lista';
    this._municipiosService.dato(id).subscribe((data) => {
      this.dato = data;
      this.flocalidades(id);
      this.modalRefMunicipio = this._modalService.open(content, { backdrop: 'static', keyboard: false, size: 'lg' });
    });
  }

  faddlocal(content: any, munSelec: Municipios){
    this.estado = 'Adicionar';
    this.localidad = new Localidades();
    this.localidad.idmunicipio = munSelec.idmunicipio;
    this.fformlocalidad(this.localidad, true);
    this.modalRefLocalidad = this._modalService.open(content, {
      backdrop: 'static',
      keyboard: false,
    });
  }

  fmodLocal(id: number, content: any){
    this.estado = 'Modificar',
    this._localicadesService.dato(id).subscribe((data) => {
      this.localidad = data;
      this.fformlocalidad(this.localidad, true);
      this.modalRefLocalidad = this._modalService.open(content, {
        backdrop: 'static',
        keyboard: false
      });
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
          swal.fire('Error', 'Procedimiento NO autorizado, por favor contacte al administrador', 'error');
        }
      });
  }

  fcambiarestado(id: number, estado: boolean){

  }

  faceptar(): void {
    this.submitted = true;
    this.dato.municipio = this.formulario.value.municipio.toUpperCase();
    if (this.estado === 'Modificar') {
      this._municipiosService.modificar(this.dato).subscribe((data) => {
        this.fdatos();
        this.modalRefMunicipio.dismiss();
        swal.fire('Dato modificado', 'Dato modificado con exito', 'success');
      });
    } else {
      this._municipiosService.adicionar(this.dato).subscribe((data) => {
        this.fdatos();
        this.modalRefMunicipio.dismiss();
        swal.fire('Dato adicionado', 'Dato modificado con exito', 'success');
      });
    }
  }
  faceptarLocal(): void {
    this.submitted = true;
    this.localidad.idmunicipio = this.formlocalidad.value.idmunicipio;
    this.localidad.localidad = this.formlocalidad.value.localidad.toUpperCase();
    if (this.estado === 'Modificar') {
      this._localicadesService.modificar(this.localidad).subscribe((data) => {
        this.flocalidades(this.formlocalidad.value.idmunicipio);
        this.modalRefLocalidad.dismiss();
        swal.fire('Dato modificado', 'Dato modificado con exito', 'success');
      });
    }else {
      this._localicadesService.adicionar(this.localidad).subscribe((data) => {
        this.flocalidades(this.formlocalidad.value.idmunicipio);
        this.modalRefLocalidad.dismiss();
        swal.fire('Dato adicionado', 'Dato modificado con exito', 'success');
      })
    }
  }

  fcancelar() {
    if (this.modalRefMunicipio) {
      this.modalRefMunicipio.dismiss();
    }
    if (this.modalRefLocalidad) {
      this.modalRefLocalidad.dismiss();
    }
    //this._modalService.dismissAll();
  }
  fcancelarLocal(){
    if (this.modalRefLocalidad) {
      this.modalRefLocalidad.dismiss();
    }
  }

  cargarMapa(lng:number, lat:number){
    console.log('Ingreso 0');
    (Mapboxgl as any).accessToken = 'pk.eyJ1IjoiZ2Ftb2NvdmlkMTkiLCJhIjoiY2tkMGtwOG1jMDI0dDJxbzN3anNrbDV5bCJ9.gRNGjA9j0Ayx9oHy31ZvKA';
    this.mapa = new Mapboxgl.Map({
      container: 'mapa',
      style: 'mapbox://styles/mapbox/streets-v11',
      center:[lng, lat],
      zoom: 13
    });
    this.mapa.addControl(new Mapboxgl.NavigationControl());
    this.mapa.on('click', addMarker);

    function addMarker(e) {
      console.log(e);
    }
  }


}
