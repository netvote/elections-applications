import {Component, OnInit} from '@angular/core';
import {FormGroup, FormControl, FormArray, FormBuilder, Validators} from '@angular/forms';

import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import {BallotService} from '../services/ballot.service';
import {ActivatedRoute, Router} from '@angular/router';
import {Ballot} from '@netvote/core';
import {ToastService} from '../services/toast.service';


@Component({
  selector: 'build-ballot',
  templateUrl: './build-ballot.component.html',
  styleUrls: ['./build-ballot.component.css']
})

export class BuildBallotComponent implements OnInit {

  ballot: Ballot = null;
  ready = false;
  newBallot: any;

  buildBallotForm: FormGroup;

  objectProps;

  constructor(private fb: FormBuilder,
    private ballotService: BallotService,
    private route: ActivatedRoute,
    private router: Router,
    private toast: ToastService) {
  }

  onFileChange($event) {
    const ballotImageFile = $event.target.files[0];
    this.buildBallotForm.controls.ballotImage.setValue(ballotImageFile ? ballotImageFile.name : '');
  }

  ngOnInit() {

    this.route.params.subscribe(params => {

      if (!params['id']) {

        this.ballot = null;
        this.ready = true;

        this.buildBallotForm = this.fb.group({
          ballotTitle: '',
          ballotLocation: '',
          ballotDate: '',
          ballotImage: '',
          ballotInformation: '',
          ballotGroups: this.fb.array([])
        });
        this.addBallotGroup();

      } else {

        this.buildBallotForm = this.fb.group({
          ballotTitle: '',
          ballotLocation: '',
          ballotDate: '',
          ballotImage: '',
          ballotInformation: '',
          ballotGroups: this.fb.array([])
        });
        // this.addBallotGroup();

        this.ballotService.getBallot(params['id']).subscribe((ballot) => {

        console.log('the ballot', ballot);

         for (const group of ballot.json.ballotGroups){
          this.getBallotGroup(group);
         }

        this.buildBallotForm.patchValue(Object.assign(this.buildBallotForm.value, ballot.json));

          this.ballot = ballot;
          this.ready = true;

        });

      }

    });

  }

  initBallotGroup() {
    return this.fb.group({
      groupTitle: '',
      ballotSections: this.fb.array([])
    });
  }

  getBallotGroup(group) {
    
    const ballotGroupArray = <FormArray>this.buildBallotForm.controls['ballotGroups'];
    const ballotGroup = this.fb.group({
      groupTitle: group.groupTitle,
      ballotSections: this.getBallotSections(group.ballotSections) // go get the sections
       
    });
    
    ballotGroupArray.push(ballotGroup);

  }

  getBallotSections(sections){
    const ballotSectionsArray = this.fb.array([]);

    for (const section of sections){

      ballotSectionsArray.push(
        this.fb.group({
          sectionTitle: section.sectionTitle,
          sectionTitleNote: section.sectionTitleNote,
          ballotItems: this.getBallotItems(section.ballotItems)
        })
      );
    }

    return ballotSectionsArray;
  }

  getBallotItems(items){
    const ballotItemsArray = this.fb.array([]);

    for (const item of items){
      ballotItemsArray.push(
        this.fb.group({
          itemTitle: item.itemTitle,
          itemDescription: item.itemDescription
        })
      );
    }

    return ballotItemsArray;
  }

  addBallotGroup() {
    const ballotGroupArray = <FormArray>this.buildBallotForm.controls['ballotGroups'];
    const newBallotGroup = this.initBallotGroup();

    ballotGroupArray.push(newBallotGroup);
  }

  removeBallotGroup(idx: number) {
    const ballotGroupsArray = <FormArray>this.buildBallotForm.controls['ballotGroups'];
    ballotGroupsArray.removeAt(idx);
  }

  saveBallot() {

    if (!this.ballot) {

      this.ballot = {
        title: this.buildBallotForm.value.ballotTitle,
        description: this.buildBallotForm.value.ballotInformation,
        status: 'building',
        type: 'registerable',               // TODO: Add dropdown to UI 
        json: this.buildBallotForm.value
      } as Ballot;

      return this.ballotService.createBallot(this.ballot)
        .then((afs_ballot) => {
          this.toast.info('Ballot created.');
          this.router.navigate([`/build-ballot/${afs_ballot.id}`]);
          return afs_ballot;
        });

    } else {

      this.ballot.title = this.buildBallotForm.value.ballotTitle;
      this.ballot.description = this.buildBallotForm.value.ballotInformation;
      this.ballot.json = this.buildBallotForm.value;

      return this.ballotService.updateBallot(this.ballot)
        .then((afs_ballot) => {
          this.toast.info('Ballot updated.');
          return afs_ballot;
        });
    }
  }

  activateBallot() {

    // First save the ballot
    this.saveBallot().then((afs_ballot) => {

      const json = this.buildBallotForm.value;

      //const e = new BallotManager();

      // Deploy the ballot
      // e.createBallot(json, 20).then((res) => {

      //   console.log(this.ballot);

      //   console.log('success', res.ipfs);

      //   this.ballot.ipfs = res.ipfs;

      //   this.saveBallot().then(() => {

      //     console.log('ipfs set on ballot');

      //   });

      // });

    });

  }

  validateBallot(json: any): boolean {

    // TODO: Define real rules here
    return true;

  }

}
