import { Component, OnInit } from '@angular/core';
import { BeneficiosService } from 'src/app/_aods/beneficios.service';
import { RUTA } from 'src/app/_config/application';
import { Beneficios } from 'src/app/_entidades/beneficios';

@Component({
  selector: 'app-networking',
  templateUrl: './networking.component.html',
  styleUrls: ['./networking.component.css']
})
export class NetworkingComponent implements OnInit {

  ruta = `${RUTA}/catalogos/descargarempresa/`;

  beneficio: Beneficios;

  constructor(
    private _beneficiosService: BeneficiosService,
  ) { }

  ngOnInit(): void {
    this.fnegocios();
  }

  fnegocios(){
    this._beneficiosService.negocios().subscribe((data) => {
      this.beneficio = data;
    });
  }

}
