import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  templateUrl: './index.html',
  styleUrls: ['./style.scss']
})
export class UserEditPageComponent implements OnInit {

  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    
  }

}
