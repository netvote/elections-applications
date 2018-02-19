import { Component, Input } from '@angular/core';
//import { Input } from '@angular/core/src/metadata/directives';

@Component({
  selector: 'nv-spinner',
  templateUrl: 'spinner.html'
})

export class SpinnerComponent {

  // @Input('spinning') 'spinning';
  @Input('spinnerState') 'spinnerState';

  constructor() {
    
  }

  ngAfterViewInit(){

  }

}
