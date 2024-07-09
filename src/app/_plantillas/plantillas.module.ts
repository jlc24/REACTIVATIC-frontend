import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlantillaComponent } from './plantilla.component';
import { BarrasuperiorComponent } from './barrasuperior/barrasuperior.component';
import { BarralateralComponent } from './barralateral/barralateral.component';
import { BarrainferiorComponent } from './barrainferior/barrainferior.component';



@NgModule({
  declarations: [PlantillaComponent, BarrasuperiorComponent, BarralateralComponent, BarrainferiorComponent],
  imports: [
    CommonModule,
    RouterModule
  ]
})
export class PlantillasModule { }
