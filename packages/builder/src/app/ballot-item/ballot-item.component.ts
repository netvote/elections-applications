import { Component, Input, OnInit } from '@angular/core';

import { FormGroup } from '@angular/forms';

@Component({
  selector: 'ballot-item',
  templateUrl: './ballot-item.component.html',
  styleUrls: ['./ballot-item.component.css']
})
export class BallotItemComponent implements OnInit {

  @Input('group') ballotItemGroup: FormGroup;

  constructor() { }

  ngOnInit() {
  }

}