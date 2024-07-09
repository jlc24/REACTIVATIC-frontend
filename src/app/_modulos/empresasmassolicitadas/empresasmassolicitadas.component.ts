import { Graficos } from './../../_entidades/graficos';
import { ReportesService } from './../../_aods/reportes.service';
import { Reportes } from './../../_entidades/reportes';
import { Component, OnInit } from '@angular/core';
import { Chart } from "angular-highcharts";

@Component({
  selector: 'app-empresasmassolicitadas',
  templateUrl: './empresasmassolicitadas.component.html',
  styleUrls: ['./empresasmassolicitadas.component.css']
})
export class EmpresasmassolicitadasComponent implements OnInit {

  chart1: Chart;
  series1: Array<Graficos> = [];

  datos: Reportes[];
  titulo:string = 'Empresa mas solicitada';

  constructor(
    private _reportesService: ReportesService
  ) { }

  ngOnInit(): void {
    this.fdatos();
  }

  fdatos() {
    this._reportesService.empresasmassolicitadas().subscribe( data => {
      this.datos = data;
      this.fgraficos(this.datos);
    })
  }

  fgraficos(datos: Reportes[]){
    for (let index = 0; index < datos.length; index++) {
      let serie = new Graficos();
      serie.name = datos[index].entidad;
      serie.y = datos[index].cantidad;
      this.series1.push(serie);
    }
    this.chart1 = new Chart({
      chart: {
        type: 'pie',
        options3d: {
          enabled: true,
          alpha: 45,
          beta: 0
        }
      },
      title: {
        text: ''
      },
      subtitle: {
        text: 'Empresa mas solicitada !!!'
      },
      credits: {
        enabled: false
      },
      exporting: {
        enabled: false
      },
      plotOptions: {
        pie: {
            allowPointSelect: true,
            cursor: 'pointer',
            depth: 35,
            dataLabels: {
                enabled: true,
                format: '{point.name}'
            }
        }
      },
      series: [
        {
          name: 'Cantidad',
          type: 'pie',
          data: this.series1
        }
      ]
    });

  }

}
