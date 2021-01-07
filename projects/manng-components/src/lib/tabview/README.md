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
| navWidth | Sets the width of tab header. If tabs overflow, would show navigation buttons |
| scrollJump | Number - How much should tab header move left or right when clicked on navigation buttons |
| openTabIndex | Index of tab opened. Opened tab can be changed by passing index of tab to be opened |

## Tabpanel Inputs
| Input | Description |
| ----- | ----------- |
| header | String - Tab header string|
| disable | boolean - Set disable state. When disabled tab can't be navigated on. If programatic navigation is tried on disabled tab, current tab would remain active |
| confirmBeforeTabChange | boolean - Show a pop-up before changing the tab and only navigates if user accept |
| confirmationMessage | String - Message to be displayed in confirmation pop-up |
