import { Component, Input, ViewChild, ElementRef, Renderer } from '@angular/core';

@Component({
  selector: 'expandable',
  templateUrl: 'expandable.html'
})
export class ExpandableComponent {

  @ViewChild('expandWrapper', {read: ElementRef}) expandWrapper;
  @ViewChild('expandWrapperInner', {read: ElementRef}) expandWrapperInner;
  @Input('expanded') expanded;
  @Input('expandedHeight') expandedHeight;
  
  constructor(public renderer: Renderer) {}

  ngAfterViewInit(){
    this.renderer.setElementStyle(this.expandWrapper.nativeElement, 'height', this.expandWrapperInner.nativeElement.offsetHeight + 'px');    
  }
}


