import { Component, OnInit, Input, ChangeDetectionStrategy } from '@angular/core';
import { UtilServices } from '../../util.service';

@Component({
  selector: 'app-custom-cell',
  templateUrl: './app-custom-cell.component.html',
  styleUrls: ['./app-custom-cell.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppCustomCellComponent implements OnInit {

  @Input('rowData')
  set rowData(value) {
    this._rowData = value;
    this.updateValue()
  }

  @Input('columnSetting')
  set columnSetting(value) {
    this._columnSetting = value;
    this.updateValue()
  }
  _rowData;
  _columnSetting;
  colValue = ''
  tooltipTimeout;


  constructor(private serv: UtilServices) { }
  ngOnInit() {
  }

  updateValue() {
    if (this._columnSetting && this._columnSetting.valueType == 'function') {
      this.getPreparedValue();
    } else if (this._columnSetting) {
      this.getValueAtKey();
    }
  }

  getValueAtKey() {
    if (this._columnSetting.value && this._columnSetting.value.split('.').length > 1) {
      const key = this._columnSetting.value.split('.');
      this.colValue = this.serv.deepValueFetch(key, this._rowData);
      console.log(this.colValue)
    } else {
      this.colValue = (this._rowData[this._columnSetting.value] ? (this._rowData[this._columnSetting.value]).toString() : '');
    }
  }

  getPreparedValue() {
    const prepare = this._columnSetting.valuePrepareFunction;
    this.colValue = prepare.call(null, this._rowData);
    return this.colValue;
  }

  showToolTip(event) {
    this.tooltipTimeout = setTimeout( () => {
      if (this._columnSetting.showToolTip && this.colValue) {
        let screenWidth = window.innerWidth;
        let clientRect = event.target.getBoundingClientRect();
        let posX = clientRect.x;
        let posY = clientRect.y;
        let tooltip = document.getElementById('man-tooltip');
        tooltip.innerHTML = this.colValue;
        tooltip.style.display = 'block';
        tooltip.style.visibility = 'hidden';
        let totalWidth = posX + (clientRect.width/2) + tooltip.clientWidth;
        if ( totalWidth > screenWidth && (totalWidth - posX) < posX ) {
          tooltip.style.left = posX + (clientRect.width/2) - tooltip.clientWidth + 'px'
        } else if(totalWidth > screenWidth && (totalWidth - posX) > posX) {
          tooltip.style.width = screenWidth - 20 + 'px';          
          tooltip.style.maxWidth = 'unset';
        } else {
          tooltip.style.left = posX + 'px'
        }
        let tipYPosition = posY + (clientRect.height/1.5) + 3;
        if (tipYPosition + tooltip.clientHeight > window.innerHeight) {
          tipYPosition = window.innerHeight - tooltip.clientHeight;
        }
        tooltip.style.top = tipYPosition + 'px';
        tooltip.style.visibility = 'visible';
      } else {
        document.getElementById('man-tooltip').removeAttribute('style');
      }
    },50)
  }

  hideToolTip() {
    if (this.tooltipTimeout) {
      clearTimeout(this.tooltipTimeout)
    }
    document.getElementById('man-tooltip').removeAttribute('style');
  }

}
