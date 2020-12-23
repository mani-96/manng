import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UtilServices {

  constructor() { }

  deepValueFetch(path, object) {
    return path.reduce( (xs, x) => (xs && xs[x]) ? xs[x]: '', object);
  }  

  getWindowScrollTop() {
    let doc = document.documentElement;
    return (window.pageYOffset || doc.scrollTop) - (doc.clientTop || 0);
  }
  
  getWindowScrollLeft() {
    let doc = document.documentElement;
    return (window.pageXOffset || doc.scrollLeft) - (doc.clientLeft || 0);
  }

}
