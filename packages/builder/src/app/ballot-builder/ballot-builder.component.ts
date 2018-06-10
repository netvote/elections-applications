import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, FormArray} from '@angular/forms';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import {BallotService} from '../services/ballot.service';
import {ActivatedRoute, Router} from '@angular/router';
import {Ballot} from '@netvote/core';
import {ToastService} from '../services/toast.service';

import {NgbPanelChangeEvent} from '@ng-bootstrap/ng-bootstrap';
import {BallotDatepickerComponent} from '../ballot-datepicker/ballot-datepicker.component';

@Component({
  selector: 'ballot-builder',
  templateUrl: './ballot-builder.component.html',
  styleUrls: ['./ballot-builder.component.scss']
})
export class BallotBuilderComponent implements OnInit {

  emptyBallot = {
    ballotType: "public",
    ballotTitle: "",
    ballotLocation: "",
    ballotDate: "",
    ballotImage: "/assets/img/roswell-ga.jpg",
    ballotInformation: "",
    ballotGroups: [
      {
        groupTitle: "",
        ballotSections: [
          {
            sectionTitle: "",
            sectionNote: "",
            ballotItems: [
              {
                itemTitle: "",
                itemDescription: ""
              }
            ]
          }
        ]
      }
    ]
  }

  ballotForm: FormGroup

  showJson: boolean;

  ballot: Ballot = null;
  ready = false;
  newBallot: any;
  readyToBuild: boolean = false;

  constructor(
    private fb: FormBuilder,
    private ballotService: BallotService,
    private route: ActivatedRoute,
    private router: Router,
    private toast: ToastService) {

    this.ballotForm = this.fb.group({
      ballotType: this.emptyBallot.ballotType,
      ballotTitle: this.emptyBallot.ballotTitle,
      ballotLocation: this.emptyBallot.ballotLocation,
      ballotDate: this.emptyBallot.ballotDate,
      ballotImage: this.emptyBallot.ballotImage,
      ballotInformation: null,
      ballotGroups: this.fb.array([])
    })

    this.setBallot(this.emptyBallot);

  }

  setBallot(ballot) {

    this.ballotForm = this.fb.group({
      ballotType: ballot.ballotType,
      ballotTitle: ballot.ballotTitle,
      ballotLocation: ballot.ballotLocation,
      ballotDate: ballot.ballotDate,
      ballotImage: ballot.ballotImage,
      ballotInformation: null,
      ballotGroups: this.setballotGroups(ballot)
    })

  }

  setballotGroups(ballot): FormArray {
    let groups = new FormArray([]);
    ballot.ballotGroups.forEach(x => {
      groups.push(this.fb.group({
        groupTitle: x.groupTitle,
        ballotSections: this.setSections(x)
      }))
    })
    return groups;
  }

  setSections(ballotGroup): FormArray {
    let sections = new FormArray([])
    ballotGroup.ballotSections.forEach(y => {
      sections.push(this.fb.group({
        sectionTitle: y.sectionTitle,
        sectionNote: y.sectionNote,
        ballotItems: this.setItems(y)
      }))
    })
    return sections;
  }

  setItems(ballotSection): FormArray {
    let items = new FormArray([])
    ballotSection.ballotItems.forEach(z => {
      items.push(this.fb.group({
        itemTitle: z.itemTitle,
        itemDescription: z.itemDescription
      }))
    })
    return items;
  }

  ngOnInit() {

    this.route.params.subscribe(params => {

      if (params['id']) {
        this.ballot = null;
        this.ballotService.getBallot(params['id'])
          .subscribe((ballot) => {
            const json = ballot.json;
            this.ballot = ballot;
            this.readyToBuild = true;
            this.setBallot(ballot.json);
          });
      }

    });

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
  
  // UI actions on to show Section panel dropdown content
  async toggleSectionsPanel(target: any) {
    target.showSectionPanel = !target.showSectionPanel;
  }

  addNewBallotGroup() {
    let control = <FormArray>this.ballotForm.controls.ballotGroups;
    control.push(
      this.fb.group({
        groupTitle: [''],
        ballotSections: this.fb.array([this.createSection()])
      })
    )
  }

  createSection(): FormGroup {
    return this.fb.group({
      sectionTitle: '',
      sectionNote: '',
      ballotItems: this.fb.array([this.createItem()])
    });
  }

  createItem(): FormGroup {
    return this.fb.group({
      itemTitle: '',
      itemDescription: ''
    });
  }

  deleteBallotGroup(e, index) {
    e.preventDefault();
    let control = <FormArray>this.ballotForm.controls.ballotGroups;
    control.removeAt(index)
  }

  addNewSection(ballotSections) {
    ballotSections.push(
      this.fb.group({
        sectionTitle: [''],
        sectionNote: [''],
        ballotItems: this.fb.array([this.createItem()])
      }))
  }

  addNewItem(control) {
    control.push(
      this.fb.group({
        itemTitle: '',
        itemDescription: ''
      }))
  }

  deleteSection(e, control, index) {
    e.preventDefault();
    control.removeAt(index)
  }

  deleteItem(e, control, index) {
    e.preventDefault();
    control.removeAt(index)
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

  saveBallot(): Promise<any> {

    if (!this.ballot) {

      this.ballot = {
        title: this.ballotForm.value.ballotTitle,
        description: this.ballotForm.value.ballotInformation,
        status: 'building',
        type: this.ballotForm.value.ballotType,
        json: this.ballotForm.value
      } as Ballot;

      // Need to rename a couple of properties until made consistent
      this.ballot.json.ballotImage = "https://netvote.io/wp-content/uploads/2018/03/roswell-ga.jpg";
      this.ballot.json.featuredImage = this.ballot.json.ballotImage;
      this.ballot.json.type = this.ballot.json.ballotType;
      this.ballot.json.description = this.ballot.json.ballotTitle;


      // TODO: TEMP
      this.ballot.type = "public";

      return this.ballotService.createBallot(this.ballot)
        .then((afs_ballot) => {
          console.log("adslfafd", afs_ballot);
          this.toast.success('Ballot: ' + this.ballot.title + ' has been created!', '', {allowHtml: true, tapToDismiss: true });
          this.router.navigate([`/ballot-builder/${afs_ballot.id}`]);
          return afs_ballot;
        });

    } else {

      this.ballot.title = this.ballotForm.value.ballotTitle;
      this.ballot.description = this.ballotForm.value.ballotInformation;
      this.ballot.type = this.ballotForm.value.ballotType;
      this.ballot.json = this.ballotForm.value;
      this.ballot.json.ballotImage = "https://netvote.io/wp-content/uploads/2018/03/roswell-ga.jpg";
      this.ballot.json.featuredImage = this.ballot.json.ballotImage;
      this.ballot.json.type = this.ballot.json.ballotType;
      this.ballot.json.description = this.ballot.json.ballotTitle;

      // TODO: TEMP
      this.ballot.type = "public";

      return this.ballotService.updateBallot(this.ballot)
        .then((afs_ballot) => {
          this.toast.info('Ballot has been updated.');
          return afs_ballot;
        });
    }
  }

  deployBallot() {

    this.ballot.status = "building";
    this.saveBallot().then((saved_ballot) =>{
      this.ballotService.deployBallot(this.ballot);
    });

  }

  async testDelete(ballot) {

    try {
      // if (ballot.status /*!== 'building'*/) {
      //   throw new Error('You cannot delete a ballot that has already been deployed');
      // }

      await this.ballotService.deleteBallot(ballot);
    
      this.toast.info('Ballot ' + ballot.title + ' has been deleted.');
      this.router.navigate([`/ballot-builder/`]);
      
    } catch (err) {
      this.toast.error(err.message);
    }
  }

  async toggleReadyToBuild(e) {
    e.preventDefault();
    this.saveBallot();
    this.readyToBuild = !this.readyToBuild;
  }

}


