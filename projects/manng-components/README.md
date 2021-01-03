# ManngComponents

This library contains multiple components to make development easier and faster

## Working Example
[View Demo](https://mani-96.github.io/manng/index.html)

### Installation
```
npm install manng-components
```

After installation make sure ManngComponentsModule is imported in your app module

In `App module` import accordion module
```python
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ManngComponentsModule } from 'manng-components'
...

imports: [...
    BrowserAnimationModule,
    ManngComponentsModule
  ]
```


## Components
Below are the components available under manng-components

# Table
## Usage

In `App module` import accordion module
```python
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ManngComponentsModule } from 'manng-components'
...

imports: [...
    BrowserAnimationModule,
    ManngComponentsModule
  ]
```

### Basic usage
```python
<man-table [settings]="settings" [data]="data"></man-table>
```
In the `component`
```
...
settings = {
    columns: [
      {
        label: 'Column 1',
        valueType: 'key-value',
        value: 'value1'
      },
      {
        label: 'Column 2',
        valueType: 'key-value',
        value: 'value2'
      }
    ]
}
...

### Column Template
```python
<man-table [settings]="settings" [data]="data">
    <ng-template let-rowData #editButton>
        <button (click)="editClicked(rowData)">Edit</button>
    </ng-template>
</man-table>
```
In the `component`
```
....

@ViewChild('editButton, {static: true})
editButton

...
settings = {
    columns: [
      {
        label: 'Column 1',
        valueType: 'key-value',
        value: 'value1'
      },
      {
        label: 'Column 2',
        valueType: '',
        columnTemplate: editButton
      }
    ]
}
...

data = []
...
ngOnInit() {
    for (let i=0; i<10; i++) {
        this.data.push({
            value1: 'Column1 Value' + i,
            value2: 'Column2 Value' + i
        })
    }
}

...

editClicked(rowData) {
    console.log(rowData)
}

```

### Default settings Object
Below properties can be overridden to control table behaviour.
```python
{
    showCheckbox: false,
    noDataMsg: 'No data found',
    showCheckboxOnRow: (row): boolean => true,
    disableCheckboxOnRow: (row): boolean => false,
    rowClassFunction: (row) => '',
    columns: [], // Check below column options available
    showLineNumber: true,
    tableHeight: '',
    tableMaxHeight: '300px',
    striped: true,
    headerBackground: '#f8f9fa',
    showGridlines: false
}
```

### Column options
```
{
    label: '',
    valueType: '',
    value: '',
    valuePrepareFunction: (row) => {
        return ''
    }
    renderComponent: ComponentName
    maxWidth: '',
    minWidth: '',
    showToolTip: true,
    headerWordWrap : false,
    ellipsis: true,
    canSort: true,
    sortColumnName: '',
    columnTemplate: ''
    
}
```

| Column Property  | Description |
| ----- | ----------- |
| label | Column header |
| valueType | Determines how to show column value. Available values are 'key-value', 'function', 'html', 'custom' |
| value | When used with valueType 'key-value' - field name that should be picked from object to display value. For valueType 'html' displays static html given as text   |
| showToolTip | Boolean - Show tool-tip if hovered over column. |
| valuePrepareFunction | Function to generate value of column. Row data is passed to the function|
| renderComponent | Renders a component inside the column. valueType 'custom' must be used. |
| canSort | Boolean - Makes column sortable. (Note - Internal sorting is not available on table. Marking this as true will emit an output eventn with column name and order in which sorting must be done |
| sortColumnName | Column name to be used for sorting. |
| ellipsis | Boolean - Make the value ellipsis |
| maxWidth | Sets max width style on column. |
| minWidth | sets min width style on column |
| columnTemplate | Template that should be rendered in column. Use this to bind events |
###### Note- Table layout is not set to fixed. Browser would use internal table layout algorithm to determine column width.

## Output
| Output | Description |
| ------ | ----------- |
| checkChanged | Array - Emits the row data for which checkboxes are selected |
| sortChanged | Emits the sortColumnName are order in which sort should happen. {column: '', order: 'ASC|DESC'}|
| rowClick | Emit the row data on table row click |
| rowDblClick | Emit the row data on table row double click |

#
#
#
## Multiselect
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



### Inputs
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
| selectedLabelLength | 2 | Number of labels to show when selected|

### Output
| Output | Description |
| ------ | ----------- |
| onSelect | Emits the values selected. If no value is selected emits empty array [] |


#
#
#
## TabView
## Usage

In `App module` import accordion module
```python
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ManngComponentsModule } from 'manng-components'
...

imports: [...
    BrowserAnimationModule,
    ManngComponentsModule
  ]
```
In the `component`

### Basic usage
```python
    <man-tabview [(openTabIndex)]="openTabIndex" [maxHeight]="300">
        <man-tabpanel header="Tab 1">
            Magna veniam excepteur laboris commodo consequat tempor reprehenderit. Consequat incididunt irure minim esse sunt deserunt enim non nostrud officia in incididunt.
        </man-tabpanel>
        <man-tabpanel header="Tab 1">
            Magna veniam excepteur laboris commodo consequat tempor reprehenderit. Consequat incididunt irure minim esse sunt deserunt enim non nostrud officia in incididunt.
        </man-tabpanel>
        <man-tabpanel header="Tab 1">
            Magna veniam excepteur laboris commodo consequat tempor reprehenderit. Consequat incididunt irure minim esse sunt deserunt enim non nostrud officia in incididunt.
        </man-tabpanel>
    </man-tabview>
```

### Header Templating option
```python
    <man-tabview [(openTabIndex)]="openTabIndex" [maxHeight]="300">
        <man-tabpanel [headerTemplate]="headerTemplate">
            <ng-template #headerTemplate>
                <img src="favicon.ico" width="25px"> Tab2
            </ng-template>
        </man-tabpanel>
        <man-tabpanel header="Tab 1">
            Magna veniam excepteur laboris commodo consequat tempor reprehenderit. Consequat incididunt irure minim esse sunt deserunt enim non nostrud officia in incididunt.
        </man-tabpanel>
        <man-tabpanel header="Tab 1">
            Magna veniam excepteur laboris commodo consequat tempor reprehenderit. Consequat incididunt irure minim esse sunt deserunt enim non nostrud officia in incididunt.
        </man-tabpanel>
    </man-tabview>
```

## Inputs
| Input | Description |
| ----- | ----------- |
| maxHeight | Number - Max height of tabview |
| openTabIndex | Index of tab opened. Opened tab can be changed by passing index of tab to be opened |


## Tabpanel Inputs
| Input | Description |
| ----- | ----------- |
| header | String - Tab header string|
| disable | boolean - Set disable state. When disabled tab can't be navigated on. If programatic navigation is tried on disabled tab, current tab would remain active |
| confirmBeforeTabChange | boolean - Show a pop-up before changing the tab and only navigates if user accept |
| confirmationMessage | String - Message to be displayed in confirmation pop-up |

#
#
#
# Typeahead
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


### Inputs
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
| openOnFocus | true | Bolean - If false, doesnt open overlay on focus. |
| showDropdownIcon | false | Bolean - Show/hide dropdown icon on input. |
| inputStyleClass |  | Style class for typeahead input |
| overlayStyleClass |  | Style class for overlay panel |
| optionTemplate |  | Template for options to show |

### Output
| Output | Description |
| ------ | ----------- |
| onKeydown | Emits the value entered in typeahead input |


