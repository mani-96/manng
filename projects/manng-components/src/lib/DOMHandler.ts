export class DOMHandler {
    public static getPanelProperties(element, panel) {
        let left = 0;
        let top = 0;
        let calculatedMaxHeight: any = 0;
        let elProp = element.getBoundingClientRect();
        let width = elProp.width;
        let panelHeight = panel.getBoundingClientRect().height;
        let posYHeight = elProp.bottom + panelHeight;
        left = elProp.x + this.getWindowScrollLeft();
        if (posYHeight < window.innerHeight) {
          top = elProp.bottom;
        } else {
          if (elProp.y > panelHeight + 1) {
            top = elProp.y + this.getWindowScrollTop() - panelHeight - 1;
          } else {
            let topSpace = elProp.y;
            let bottomSpace = window.innerHeight - elProp.y - elProp.height;
            if (topSpace > bottomSpace) {
              calculatedMaxHeight = topSpace - 1;
              top = elProp.y + this.getWindowScrollTop() - (calculatedMaxHeight > panelHeight ? panelHeight : calculatedMaxHeight)  - 1;
            } else {
              calculatedMaxHeight = bottomSpace;
              top = elProp.y + + this.getWindowScrollTop() + elProp.height;
            }
          }
        }
        return ({
            top: top,
            left: left,
            width: width,
            height: calculatedMaxHeight
        })

    }

    public static getWindowScrollTop() {
        let doc = document.documentElement;
        return (window.pageYOffset || doc.scrollTop) - (doc.clientTop || 0);
    }

    public static getWindowScrollLeft() {
        let doc = document.documentElement;
        return (window.pageXOffset || doc.scrollLeft) - (doc.clientLeft || 0);        
    }
}