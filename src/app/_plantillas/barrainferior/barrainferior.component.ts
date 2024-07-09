import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-barrainferior',
  templateUrl: './barrainferior.component.html',
  styleUrls: ['./barrainferior.component.css']
})
export class BarrainferiorComponent implements OnInit {

  gestion: number = new Date().getFullYear();

  constructor() { }

  ngOnInit(): void {
  }

}
