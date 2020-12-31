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
