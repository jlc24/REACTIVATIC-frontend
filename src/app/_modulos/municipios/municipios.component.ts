import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MunicipiosService } from 'src/app/_aods/municipios.service';
import { Municipios } from 'src/app/_entidades/municipios';
import swal from 'sweetalert2';
import * as Mapboxgl from 'mapbox-gl';

@Component({
  selector: 'app-municipios',
  templateUrl: './municipios.component.html',
  styleUrls: ['./municipios.component.css']
})
export class MunicipiosComponent implements OnInit {

  datos: Municipios[];
  dato: Municipios;

  pagina:number = 0;
  numPaginas:number = 0;
  cantidad:number = 10;
  buscar:string = '';
  total:number = 0;
  estado:string = '';

  sw: Boolean = false;

  formulario: FormGroup;
  submitted:boolean = false;

  mapa: Mapboxgl.Map;


  constructor(
    private _municipiosService: MunicipiosService,
    private _fb: FormBuilder,
    private _modalService: NgbModal
  ) { }

  ngOnInit(): void {
    /* this.cargarMapa(-67.11764114037868, -17.96887956250781); */
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

  fformulario(dato: Municipios) {
    this.formulario = this._fb.group({
      municipio: [dato.municipio, [Validators.required]],
    });
  }

  get f() { return this.formulario.controls; }

  fadicionar(content: any) {
    this.estado = 'Adicionar';
    this.dato = new Municipios();
    this.fformulario(this.dato);
    this._modalService.open(content);
  }

  fmodificar(id: number, content: any) {
    this.estado = 'Modificar';
    this._municipiosService.dato(id).subscribe((data) => {
      this.dato = data;
      this.fformulario(this.dato);
      this._modalService.open(content);
    });
  }

  faceptar(): void {
    this.submitted = true;
    this.dato.municipio = this.formulario.value.municipio.toUpperCase();
    if (this.estado === 'Modificar') {
      this._municipiosService.modificar(this.dato).subscribe((data) => {
        this.fdatos();
        this._modalService.dismissAll();
        swal.fire('Dato modificado', 'Dato modificado con exito', 'success');
      });
    } else {
      this._municipiosService.adicionar(this.dato).subscribe((data) => {
        this.fdatos();
        this._modalService.dismissAll();
        swal.fire('Dato adicionado', 'Dato modificado con exito', 'success');
      });
    }

  }

  fcancelar() {
    this._modalService.dismissAll();
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
