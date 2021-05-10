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

### Usage

```python
    <div [dataValues]="data" [dataShowTime]="time"></div>
```

In the `component`

```
    data = ['this', 'string', 'would', 'be', 'shown'];
    time = 5000 // Time in ms
```

## Inputs

| Input        | Description                                                                                        |
| ------------ | -------------------------------------------------------------------------------------------------- |
| dataValues   | Array of string to be shown in typing animartion sequence                                          |
| dataShowTime | Time in ms for which value in array would stay visible on screen before applying deleting sequence |
