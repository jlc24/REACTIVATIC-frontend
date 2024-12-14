import { Component, OnInit } from '@angular/core';
import { BeneficiosService } from 'src/app/_aods/beneficios.service';
import { BeneficiosempresasService } from 'src/app/_aods/beneficiosempresas.service';
import { TradesService } from 'src/app/_aods/trades.service';
import { RUTA } from 'src/app/_config/application';
import { Beneficios } from 'src/app/_entidades/beneficios';
import { Beneficiosempresas } from 'src/app/_entidades/beneficiosempresas';
import { Negocios } from 'src/app/_entidades/negocios';

@Component({
  selector: 'app-lobby',
  templateUrl: './lobby.component.html',
  styleUrls: ['./lobby.component.css']
})
export class LobbyComponent implements OnInit {

  ruta = `${RUTA}/catalogos/descargarempresa/`;

  beneficio: Beneficios;
  beneficiosempresas: Beneficiosempresas[];
  negocios: Negocios[];
  negocio: Negocios;

  buscar: string;

  constructor(
    private _beneficiosService: BeneficiosService,
    private _beneficiosempresasService: BeneficiosempresasService,
    private _tradesService: TradesService,
  ) { }

  ngOnInit(): void {
    this.fnegocios();
    this.fdatos();
    this.fbeneficiosempresas();
  }

  fnegocios(){
    this._beneficiosService.negocios().subscribe((data) => {
      this.beneficio = data;
    });
  }

  fdatos(){
    this._tradesService.datos(this.buscar, this.beneficio.idbeneficio.toString()).subscribe(data => {
      this.negocios = data;
    });
  }

  fbeneficiosempresas(){
    this._beneficiosempresasService.datosl(this.beneficio.idbeneficio).subscribe(data => {
      this.beneficiosempresas = data;
    });
  }

}
