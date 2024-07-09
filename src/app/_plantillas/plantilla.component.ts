import { Component, OnInit } from '@angular/core';
import * as $ from 'jquery';

@Component({
  selector: 'app-plantilla',
  templateUrl: './plantilla.component.html',
  styleUrls: ['./plantilla.component.css'],
})
export class PlantillaComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {
    $('[data-toggle=sidebar]').click(function (event) {
      event.preventDefault();
      $('.app').toggleClass('sidenav-toggled');
    });

    var treeviewMenu = $('.app-menu');

    $(".app-menu").on('click', "[data-toggle=treeview]", function(){
      event.preventDefault();
      if (!$(this).parent().hasClass('is-expanded')) {
        treeviewMenu
          .find("[data-toggle=treeview]")
          .parent()
          .removeClass('is-expanded');
      }
      $(this).parent().toggleClass('is-expanded');
    });
  }
}
