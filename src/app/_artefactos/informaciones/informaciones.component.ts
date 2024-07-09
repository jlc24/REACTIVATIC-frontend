import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-informaciones',
  templateUrl: './informaciones.component.html',
  styleUrls: ['./informaciones.component.css']
})
export class InformacionesComponent implements OnInit {

  @Input() titulo: string;
  @Input() cantidad: string;
  @Input() icono: string;
  @Input() opcion: string;

  constructor() { }

  ngOnInit(): void {
  }

}
