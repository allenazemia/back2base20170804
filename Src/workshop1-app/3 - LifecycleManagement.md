## Understanding React Lifecycle Hooks
1. Copy the previous StateManagement.tsx file to LifecycleManagement.tsx
2. Add the following code to manage the visible of the welcome component
```js
@observable private _isWelcomeVisible: boolean = false;
@computed get isWelcomeVisible(): boolean {
    return this._isWelcomeVisible;
}
set isWelcomeVisible(value: boolean) {
    this._isWelcomeVisible = value;
}
```
3. Add the event handler setWelcomeVisibility in the LifecycleManagement.tsx
```js
setWelcomeVisibility = (event) => {
    this.isWelcomeVisible = !this.isWelcomeVisible;
}   
```
4. Insert the following button to set the visibility property. Place the code below the display button.
```js
<div>
    <button onClick={this.setWelcomeVisibility}>{this.isWelcomeVisible ? 'Remove Welcome' : 'Show Welcome'}</button>
</div>
```
5. Edit the line `<Welcome name... /> to the following
```js
{this.isWelcomeVisible && <Welcome name={`${this.state.name} ${this.familyName}`} /> }
```
6. Go to the Welcome.tsx and update the Welcome component to include the five main lifecycle methods used during development.
```js
import * as React from 'react';
import { observer } from 'mobx-react';

@observer
export class Home extends React.Component<{}, {}> {

    render() {
        return (
            <div>
                <Welcome name='Allen' />
            </div>
        );
    }
}

export class Welcome extends React.Component<{
    name: string;
}, {} > {

    componentWillMount() {
        console.log('component will mount');
    }

    componentDidMount() {
        console.log('component did mount');
    }

    componentWillUpdate(nextProps, nextState) {
        console.log('component will update');
    }

    componentDidUpdate(nextProps, nextState) {
        console.log('component did update');
    }

    componentWillUnmount() {
        console.log('component will unmount');
    }

    render() {
        console.log('component rendered');
        return (
            <h3>
                Welcome to the react workshop, {this.props.name}.
            </h3>
        );
    }
}

```
7. The complete file should look lik:
```js
import { observer } from 'mobx-react';
import * as React from 'react';
import { Welcome } from './Welcome';
import {computed, observable} from 'mobx';

interface IStateHomeModel {
    name: string;
    editedName: string;
}

@observer
export class LifecycleHome extends React.Component<{}, IStateHomeModel> {

    @observable private _familyName: string = 'Allen';
    @computed get familyName(): string {
        return this._familyName;
    }
    set familyName(value: string) {
        this._familyName = value;
    }

    @observable private _isWelcomeVisible: boolean = false;
    @computed get isWelcomeVisible(): boolean {
        return this._isWelcomeVisible;
    }
    set isWelcomeVisible(value: boolean) {
        this._isWelcomeVisible = value;
    }

    constructor(props) {
        super(props);
        this.state = {
            name: 'Allen',
            editedName: ''
        };
    }

    setWelcomeVisibility = (event) => {
        this.isWelcomeVisible = !this.isWelcomeVisible;
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
                {this.isWelcomeVisible && <Welcome name={`${this.state.name} ${this.familyName}`} /> }
                <button onClick={() => {
                    this.setState({
                        name: this.state.editedName
                    });
                }} > Update Name </button>
                <div>
                    <button onClick={this.setWelcomeVisibility}>{this.isWelcomeVisible ? 'Remove Welcome' : 'Show Welcome'}</button>
                </div>
            </div>
        );
    }
}
```
8. Save, erform a hard refresh in the browser. Update the details. Press F12 to open web dev tools in chrome and navigate to the console tab. You will be able to see the different execution order of the lifecycle.