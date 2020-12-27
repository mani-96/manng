import { Component, OnInit, ChangeDetectorRef, Input, Output, EventEmitter, ViewEncapsulation, ChangeDetectionStrategy } from '@angular/core';
import { ObjectHelper } from '../ObjectHelper';

@Component({
  selector: 'man-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TableComponent implements OnInit {

  _settings: any = {
    showCheckbox: false,
    noDataMsg: 'No data found',
    showCheckboxOnRow: (row): boolean => true,
    disableCheckboxOnRow: (row): boolean => false,
    rowClassFunction: (row) => '',
    columns: [],
    showLineNumber: true,
    tableHeight: '280px',
    striped: true,
    headerBackground: '#f8f9fa',
    showGridlines: false
  }
  _data: Array<any> = [];
  sortConfig = {
    column: '',
    order: ''
  }
  checkboxDisabled = false;
  showSelectAllCheckbox = false;
  totalColumnLength = 1;
  totalRecordWithCheckbox = 0;
  checked = {};

  @Input('settings')
  set settings(value) {
    this._settings = this.getInitialSettings();
    Object.assign(this._settings, value);
    this.setSort('', '');
    this.sortChanged.emit(this.sortConfig);
    this.totalColumnLength = this._settings.columns.length + (this._settings.showLineNumber ? 1 : 0) + 
    (this._settings.showCheckbox ? 1 : 0);
    this.hasRecordWithCheckbox();
    this.changeDetectorRef.detectChanges();
  }

  @Input('data')
  set data(value: Array<any>){
    this._data = value;
    this.checked = [];
    this.checkChanged.emit([]);
    this.hasRecordWithCheckbox();
    this.changeDetectorRef.detectChanges();
  }


  @Output()
  checkChanged = new EventEmitter<any>();

  @Output()
  sortChanged = new EventEmitter<any>();

  @Output()
  rowSelected = new EventEmitter<any>();

  @Output()
  rowDblClicked = new EventEmitter<any>();


  constructor(private changeDetectorRef: ChangeDetectorRef) { }

  ngOnInit() {
  }

  getInitialSettings() {
    return {
      showCheckbox: false,
      noDataMsg: 'No data found',
      showCheckboxOnRow: (row): boolean => true,
      disableCheckboxOnRow: (row): boolean => false,
      rowClassFunction: (row) => '',
      columns: [],
      showLineNumber: true,
      tableHeight: '280px',
      striped: true,
      headerBackground: '#f8f9fa',
      showGridlines: false
    }
  }

  hasRecordWithCheckbox() {
    let count = 0;
    if (!this._settings.showCheckbox) {
      this.showSelectAllCheckbox = false;
    }
    if (this._data && this._data.length > 0) {
      for (let i=0; i<this._data.length; i++) {
        if (this._settings.showCheckboxOnRow(this._data[i]) && this._settings.disableCheckboxOnRow(this._data[i])) {
          count += 1;
        }
      }
    }
    this.totalRecordWithCheckbox = count;
    if (count) {
      this.showSelectAllCheckbox = true;
    } else {
      this.showSelectAllCheckbox = false;
    }
  }

  disableCheckbox() {
    this.checkboxDisabled = true;
    this.changeDetectorRef.detectChanges()
  }
  enableCheckbox() {
    this.checkboxDisabled = false;
    this.changeDetectorRef.detectChanges()
  }

  checkboxClicked(event, rowData, index) {
    if (event.target.checked) {
      this.checked[index] = rowData;
    } else {
      delete this.checked[index];
    }
    this.checkChanged.emit(Object.values(this.checked));
  }

  checkAll(event) {
    this.checked = {}
    if (event.target.checked) {
      for (let i=0; i<this._data.length; i++) {
        if (this._settings.showCheckboxOnRow(this._data[i]) && !this._settings.disableCheckboxOnRow(this._data[i])) {
          this.checked[i] = this._data[i]
        }
      }
    }
    this.checkChanged.emit(Object.values(this.checked));
  }
  rowClicked(row, event) {
    let path = ['target, firstChild, tagName'];
    if (event.srcElement.tagName.toLowerCase() != 'input' && 
    ObjectHelper.deepValueFetch(path, event) != 'input') {
      this.rowSelected.emit(row)
    }

  }
  rowDBClicked(row, event) {
    let path = ['target, firstChild, tagName'];
    if (event.srcElement.tagName.toLowerCase() != 'input' && 
    ObjectHelper.deepValueFetch(path, event) != 'input') {
      this.rowDblClicked.emit(row)
    }

  }

  isAllChecked() {
    return Object.values(this.checked).length == this.totalRecordWithCheckbox ? true : false;
  }

  get  columnLength() {
    return this._settings.columns.length
  }
  /**@param order 'ASC' | 'DESC' */
  setSort(column, order) {
    this.sortConfig.column = column;
    this.sortConfig.order = order
  }

  sortByColumn(column) {
    if (!column.canSort) {
      return
    }
    if (this.sortConfig.column == column.sortColumnName) {
      this.sortConfig.order = this.sortConfig.order == 'ASC' ? 'DESC' : "ASC"
    } else {
      this.sortConfig.column = column.sortColumnName;
      this.sortConfig.order = 'ASC';
    }
    this.sortChanged.emit(this.sortConfig)
  }

}
