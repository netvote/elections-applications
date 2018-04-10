import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormArray, FormBuilder } from '@angular/forms';

@Component({
  selector: 'ballot-group-section',
  templateUrl: './ballot-section.component.html',
  styleUrls: ['./ballot-section.component.css']
})
export class BallotSectionComponent{

  @Input('group') ballotSectionGroup: FormGroup;

  constructor(private fb: FormBuilder) { }

  addBallotItem() {
    const ballotItemsArray = <FormArray>this.ballotSectionGroup.controls['ballotItems'];
    const newBallotItem = this.initBallotItem();

    ballotItemsArray.push(newBallotItem);
  }

  removeBallotItem(idx: number) {
      const ballotItemsArray = <FormArray>this.ballotSectionGroup.controls['ballotItems'];
      ballotItemsArray.removeAt(idx);
  }

  initBallotItem() {
    return this.fb.group({
        itemTitle: '',
        itemDescription: ''
    });
  }
}