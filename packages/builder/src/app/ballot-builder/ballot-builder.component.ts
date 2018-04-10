import {Component, OnInit} from '@angular/core';
import {
  DynamicFormControlModel,
  DynamicCheckboxModel,
  DynamicInputModel,
  DynamicTextAreaModel,
  DynamicRadioGroupModel
} from '@ng-dynamic-forms/core';
import {
  DynamicFormService,
  DynamicFormGroupModel,
  DynamicFormArrayModel,
  DynamicSelectModel,
  //DynamicDatePickerModel
} from '@ng-dynamic-forms/core';
import {FormGroup, FormArray} from '@angular/forms';

import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import {BallotService} from '../services/ballot.service';
import {ActivatedRoute, Router} from '@angular/router';
import {Ballot} from '@netvote/core';
import {ToastService} from '../services/toast.service';

@Component({
  selector: 'ballot-builder',
  templateUrl: './ballot-builder.component.html',
  styleUrls: ['./ballot-builder.component.scss']
})
export class BallotBuilderComponent implements OnInit {

  formModel: DynamicFormControlModel[];
  formGroup: FormGroup;
  showJson: boolean;

  ballot: Ballot = null;
  ready = false;
  newBallot: any;

  ballotItemsModel: DynamicFormArrayModel;
  ballotItemsArray: FormArray;

  ballotSectionsModel: DynamicFormArrayModel;
  ballotGroupsModel: DynamicFormArrayModel;

  constructor(
    private formService: DynamicFormService,
    private ballotService: BallotService,
    private route: ActivatedRoute,
    private router: Router,
    private toast: ToastService) {

  }

  ngOnInit() {

    this.formModel = this.getFormModel();
    this.formGroup = this.formService.createFormGroup(this.formModel);

    this.ballotItemsArray = this.formGroup.get('ballotItems') as FormArray;

    this.formGroup.patchValue({'ballotImage': this.tempBallotImage()});

    this.route.params.subscribe(params => {

      if (params['id']) {

        this.ballot = null;
        this.ready = true;

        this.ballotService.getBallot(params['id'])
          .subscribe((ballot) => {

            const json = ballot.json;
            const model = ballot.json_model;

            if (model)
              this.formModel = this.formService.fromJSON(model);

            this.formGroup = this.formService.createFormGroup(this.formModel);
            this.formGroup.patchValue(ballot.json);

            this.ballot = ballot;
            this.ready = true;

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

  saveBallot() {

    if (!this.ballot) {

      this.ballot = {
        title: this.formGroup.value.ballotTitle,
        description: this.formGroup.value.ballotInformation,
        status: 'building',
        type: this.formGroup.value.type,
        json: this.formGroup.value,
        json_model: JSON.stringify(this.formModel)
      } as Ballot;

      return this.ballotService.createBallot(this.ballot)
        .then((afs_ballot) => {
          this.toast.info('Ballot created.');
          this.router.navigate([`/ballot-builder/${afs_ballot.id}`]);
          return afs_ballot;
        });

    } else {

      this.ballot.title = this.formGroup.value.ballotTitle;
      this.ballot.description = this.formGroup.value.ballotInformation;
      this.ballot.type = this.formGroup.value.type;
      this.ballot.json = this.formGroup.value;
      this.ballot.json_model = JSON.stringify(this.formModel);

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

      const json = this.formGroup.value;

      // const e = new BallotManager();

      // // Deploy the ballot
      // e.createBallot(json, 20).then((res) => {

      //   this.ballot.ipfs = res.ipfs;

      //   this.saveBallot().then(() => {

      //   });

      // });

    });

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

  getFormModel() {

    this.ballotItemsModel = new DynamicFormArrayModel({
      id: 'ballotItems',
      initialCount: 1,
      groupFactory: () => {

        return [
          new DynamicInputModel(
            {
              id: 'itemTitle',
              label: 'Candidate Title',
              hint: '',
              placeholder: 'Enter a title for this candidate',
              validators: {
                required: null,
                maxLength: 100
              },
              errorMessages: {
                required: '{{ label }} is required',
                maxLength: 'Max character count is 100'
              }
            },
            {
              element: {
                control: 'form-control-sm  rounded-0',
                container: ''
              }
            }
          ),

          new DynamicInputModel(
            {
              id: 'itemDescription',
              label: 'Candidate Description',
              hint: '',
              placeholder: 'Enter a description for this candidate',
              validators: {
                maxLength: 100
              },
              errorMessages: {
                required: '{{ label }} is required',
                maxLength: 'Max character count is 100'
              }
            },
            {
              element: {
                control: 'form-control-sm  rounded-0'
              }
            }
          ),
        ];
      }
    },
    {
      element: {
        container: "form-group form-array",
        control: "nv-builder__item-group",
        label: "control-label"
      },
      grid: {
        //container: "nv-builder__item-group",
        //control: ""
      }
    }
  );

    this.ballotSectionsModel = new DynamicFormArrayModel({
      id: 'ballotSections',
      initialCount: 1,
      groupFactory: () => {

        return [
          new DynamicInputModel(
            {
              id: 'sectionTitle',
              label: 'Section Title',
              hint: '',
              placeholder: 'Ex: President, Vice-President, etc.',
              validators: {
                required: null,
                maxLength: 100
              },
              errorMessages: {
                required: '{{ label }} is required',
                maxLength: 'Max character count is 100'
              }
            },
            {
              element: {
                control: 'form-control-sm  rounded-0'
              }
            }
          ),

          new DynamicInputModel(
            {
              id: 'sectionNote',
              label: 'Section Note',
              hint: '',
              placeholder: 'Ex: Vote one',
              validators: {
                maxLength: 100
              },
              errorMessages: {
                required: '{{ label }} is required',
                maxLength: 'Max character count is 100'
              }
            },
            {
              element: {
                control: 'form-control-sm  rounded-0'
              }
            }
          ),

          this.ballotItemsModel
        ];
      }
    },
    {
      element: {
          container: "form-group form-array",
          control: "nv-builder__section-group",
          label: "control-label"
      },
      grid: {
        //container: ""
      }
    }
  );

    this.ballotGroupsModel = new DynamicFormArrayModel(
      {

        id: 'ballotGroups',
        initialCount: 1,
        groupFactory: () => {

          return [
            new DynamicInputModel(
              {
                id: 'groupTitle',
                label: 'Group Title',
                hint: '',
                placeholder: 'Ex: 2020 US Presidential Election',
                validators: {
                  maxLength: 100
                },
                errorMessages: {
                  required: '{{ label }} is required',
                  maxLength: 'Max character count is 100'
                }
              },
              {
                element: {
                  control: 'form-control-sm  rounded-0'
                }
              }
            ),

            this.ballotSectionsModel
          ];
        },
      },
      {
        element: {
            container: "form-group form-array ",
            control: "nv-builder__group",
            label: "control-label"
        },
        grid: {
          //container: "nv-builder__group"
        }
      }
    );

    return [

      new DynamicSelectModel<string>(
        {
          id: 'type',
          label: 'Ballot Type',
          options: Observable.of([
            {
              label: 'Public',
              value: 'public',
            },
            {
              label: 'Private',
              value: 'private'
            },
            {
              label: 'For Registered Voters',
              value: 'registerable'
            },
            {
              label: 'Token-Holder',
              value: 'token-holder'
            }
          ]),
          value: 'registerable'
        },
        {
          element: {
            control: 'form-control-sm  rounded-0'
          }
        }
      ),

      new DynamicInputModel(
        {
          id: 'ballotTitle',
          label: 'Title',
          hint: '',
          placeholder: 'Enter a title for this ballot',
          validators: {
            required: null,
            maxLength: 100
          },
          errorMessages: {
            required: '{{ label }} is required',
            maxLength: 'Max character count is 100'
          }

        },
        {
          element: {
            control: 'form-control-sm  rounded-0'
          }
        }
      ),

      new DynamicInputModel(
        {
          id: 'ballotLocation',
          label: 'Location',
          hint: '',
          placeholder: 'Enter your ballot\'s location if applicable!',
          validators: {
            required: null,
            maxLength: 100
          },
          errorMessages: {
            required: '{{ label }} is required',
            maxLength: 'Max character count is 100'
          }
        },
        {
          element: {
            control: 'form-control-sm  rounded-0'
          }
        }
      ),

      new DynamicInputModel(
        {
          id: 'ballotDate',
          label: 'Start Date',
          inputType: 'date',          
          placeholder: 'Enter your ballot\'s start Date',
        },
        {
          element: {
            control: 'form-control-sm  rounded-0'
          }
        }
      ),

      new DynamicInputModel(
        {
          id: 'ballotImage',
          label: 'Image',
          inputType: 'file'   // https://gist.github.com/StephenFluin/6c63bb45e76629e79da08d3ac0472834
        },
        {
          element: {
            control: 'form-control-file  rounded-0'
          }
        }
      ),

      new DynamicTextAreaModel(
        {
          id: 'ballotInformation',
          label: 'Details',
          hint: '',
          placeholder: 'Enter a detailed description for your voters',
          validators: {
            maxLength: 250
          },
          errorMessages: {
            maxLength: 'Max character count is 100'
          }
        },
        {
          element: {
            control: 'form-control-sm  rounded-0'
          }
        }
      ),

      this.ballotGroupsModel

    ];
  }

  insertItem(groupModel: any, context: DynamicFormArrayModel, index: number) {

    const path = this.formService.getPath(context);

    const array = this.formGroup.get(path) as FormArray;

    this.formService.insertFormArrayGroup(index, array, context);

  }

  removeItem(context: DynamicFormArrayModel, index: number) {

    const path = this.formService.getPath(context);

    const array = this.formGroup.get(path) as FormArray;

    this.formService.removeFormArrayGroup(index, array, context);

  }

}


