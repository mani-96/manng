import { Component, OnInit, Input, ComponentFactoryResolver, ViewChild, ViewContainerRef, OnDestroy } from '@angular/core';

@Component({
  selector: 'man-rendered-cell',
  template: '<ng-template #dynamicTarget></ng-template>',
  styleUrls: ['./rendered-cell.component.css']
})
export class RenderedCellComponent implements OnInit {

  @Input('columnSetting')
  columnSettings;

  @Input('rowData')
  rowData

  @ViewChild("dynamicTarget", { read: ViewContainerRef, static: true })
  dynamicTarget: any;

  customComponent;
  dynamictarget;

  constructor(private resolver: ComponentFactoryResolver) { }

  ngOnInit() {
    if (!this.customComponent) {
      this.createCustomComponent();
      this.patchInstance();
    }
  }
  
  protected createCustomComponent() {
    const componentFactory = this.resolver.resolveComponentFactory(
      this.columnSettings.renderComponent
    );
    this.customComponent = this.dynamicTarget.createComponent(componentFactory);
  }

  protected patchInstance() {
    Object.assign(this.customComponent.instance, this.getPatch());
  }

  protected getPatch() {
    return {
      rowData: this.rowData
    };
  }

  ngOnDestroy() {
    if (this.customComponent) {
      this.customComponent.destroy();
    }
  }

}