## Working with List and Maps (ToDoList Example)
In this section will be working `IObservableArray<>` from mobx to store our collection of todo items. In addition, we will make use of FormState and FieldState from the FormState library.
1. Create a new file in the Features folder name WorkingWithList.
2. Import the following tools
```ts
import { FormState, FieldState } from 'formstate';
import { observer } from 'mobx-react';
import * as React from 'react';
import { computed, observable, IObservableArray, action } from 'mobx';

import './WorkingWithList.css';
```
3.Create a ToDoItemForm fromm FormState
```ts
export type ToDoItemForm = FormState < {
    item: FieldState<string>
}>;
```
4. Create the ListHome component template
```js
@observer
export class ListHome extends React.Component<{}, {}> {
    render() {
        return (
            <div className='todos'>
                <div>
                    <h4>Todo List</h4>
                </div>
                <div>
                    <input onChange={this.onChange} value={this.form.$.item.value} />
                    <button onClick={this.addItem} > Add Item </button>
                </div>
                <div>
                    <h3>Items</h3>
                    <ul className='todosList'>
                        // TODO: generate list of items.
                    </ul>
                </div>
            </div>
        );
    }
}
```
5. Create the form field and _todos field above the render method
```js
    form: ToDoItemForm;

    @observable private _todos: IObservableArray<string> = observable([]);
    @computed get todos(): IObservableArray<string> {
        return this._todos;
    }
```
6. Create the constructor and initialize the form field.
```js
    constructor(props) {
        super(props);
        this.form = new FormState({
            item: new FieldState<string>('')
        });`
    }
```
7. Create the addItem event handler. This will add  item from the form to the todos observable array.
```js
    @action.bound
    addItem = (event) => {
        if (this.form.$.item.dirty && !!this.form.$.item.value)
            this.todos.push(this.form.$.item.value);

        this.form.$.item.reinitValue('');
    }
```
8. Create the onChange event handler which will be attached to the <input /> onChange event.
```js
    onChange = (event: React.SyntheticEvent<any>) => {
        if (event.currentTarget) {
            this.form.$.item.onChange(event.currentTarget.value);
        }
    }
```
9. Create the onDeleteItem method which will be called to remove an item from the todos observable array.
```js
    @action.bound
    onDeleteItem = (index: number) => {
        this.todos.splice(index, 1);
    }
```
10. Inside the ul element insert the following code to generate the list of items by iterating over the the observable array. 
```js
    {this.todos.map((item, index) => {
        return (
            <li key={`todoitem-${index}`}>
                <div style={{width: 200}}>
                    <div style={{float: 'left', width: 150}}>
                        <span>{item}</span>
                    </div>
                    <div style={{float: 'right'}}>
                        <button  onClick={() => {
                            this.onDeleteItem(index);
                        }}>Delete</button>
                    </div>
                </div>
            </li>
        );
    })}         
```
- In react it is the recommended practice to set the key attribute on the element that is being generated in the list. The key must be unique across the generate element. React uses this internally to render the element efficiently via the `diffing algorithm`.
11. Save and go to the browser to test.

12. The complete file
```js
import { FormState, FieldState} from 'formstate';
import { observer } from 'mobx-react';
import * as React from 'react';
import { computed, observable, IObservableArray, action } from 'mobx';

import './WorkingWithList.css';

export type ToDoItemForm = FormState < {
    item: FieldState<string>
}>;

@observer
export class ListHome extends React.Component<{}, {}> {

    form: ToDoItemForm;

    @observable private _todos: IObservableArray<string> = observable([]);
    @computed get todos(): IObservableArray<string> {
        return this._todos;
    }

    constructor(props) {
        super(props);
        this.form = new FormState({
            item: new FieldState<string>('')
        });
    }

    @action.bound
    addItem = (event) => {
        if (this.form.$.item.dirty && !!this.form.$.item.value)
            this.todos.push(this.form.$.item.value);

        this.form.$.item.reinitValue('');
    }

    onChange = (event: React.SyntheticEvent<any>) => {
        if (event.currentTarget) {
            this.form.$.item.onChange(event.currentTarget.value);
        }
    }

    @action.bound
    onDeleteItem = (index: number) => {
        this.todos.splice(index, 1);
    }

    render() {
        return (
            <div className='todos'>
                <div>
                    <h4>Todo List</h4>
                </div>
                <div>
                    <input onChange={this.onChange} value={this.form.$.item.value} />
                    <button onClick={this.addItem} > Add Item </button>
                </div>
                <div>
                    <h3>Items</h3>
                    <ul className='todosList'>
                        {this.todos.map((item, index) => {
                            return (
                                <li key={`todoitem-${index}`}>
                                    <div style={{width: 200}}>
                                        <div style={{float: 'left', width: 150}}>
                                            <span>{item}</span>
                                        </div>
                                        <div style={{float: 'right'}}>
                                            <button  onClick={() => {
                                                this.onDeleteItem(index);
                                            }}>Delete</button>
                                        </div>
                                    </div>
                                </li>
                            );
                        })}
                    </ul>
                </div>
            </div>
        );
    }
}
```