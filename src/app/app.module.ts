import { E404Component } from './e404/e404.component';
import { PlantillasModule } from './_plantillas/plantillas.module';
import { BrowserModule } from '@angular/platform-browser';
import { LOCALE_ID, NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AccesoComponent } from './acceso/acceso.component';

import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule, NgbAlertModule } from '@ng-bootstrap/ng-bootstrap';
import { CatalogoComponent } from './catalogo/catalogo.component';
import { RegistrosComponent } from './registros/registros.component';
import { ToastrModule } from 'ngx-toastr';
import localeEsBo from '@angular/common/locales/es-BO';
import { registerLocaleData } from '@angular/common';
import { DetalleComponent } from './catalogo/detalle/detalle.component';
registerLocaleData(localeEsBo,  'es-Bo');

@NgModule({
  declarations: [
    AppComponent,
    AccesoComponent,
    E404Component,
    CatalogoComponent,
    RegistrosComponent,
    DetalleComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    PlantillasModule,
    NgbModule,
    NgbAlertModule,
    ReactiveFormsModule,
    ToastrModule.forRoot(),
    FormsModule
  ],
  providers: [{ provide: LOCALE_ID, useValue: 'es-Bo' }],
  bootstrap: [AppComponent]
})
export class AppModule { }
