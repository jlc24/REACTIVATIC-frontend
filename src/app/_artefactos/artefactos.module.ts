import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CabeceratitulosComponent } from './cabeceratitulos/cabeceratitulos.component';
import { InformacionesComponent } from './informaciones/informaciones.component';



@NgModule({
  declarations: [CabeceratitulosComponent, InformacionesComponent],
  imports: [
    CommonModule
  ],
  exports: [CabeceratitulosComponent, InformacionesComponent]
})
export class ArtefactosModule { }
