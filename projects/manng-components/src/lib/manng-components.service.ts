import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ManngComponentsService {

  constructor() { }

  deepValueFetch(path, object) {
    return path.reduce( (xs, x) => (xs && xs[x]) ? xs[x]: '', object);
  }
}
