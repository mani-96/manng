import { Directive, ElementRef, Input } from '@angular/core';

@Directive({
  selector: '[manTypingAnimation]'
})
export class TypingAnimationDirective {

  @Input('dataValues')
  dataValues: Array<string> = [];

  @Input('dataShowTime')
  dataShowTime: number = 2000;

  rotateValues;
  rotateTime;
  loopNumber = 0;
  isDeleting = false;
  textToDisplay = ''

  constructor(private el: ElementRef) { }

  ngOnInit() {
    this.el.nativeElement.style.borderRight = '0.08em solid #666';
    this.textRotate();
  }

  textRotate() {
    let i = this.loopNumber % this.dataValues.length;
    let text = this.dataValues[i];
    let timeoutPeriod = 300;

    if (this.isDeleting) {
      this.textToDisplay = text.substring(0, this.textToDisplay.length - 1);
    } else {
      this.textToDisplay = text.substring(0, this.textToDisplay.length + 1);
    }

    if (!this.isDeleting && this.textToDisplay == text) {
      this.isDeleting = true
      timeoutPeriod = this.dataShowTime;
    } else if (this.isDeleting && this.textToDisplay == '') {
      this.isDeleting = false;
      this.loopNumber++;
      timeoutPeriod = 300;
    }

    this.el.nativeElement.innerText = this.textToDisplay
    setTimeout( () => {
      this.textRotate();
    }, timeoutPeriod)

  }

}
