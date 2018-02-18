/**
 * 
 * Reveal Slideable
 * 
 * Slight animation that slides ion-slide elements left and back to right
 * to reveal the possible controls and alert the user that there is an action
 * that can be taken.
 * 
 */

import { Directive, ElementRef, Renderer, Input } from '@angular/core';
 
@Directive({
  selector: '[revealSlideable]'
})
export class RevealSlideableComponent {
 
  @Input('revealSlideable') shouldAnimate: boolean;
 
  constructor(public element: ElementRef, public renderer: Renderer) {
 
  }
 
  ngOnInit(){
 
    if(this.shouldAnimate){

      // Wait to apply animation class
      setTimeout(() => {
        this.renderer.setElementClass(this.element.nativeElement, 'active-slide', true);
        this.renderer.setElementClass(this.element.nativeElement, 'active-options-right', true);
        this.renderer.setElementClass(this.element.nativeElement.firstElementChild, 'nv-reveal-slideable', true);
      }, 1000);

      // Wait and remove animation classes
      setTimeout(() => {
        this.renderer.setElementClass(this.element.nativeElement.firstElementChild, 'nv-reveal-slideable', false);
        this.renderer.setElementClass(this.element.nativeElement, 'active-slide', false);
        this.renderer.setElementClass(this.element.nativeElement, 'active-options-right', false);
      }, 2000);
    }
  }
}