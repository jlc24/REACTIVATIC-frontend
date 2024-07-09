import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { AccesoService } from 'src/app/_aods/acceso.service';

@Component({
  selector: 'app-barrasuperior',
  templateUrl: './barrasuperior.component.html',
  styleUrls: ['./barrasuperior.component.css']
})
export class BarrasuperiorComponent implements OnInit {

  constructor(
    private _accesoService: AccesoService,
    private _ruta: Router
  ) { }

  ngOnInit(): void {
  }

  fsalir() {
    this._accesoService.cerrarSesion();
    this._ruta.navigate(['acceso']);
  }

}
