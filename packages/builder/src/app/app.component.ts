import {Component, OnInit, ViewContainerRef} from '@angular/core';
import {ToastsManager} from 'ng2-toastr/ng2-toastr';

@Component({
  selector: 'app-root',
  template: `
  <router-outlet></router-outlet>
`,
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  token: string;

  constructor(public toastr: ToastsManager,
    vcr: ViewContainerRef) {
    // This is set here since we can't get access to ViewContainerRef in the toast service
    this.toastr.setRootViewContainerRef(vcr);
  }

  ngOnInit() {

  }

}
