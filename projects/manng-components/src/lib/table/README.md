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

