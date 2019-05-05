import {Component, OnInit} from '@angular/core';
import * as $ from 'jquery';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {

  constructor() {
  }

  ngOnInit() {
    $(window).resize(function () {
      if (window.innerWidth < 768) {
        $('#shu').hide();
      } else {
        $('#shu').show();
      }
    });
  }
}
