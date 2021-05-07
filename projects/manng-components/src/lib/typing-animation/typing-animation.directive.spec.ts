import { ElementRef } from '@angular/core';
import { TypingAnimationDirective } from './typing-animation.directive';


describe('TypingAnimationDirective', () => {
  it('should create an instance', () => {
    const directive = new TypingAnimationDirective(new ElementRef({}));
    expect(directive).toBeTruthy();
  });
});
