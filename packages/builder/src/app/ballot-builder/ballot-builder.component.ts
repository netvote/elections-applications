import {Component, OnInit} from '@angular/core';

import {FormBuilder, FormGroup, FormArray} from '@angular/forms';

import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import {BallotService} from '../services/ballot.service';
import {ActivatedRoute, Router} from '@angular/router';
import {Ballot} from '@netvote/core';
import {ToastService} from '../services/toast.service';

import {NgbPanelChangeEvent} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'ballot-builder',
  templateUrl: './ballot-builder.component.html',
  styleUrls: ['./ballot-builder.component.scss']
})
export class BallotBuilderComponent implements OnInit {
     
  // TEST MODEL
  data = {
    bMeta: {
      bName: '',
      bDescription: '',
      bStartTime: ''
    },
    bGroups: [
      {
        bGroup: "example group",
        sections: [
          {
            sectionName: "example section",
            items: [
              {
                itemName: "example item"
              }
            ]
          }
        ]
      }
    ]
  }

  myForm: FormGroup

  showJson: boolean;

  ballot: Ballot = null;
  ready = false;
  newBallot: any;

  constructor(
    private fb: FormBuilder,
    private ballotService: BallotService,
    private route: ActivatedRoute,
    private router: Router,
    private toast: ToastService) {


    this.myForm = this.fb.group({
      bName: this.data.bMeta.bName,
      bGroups: this.fb.array([])
    })
  
    this.setBgroups();

  }

  // Watch for accordion events
  public beforeChange($event: NgbPanelChangeEvent) {

    // Stop panel toggle
    if ($event.panelId === 'sectionPanel-1') {
      //$event.preventDefault();
    }
  };

  // UI actions on each Group, Section, Item (Delete, etc.)
  async toggleActions(e, target: any) {
    e.stopPropagation();

    target.actionsActive = !target.actionsActive;
  }

  addNewbGroup() {
    let control = <FormArray>this.myForm.controls.bGroups;
    control.push(
      this.fb.group({
        bGroup: [''],
        sections: this.fb.array([ this.createSection() ])
      })
    )
  }

  createSection(): FormGroup {
    return this.fb.group({
      sectionName: 'adadsf',
      items: this.fb.array([ this.createItem() ])
    });
  }

  createItem(): FormGroup {
    return this.fb.group({
      itemName: 'zzz'
    });
  }

  deleteBgroup(e, index) {
    e.preventDefault();
    let control = <FormArray>this.myForm.controls.bGroups;
    control.removeAt(index)
  }

  addNewSection(control) {
    control.push(
      this.fb.group({
        sectionName: [''],
        items: this.fb.array([ this.createItem() ])
      }))
  }

  addNewItem(control) {
    control.push(
      this.fb.group({
        itemName: ['newbie'],
        items: this.fb.array([])
      }))
  }

  // deleteBallotPart(control, index) {

  //   if(!control){
  //     let control = <FormArray>this.myForm.controls.bGroups;
  //     control.removeAt(index)
  //   }
  //   else{
  //     control.removeAt(index)
  //   }
  // }

  deleteSection(e, control, index) {
    e.preventDefault();
    control.removeAt(index)
  }

  deleteItem(e, control, index) {
    e.preventDefault();
    control.removeAt(index)
  }

  setBgroups() {
    let control = <FormArray>this.myForm.controls.bGroups;
    this.data.bGroups.forEach(x => {
      control.push(this.fb.group({ 
        bGroup: x.bGroup, 
        sections: this.setSections(x)
      }))
    })
  }

  setSections(x) {
    let arr = new FormArray([])
    x.sections.forEach(y => {
      arr.push(this.fb.group({ 
        sectionName: y.sectionName,
        items: this.setItems(y)
      }))
    })
    return arr;
  }

  setItems(y) {
    let arr = new FormArray([])
    y.items.forEach(z => {
      arr.push(this.fb.group({ 
        itemName: z.itemName 
      }))
    })
    return arr;
  }



  ngOnInit() {

    this.route.params.subscribe(params => {

      if (params['id']) {

        this.ballot = null;
        this.ready = true;

        this.ballotService.getBallot(params['id'])
          .subscribe((ballot) => {

            const json = ballot.json;

            this.ballot = ballot;
            this.ready = true;
            console.log(this.ballot);
          });
      }

    });

  }

  tempBallotImage() {

    const path = '/assets/temp/';

    const tempImages = [
      'test-image-1.jpg',
      'test-image-2.jpg',
      'test-image-3.jpg',
      'test-image-4.jpg',
      'test-image-5.jpg',
      'test-image-6.jpg'
    ];

    const randomImage = tempImages[Math.floor(Math.random() * tempImages.length)];

    const randomImagePath = path + randomImage;

    return randomImagePath;

  }

  toggleShowJson() {
    this.showJson = !this.showJson;
  }

  // saveBallot() {

  //   if (!this.ballot) {

  //     this.ballot = {
  //       title: this.formGroup.value.ballotTitle,
  //       description: this.formGroup.value.ballotInformation,
  //       status: 'building',
  //       type: this.formGroup.value.type,
  //       json: this.formGroup.value,
  //       json_model: JSON.stringify(this.formModel)
  //     } as Ballot;

  //     return this.ballotService.createBallot(this.ballot)
  //       .then((afs_ballot) => {
  //         this.toast.info('Ballot created.');
  //         this.router.navigate([`/ballot-builder/${afs_ballot.id}`]);
  //         return afs_ballot;
  //       });

  //   } else {

  //     this.ballot.title = this.formGroup.value.ballotTitle;
  //     this.ballot.description = this.formGroup.value.ballotInformation;
  //     this.ballot.type = this.formGroup.value.type;
  //     this.ballot.json = this.formGroup.value;
  //     this.ballot.json_model = JSON.stringify(this.formModel);

  //     return this.ballotService.updateBallot(this.ballot)
  //       .then((afs_ballot) => {
  //         this.toast.info('Ballot updated.');
  //         return afs_ballot;
  //       });
  //   }
  // }

  activateBallot() {

    // First save the ballot
    //this.saveBallot().then((afs_ballot) => {

     // const json = this.formGroup.value;

      // const e = new BallotManager();

      // // Deploy the ballot
      // e.createBallot(json, 20).then((res) => {

      //   this.ballot.ipfs = res.ipfs;

      //   this.saveBallot().then(() => {

      //   });

      // });

    //});

  }

  async testDelete(ballot) {
    
    try {
      // if (ballot.status /*!== 'building'*/) {
      //   throw new Error('You cannot delete a ballot that has already been deployed');
      // }

      await this.ballotService.deleteBallot(ballot);

    } catch (err) {
      this.toast.error(err.message);
    }
  }
    
}


