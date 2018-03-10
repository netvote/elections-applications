import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams, ViewController, Platform} from 'ionic-angular';
import {TranslateService} from '@ngx-translate/core';

export interface Slide {
  title: string;
  image: string;
  blurb: string;
}

@IonicPage()
@Component({
  selector: 'page-candidate-info-modal',
  templateUrl: 'candidate-info-modal.html',
})
export class CandidateInfoModalPage {

  candidateMeta: any;
  slides: Slide[];
  dir: string = 'ltr';

  constructor(
    private platform: Platform,
    private viewCtrl: ViewController,
    public navCtrl: NavController,
    public navParams: NavParams,
    public translateService: TranslateService) {

    this.dir = this.platform.dir();

    this.slides = [
      {
        title: 'A temp title of the news article 1',
        image: 'https://placehold.it/200',
        blurb: 'a blurb from the news article'
      },
      {
        title: 'A temp title of the news article 2',
        image: 'https://placehold.it/200',
        blurb: 'a blurb from the news article'
      },
      {
        title: 'A temp title of the news article 3',
        image: 'https://placehold.it/200',
        blurb: 'a blurb from the news article'
      },
      {
        title: 'A temp title of the news article 4',
        image: 'https://placehold.it/200',
        blurb: 'a blurb from the news article'
      },

    ];
  }



  ionViewWillLoad() {

    this.candidateMeta = this.navParams.get('data');

  }

  async closeCandidateInfoModal() {
    this.viewCtrl.dismiss();
  }

}
