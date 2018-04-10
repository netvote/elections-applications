import {Component, Input} from '@angular/core';
import {FormGroup, FormArray, FormBuilder} from '@angular/forms';

@Component({
    selector: 'ballot-group',
    templateUrl: './ballot-group.component.html',
    styleUrls: ['./ballot-group.component.css']
})
export class BallotGroupComponent {

    @Input('group') ballotGroup: FormGroup;

    constructor(private fb: FormBuilder) {}

    addBallotSection() {
        const ballotSectionsArray = <FormArray>this.ballotGroup.controls['ballotSections'];
        const newBallotSection = this.initBallotSection();

        ballotSectionsArray.push(newBallotSection);
    }

    removeBallotSection(idx: number) {
        const ballotSectionsArray = <FormArray>this.ballotGroup.controls['ballotSections'];
        ballotSectionsArray.removeAt(idx);
    }

    initBallotSection() {
        return this.fb.group({
            sectionTitle: '',
            sectionTitleNote: '',
            ballotItems: this.fb.array([])
        });
    }
}
