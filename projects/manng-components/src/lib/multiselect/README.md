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
<man-multiselect [options]="options"></man-multiselect>
```

### Templating option
```python
<man-multiselect [options]="options"  [disable]="false" [showSearch]="false" [optionTemplate]="optionsDiv">
    <ng-template let-option #optionsDiv>
        <img src="../favicon.ico" class="pl-2" width="25px" height="16px"><span class="pl-2">{{option}}</span>
    </ng-template>
</man-multiselect>
```



## Inputs
| Input | Default | Description |
| ----- | ------- | ----------- |
| options | | Array - Complete list of options to be displayed |
| field | | String - Value to be resolved if option is an object |
| scrollHeight | 200 |Number - Height of overlay panel in px |
| disabled | false | Sets disabled state |
| showSearch | true | If false, option search would not be available  |
| selectionLimit | null | Max options that can be selected |
| inputStyleClass |  | Style class for typeahead input |
| overlayStyleClass |  | Style class for overlay panel |
| optionTemplate |  | Template for options to show |

## Output
| Output | Description |
| ------ | ----------- |
| onSelect | Emits the values selected. If no value is selected emits empty array [] |

