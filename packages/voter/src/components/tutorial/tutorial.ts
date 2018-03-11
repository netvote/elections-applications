import { Component } from '@angular/core';
import { MenuController, NavController, Platform } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';

export interface Slide {
  title: string;
  description: string;
  image: string;
}

@Component({
  selector: 'tutorial',
  templateUrl: 'tutorial.html'
})
export class TutorialComponent {
  slides: Slide[];
  showSkip = true;
  dir: string = 'ltr';
  moveHeader = false;

  constructor(public navCtrl: NavController, public menu: MenuController, translate: TranslateService, public platform: Platform) {
    this.dir = platform.dir();
    translate.get([
      "TUTORIAL_SLIDE1_TITLE",
      "TUTORIAL_SLIDE1_DESCRIPTION",
      "TUTORIAL_SLIDE2_TITLE",
      "TUTORIAL_SLIDE2_DESCRIPTION",
      "TUTORIAL_SLIDE3_TITLE",
      "TUTORIAL_SLIDE3_DESCRIPTION",
      "TUTORIAL_SLIDE4_TITLE",
      "TUTORIAL_SLIDE4_DESCRIPTION",
      "TUTORIAL_SLIDE5_DESCRIPTION",
    ]).subscribe(
      (values) => {
        
        this.slides = [
          {
            title: values.TUTORIAL_SLIDE1_TITLE,
            description: values.TUTORIAL_SLIDE1_DESCRIPTION,
            image: 'assets/img/nv-tutorial-globe.jpg',
          },
          {
            title: values.TUTORIAL_SLIDE2_TITLE,
            description: values.TUTORIAL_SLIDE2_DESCRIPTION,
            image: 'assets/img/nv-tutorial-qr2.png',
          },
          {
            title: values.TUTORIAL_SLIDE3_TITLE,
            description: values.TUTORIAL_SLIDE3_DESCRIPTION,
            image: 'assets/img/nv-tutorial-choice.png',
          },
          {
            title: values.TUTORIAL_SLIDE4_TITLE,
            description: values.TUTORIAL_SLIDE4_DESCRIPTION,
            image: 'assets/img/nv-tutorial-secure.png',
          },
          {
            title: values.TUTORIAL_SLIDE5_TITLE,
            description: values.TUTORIAL_SLIDE5_DESCRIPTION,
            image: 'assets/img/nv-tutorial-verify.png'
          }
        ];
      });
  }

  startApp() {
    this.navCtrl.setRoot('WelcomePage', {}, {
      animate: true,
      direction: 'forward'
    });
  }

  onSlideChangeStart(slider) {

    if(!slider.isBeginning()){
      this.moveHeader = true;
    }
  }
}
