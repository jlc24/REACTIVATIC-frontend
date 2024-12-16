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
  negocios: Negocios[];
  negocio: Negocios;

  buscarnegocios: string = '';

  constructor(
    private _beneficiosService: BeneficiosService,
    private _tradesService: TradesService,
  ) { }

  ngOnInit(): void {
    this.fnegocios();
  }
  
  fnegocios(){
    this._beneficiosService.negocios().subscribe((data) => {
      this.beneficio = data;
      this.fdatos();
    });
  }

  fbuscarnegocios(){
    this.fdatos();
  }

  fdatos(){
    this._tradesService.datos(this.buscarnegocios, this.beneficio.idbeneficio.toString()).subscribe(data => {
      this.negocios = data;
    });
  }

}
