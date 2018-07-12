import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, FormArray} from '@angular/forms';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import {BallotService} from '../services/ballot.service';
import {ActivatedRoute, Router} from '@angular/router';
import {Ballot} from '@netvote/core';
import {ToastService} from '../services/toast.service';

import {NgbModal, NgbModalOptions} from '@ng-bootstrap/ng-bootstrap';
import {NgbPanelChangeEvent} from '@ng-bootstrap/ng-bootstrap';

import {BallotDatepickerComponent} from '../ballot-datepicker/ballot-datepicker.component';
import { BallotModalComponent } from '../ballot-modal/ballot-modal.component';

@Component({
  selector: 'ballot-builder',
  templateUrl: './ballot-builder.component.html',
  styleUrls: ['./ballot-builder.component.scss']
})
export class BallotBuilderComponent implements OnInit {

  emptyBallot = {
    ballotNetwork: "ropsten",
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
  newBallot: boolean = true;
  readyToBuild: boolean = false;
  modalText: any;
  deployStatus: string = '';

  constructor(
    private fb: FormBuilder,
    private ballotService: BallotService,
    private route: ActivatedRoute,
    private router: Router,
    private toast: ToastService,
    private modal: NgbModal
    ) {

    this.ballotForm = this.fb.group({      
      ballotType: this.emptyBallot.ballotType,
      ballotNetwork: this.emptyBallot.ballotNetwork,
      ballotTitle: this.emptyBallot.ballotTitle,
      ballotLocation: this.emptyBallot.ballotLocation,
      ballotDate: this.emptyBallot.ballotDate,
      ballotImage: this.emptyBallot.ballotImage,
      ballotInformation: null,
      ballotGroups: this.fb.array([])
    })

    this.setBallot(this.emptyBallot);

    this.ballot = {} as Ballot;
    this.ballot.status = "building";
    this.ballot.isNew = true;

  }

  setBallot(ballot) {

    this.ballotForm = this.fb.group({      
      ballotType: ballot.ballotType,
      ballotNetwork: ballot.ballotNetwork,
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

    this.route.params.subscribe((params) => {

      if (params['id']) {
        this.newBallot = false;
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

  saveBallot(showToast ?: boolean): Promise<any> {

    if (this.ballot.isNew) {

      this.ballot = {
        title: this.ballotForm.value.ballotTitle,
        description: this.ballotForm.value.ballotInformation,
        status: 'building',
        type: this.ballotForm.value.ballotType,
        network: this.ballotForm.value.ballotNetwork,
        json: this.ballotForm.value,
        isNew: false
      } as Ballot;

      // Need to rename a couple of properties until made consistent
      this.ballot.json.ballotImage = "https://netvote.io/wp-content/uploads/2018/03/roswell-ga.jpg";  // TODO: Temp
      this.ballot.json.featuredImage = this.ballot.json.ballotImage;
      this.ballot.json.type = this.ballot.json.ballotType;
      this.ballot.json.description = this.ballot.json.ballotTitle;

      return this.ballotService.createBallot(this.ballot)
        .then((afs_ballot) => {
          
          if(showToast){
            this.toast.success('Ballot: ' + this.ballot.title + ' has been created!', '', {allowHtml: true, tapToDismiss: true });
          }
          
          this.router.navigate([`/ballot-builder/${afs_ballot.id}`]);
          return afs_ballot;
        });

    } else {

      this.ballot.title = this.ballotForm.value.ballotTitle;
      this.ballot.description = this.ballotForm.value.ballotInformation;
      this.ballot.type = this.ballotForm.value.ballotType;
      this.ballot.network = this.ballotForm.value.ballotNetwork;
      this.ballot.json = this.ballotForm.value;      
      this.ballot.json.ballotImage = "https://netvote.io/wp-content/uploads/2018/03/roswell-ga.jpg";  // TODO: Temp
      this.ballot.json.featuredImage = this.ballot.json.ballotImage;
      this.ballot.json.type = this.ballot.json.ballotType;
      this.ballot.json.description = this.ballot.json.ballotTitle;
      this.ballot.isNew = false;

      return this.ballotService.updateBallot(this.ballot)
        .then((afs_ballot) => {

          if(showToast){
            this.toast.info('Ballot has been updated.');
          }

          return afs_ballot;
        });
    }
  }

  deployBallot(ballot: Ballot) {

    let ngbModalOptions: NgbModalOptions = {
      backdrop : 'static',
      keyboard : false,
      centered: true,
      backdropClass: 'nv-modal__bg  nv-modal__bg--dark-gradient',
      windowClass: 'nv-modal'
    };

    const modalRef = this.modal.open(BallotModalComponent, ngbModalOptions);
    modalRef.componentInstance.modalText = 'Ballot "' + this.ballot.title + '" is being deployed to the blockchain!';

    this.ballot.status = "building";
    this.saveBallot(false).then((saved_ballot) =>{
      this.ballot.status = "deploying";
      this.ballotService.deployBallot(this.ballot).then((info) =>{
        
        const observable = this.ballotService.getBallotObservable(info.collection, info.txId);
        observable.subscribe(async (res: any) => {

          if(res.address && res.metadataLocation && res.tx) {
            this.ballot.status = "created";
            this.ballot.electionAddress = res.address;
            this.ballot.ethTxid = res.tx;
            this.ballot.ipfs = res.metadataLocation;
            console.log("NV: Ballot", this.ballot);
            await this.saveBallot(false);
            modalRef.componentInstance.deployStatus = 'complete';
            modalRef.componentInstance.ballotTx = this.ballot.ethTxid;
            // modalRef.componentInstance.ballotLink = `https://demo.netvote.io/vote/?election=${this.ballot.electionAddress}&auth=uport`;
            modalRef.componentInstance.ballotLink = `https://demo.netvote.io/vote/?election=${this.ballot.electionAddress}&auth=lifeid`;
          } else {
            this.ballot.status = "building";
          }
        });

      });
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
    this.saveBallot(true);
    this.readyToBuild = !this.readyToBuild;
  }

}


