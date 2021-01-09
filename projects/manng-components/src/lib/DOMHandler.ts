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
          top = elProp.bottom + this.getWindowScrollTop();
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

    public static scrollInView(container, item) {
        let borderTopValue: string = getComputedStyle(container).getPropertyValue('borderTopWidth');
        let borderTop: number = borderTopValue ? parseFloat(borderTopValue) : 0;
        let paddingTopValue: string = getComputedStyle(container).getPropertyValue('paddingTop');
        let paddingTop: number = paddingTopValue ? parseFloat(paddingTopValue) : 0;
        let containerRect = container.getBoundingClientRect();
        let itemRect = item.getBoundingClientRect();
        let offset = (itemRect.top + document.body.scrollTop) - (containerRect.top + document.body.scrollTop) - borderTop - paddingTop;
        let scroll = container.scrollTop;
        let elementHeight = container.clientHeight;
        let itemHeight = this.getOuterHeight(item);

        if (offset < 0) {
            container.scrollTop = scroll + offset;
        }
        else if ((offset + itemHeight) > elementHeight) {
            container.scrollTop = scroll + offset - elementHeight + itemHeight;
        }
    }
  
    public static getOuterHeight(el, margin?) {
        let height = el.offsetHeight;

        if (margin) {
            let style = getComputedStyle(el);
            height += parseFloat(style.marginTop) + parseFloat(style.marginBottom);
        }

        return height;
    }
}