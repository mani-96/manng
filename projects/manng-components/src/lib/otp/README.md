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
<man-typeahead [options]="options">
</man-typeahead>
```

### Numbers Only
`html`
```python
<man-otp [config]="config"><man-otp>
```
`component`
```
config = {
    allowNumbersOnly: true,
    length: 4
}
```
### Styling
`html`
```python
<man-otp [config]="config"><man-otp>
```

`component`
```
config = {
    containerClass: 'container-class',
    inputClass: 'input-class',
    placeholder: '0',
    isPasswordInput: true,
    length: 5
}
```


## Inputs
| Input | Default | Description |
| ----- | ------- | ----------- |
| config | {length: 4} | Object - Contains config for input box and container |
| disabled | false | boolean - Disable to enable input boxes |


## Output
| Output | Description |
| ------ | ----------- |
| onInputChange | Emits changes values as an object that contains parsed and raw values. {{ '{' }}' parsed: '1234', raw:[1,2,3,4] } |

