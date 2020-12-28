## Usage

In `App module` import accordion module
```python
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ManngComponentsModule } from 'ngx-accordion-from-object'
...

imports: [...
    BrowserAnimationModule,
    ManngComponentsModule
  ]
```
In the `component`

### Basic usage
```python
<man-typeahead [options]="options">
</man-typeahead>
```

### Templating option
```python
<man-typeahead [options]="data" [mandatorySelection]="true" [optionTemplate]="typeaheadTemplate">
    <ng-template let-option #typeaheadTemplate>
       <img class="pl-2" src="../favicon.ico" width="20px" height="16px"> 
       <span class="pl-2">{{option}}</span>
    </ng-template>
</man-typeahead>
```
### External Search
`html`
```python
<man-typeahead [listBehaviorOnFocus]="'complete'" (onKeydown)="searchItems($event)" [searchExternal]="true" [options]="extrenalValue"></man-typeahead>
```

`component`
```
externalValue = []
...

searchItem(event) {
    /* Mocking service call */
    setTimeout( () => { 
      let values = [];
      for(let i=0; i<100; i++) {
        values.push(Math.random()*10);
      }
      this.extrenalValue = values;
    }, 100)
    
}
```


## Inputs
| Input | Default | Description |
| ----- | ------- | ----------- |
| options | | Array - Complete list of options to be displayed |
| listBehaviorOnFocus | filtered | Describes how list will behave when opened. Valid values are filtered (default), complete |
| field | | String - Value to be resolved if option is an object |
| panelHeight | 200 |Number - Height of overlay panel in px |
| disabled | false | Sets disabled state |
| searchExternal | false | Doesn't search from options. Can be used with onKeydown output to show options after service call (Please refer to the example above) |
| mandatorySelection | false | If no option is selected sets the input blank and value to '' |
| debounceTime | 50 | Key debounce time for onKeydown output event |
| inputStyleClass |  | Style class for typeahead input |
| overlayStyleClass |  | Style class for overlay panel |
| optionTemplate |  | Template for options to show |

## Output
| Output | Description |
| ------ | ----------- |
| onKeydown | Emits the value entered in typeahead input |

