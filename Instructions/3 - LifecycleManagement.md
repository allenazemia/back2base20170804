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
6. Go to the Welcome.tsx and update the Welcome component to include the four main lifecycle methods and observable properties to manage the different component lifecycle state.
```js
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
            <h1>
                Welcome to the react workshop, {this.props.name}.
            </h1>
        );
    }
}
```
7. Save and go to the browser to test.