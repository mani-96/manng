import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'man-typeahead',
  templateUrl: './typeahead.component.html',
  styleUrls: ['./typeahead.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TypeaheadComponent implements OnInit {
  
  constructor() { }

  ngOnInit() {
  }


}
