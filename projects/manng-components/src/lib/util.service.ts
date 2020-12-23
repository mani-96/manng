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

  isObjectequal(obj1: any, obj2: any, field?: string): boolean {
    if (field)
        return (this.resolveFieldData(obj1, field) === this.resolveFieldData(obj2, field));
    else
        return this.objectEqualByValue(obj1, obj2);
  }

  objectEqualByValue(obj1: any, obj2: any): boolean {
    if (obj1 === obj2) return true;

    if (obj1 && obj2 && typeof obj1 == 'object' && typeof obj2 == 'object') {
      let arrA = Array.isArray(obj1)
          , arrB = Array.isArray(obj2)
          , i
          , length
          , key;

      if (arrA && arrB) {
          length = obj1.length;
          if (length != obj2.length) 
            return false;
          for (i = length; i-- !== 0;)
            if (!this.objectEqualByValue(obj1[i], obj2[i])) return false;
              return true;
      }

      if (arrA != arrB) 
        return false;

      let dateA = obj1 instanceof Date
          , dateB = obj2 instanceof Date;
      if (dateA != dateB) {
        return false;
      }
      if (dateA && dateB) {
        return obj1.getTime() == obj2.getTime();
      }

      let keys = Object.keys(obj1);
      length = keys.length;

      if (length !== Object.keys(obj2).length){
        return false;
      }

      for (i = length; i-- !== 0;) {
        if (!Object.prototype.hasOwnProperty.call(obj2, keys[i])) {
          return false;
        }
      }

      for (i = length; i-- !== 0;) {
        key = keys[i];
        if (!this.objectEqualByValue(obj1[key], obj2[key])) {
          return false;
        }
      }
      return true;
    }

    return obj1 !== obj1 && obj2 !== obj2;
  }
  
  resolveFieldData(data: any, field: any): any {
    if (data && field) {
        if (this.isFunction(field)) {
            return field(data);
        }
        else if (field.indexOf('.') == -1) {
            return data[field];
        }
        else {
            let fields: string[] = field.split('.');
            let value = data;
            for(let i = 0, len = fields.length; i < len; ++i) {
                if (value == null) {
                    return null;
                }
                value = value[fields[i]];
            }
            return value;
        }
    }
    else {
        return null;
    }
  }
  
  isFunction(obj: any) {
    return !!(obj && obj.constructor && obj.call && obj.apply);
  }

}
