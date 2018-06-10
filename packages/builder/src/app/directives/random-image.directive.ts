import { Directive, ElementRef, Renderer } from '@angular/core';

@Directive({
  selector: '[random-image]'
})
export class RandomImageDirective {

  constructor(private elemRef: ElementRef, private renderer: Renderer) { 

  }

  ngAfterViewInit(){
    //console.log(this.elemRef);

    this.renderer.setElementStyle(this.elemRef.nativeElement, "background-image", this.generate());

  }

  generate() {
    
    var path = "/assets/temp/";

    var tempImages = [
      "test-image-1.jpg",
      "test-image-2.jpg",
      "test-image-3.jpg",
      "test-image-4.jpg",
      "test-image-5.jpg",
      "test-image-6.jpg"
    ]
       
    var randomImage = tempImages[Math.floor(Math.random() * tempImages.length)];

    var randomImagePath = "url(" + path + randomImage + ")";

    return randomImagePath;

  }
}
