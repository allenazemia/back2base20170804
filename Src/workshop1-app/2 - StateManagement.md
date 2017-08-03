## Understanding State Manage

### React Internal State
1. Copy the previous Home.tsx file to StateManagement.tsx
2. Rename the component to StateHome and remove the Welcome component from the file
3. import { Welcome } from './Welcome';
4. Create an interface model for the state
```js
interface IStateHomeModel {
    name: string;
    editedName: string;
}
```
5. Inside StateHome component create constructor to initialize the  state model
```js
    constructor(props) {
        super(props);
        this.state = {
            name: 'John',
            editedName: ''
        };
    }
```
6. Edit the render method to the code below:
```js
    render() {
        return (
            <div>
                <div>
                    <div>
                        <label>Enter your name:</label>
                        <input type='text' onChange={(event) => {
                            // TODO: set the editedName state
                        }} />
                    </div>
                </div>
                <Welcome name='John' />
                <button onClick={() => {
                    // TODO: set the final name to the latest edited name
                }} > Update Name </button>
            </div>
        );
    }
}
```
7. Update the editedName state property whenever text changes on the input by adding the following code in the onChange event
```js
this.setState({
    editedName: event.currentTarget.value
});
```
8. Update the name state property whenever the user clicks the Update Name button by adding the following code in the button onClick event handler
```js
this.setState({
    name: this.state.editedName
});
```
9. Edit the Welcome component name attribute to refer to the name state property
```name={`${this.state.name}`}```
10. Save and test result in browser

### Introducing Mobx
1. import { observable } from 'mobx'; and import { observer } from 'mobx-react';
2. Create an observable field _familyName and computed property (get/set) familyName
```js
@observable private _familyName: string = 'John';
@computed get familyName(): string {
    return this._familyName;
}
set familyName(value: string) {
    this._familyName = value;
}
```
3. Add new input to enter family name below the div container surrounding the name input eleemnt.
```js
<div>
    <label>Enter your family name:</label>
    <input type='text' onChange={(event) => {
        this.familyName = event.currentTarget.value;
    }} />
</div>
```
4. Edit the name props on the Welcome component to the following:
`name={`${this.state.name} ${this.familyName}`}`
5. `import { observer } from 'mobx-react';`
6. Annotate the component with the @observer attribute
```js
@observer
export class StateHome extends React.Component<{}, IStateHomeModel> {
```
7. Save and test in browser
8. Full Source code
```js
import { observer } from 'mobx-react';
import * as React from 'react';
import { Welcome } from './Welcome';
import {computed, observable} from 'mobx';

import './StateManagement.css';

interface IStateHomeModel {
    name: string;
    editedName: string;
}

@observer
export class StateHome extends React.Component<{}, IStateHomeModel> {

    @observable private _familyName: string = 'Allen';
    @computed get familyName(): string {
        return this._familyName;
    }
    set familyName(value: string) {
        this._familyName = value;
    }

    constructor(props) {
        super(props);
        this.state = {
            name: 'Allen',
            editedName: ''
        };
    }

    render() {
        return (
            <div>
                <div>
                    <div className='form-style-2'>
                        <label>Enter your name:</label>
                        <input type='text' onChange={(event) => {
                            this.setState({
                                editedName: event.currentTarget.value
                            });
                        }} />
                    </div>
                    <div className='form-style-2'>
                        <label>Enter your family name:</label>
                        <input type='text' onChange={(event) => {
                            this.familyName = event.currentTarget.value;
                        }} />
                    </div>
                </div>
                <Welcome name={`${this.state.name} ${this.familyName}`} />
                <button onClick={() => {
                    this.setState({
                        name: this.state.editedName
                    });
                }} > Update Name </button>
            </div>
        );
    }
}
```