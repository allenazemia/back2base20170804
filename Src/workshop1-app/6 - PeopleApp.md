## Create the People App
1. Insert the following code in the index.tsx file below the createBrowserHistory. This will make react compatible with material-ui components.
```js
const injectTapEventPlugin = require('react-tap-event-plugin');
injectTapEventPlugin();
```
2. In the App.tsx file, wrap the parent div container inside the MuiThemeProvider.
2.1 Import the neccessary material-ui lib
`import {MuiThemeProvider, getMuiTheme} from 'material-ui/styles';`
2.2 Above the App component class, insert he following code to set the default color for the MUI theme
```js
export const muiTheme = getMuiTheme({
    palette: {
        primary1Color: '#007674',
        primary2Color: 'rgba(0, 118, 116, 0.54)',
        accent1Color: '#31A948'
    },
    tabs: {
        backgroundColor: 'rgb(255,255,255)',
        textColor: 'rgba(0, 0, 0, 0.54)',
        selectedTextColor: '#007674'
    }
});
```
-2.3 Wrap the div inside the MuiThemeProvider
```js
<MuiThemeProvider muiTheme={muiTheme}>
    <div className={'appContainer'}>
        ...
    </div>
</MuiThemeProvider>
```
3. Inside the modesl folder create the two classes
3.1 The IPeople model
```js
export interface IPeople {
    id?: number;
    name: string;
    address: string;
    city: string;
    state: string;
    postcode: string;
}
```
3.2 The PeopleAsync mock Http Async operations
```js
import { ApiConfiguration } from '../ApiConfiguration';
import { HttpClient } from '../Http/HttpClient';
import { provide } from '../inversify.config';
import { IPeople } from './PeopleModels';

const PeopleContext: IPeople[] = [
    { id: 1, name: 'John Snow', address: '1 Northbridge', city: 'Perth', state: 'WA', postcode: '6000' }
];

@provide(PeopleAsync)
export class PeopleAsync {
    constructor(private httpClient: HttpClient, private apiConfig: ApiConfiguration) {
        this.httpClient.setBaseUrl(this.apiConfig.people);
    }

    getPeople(id: string): Promise<IPeople> {
        return this.httpClient.get<IPeople>(`api/people/${id}`);
    }

    getAll(): Promise<IPeople[]> {
        return Promise.all(PeopleContext);
        // return this.httpClient.get<IPeople[]>('api/people/');
    }

    createPeople(people: IPeople): Promise<boolean> {
        let lastPeople = PeopleContext[PeopleContext.length - 1];
        people.id = lastPeople.id;
        PeopleContext.push(people);
        return Promise.resolve(true);
        // return this.httpClient.post<IPeople, IGuidResult>('api/people/', people);
    }

    updatePeople(id: number, people: IPeople): Promise<boolean> {
        if (id === -1)
            return Promise.resolve(false);

        let found = PeopleContext.find((item) => item.id === id);
        console.log('found:', found);
        if (found) {
            found.name = people.name;
            found.address = people.address;
            found.city = people.city;
            found.state = people.state;
            found.postcode = people.postcode;
        }
        return Promise.resolve(true);
        // return this.httpClient.put<IPeople, IGuidResult>(`api/people/${id}`, people);
    }

    delete(id: number): Promise<Response> {
        return this.httpClient.delete(`api/people/${id}`);
    }
}
```

### Create the PeopleStore which acts as a controller
1. Import you components
```js
import { FieldState, FormState } from 'formstate';
import { action, computed, observable, IObservableArray } from 'mobx';
import { PeopleAsync } from '../Models/PeopleAsync';
import { IPeople } from '../Models/PeopleModels';
import { provide } from '../inversify.config';
```
2. Create the type PeopleForm
```js
export type PeopleForm = FormState<{
    name: FieldState<string>,
    address: FieldState<string>,
    city: FieldState<string>,
    state: FieldState<string>,
    postcode: FieldState<string>
}>;
```
3. Create the PeopleStore class. This class decouples the data from the view and processes all data transaction between the view the http transaction.
```js
// Register the class inside inversify IoC container.
@provide(PeopleStore)
export class PeopleStore {

    form: PeopleForm;
    
    // stores the selected selectedPeople
    @observable private _selectedPeople: IPeople;
    @computed get selectedPeople(): IPeople {
        return this._selectedPeople;
    }
    set selectedPeople(value: IPeople) {
        this._selectedPeople = value;
    }

    // Stores a collection of People in the observable array container. Any update that occurs on the array will force the associated component to re-render.
    @observable private _peopleCollection: IObservableArray<IPeople> = observable([]);
    @computed get peopleCollection(): IObservableArray<IPeople> {
        return this._peopleCollection;
    }

    @computed get canSubmit(): boolean {
        return this.form && !this.form.hasFieldError;
    }

    constructor(private peopleAsync: PeopleAsync) {
        this.initForm();
    }

    @action.bound
    loadAll = async () => {
        let result = await this.peopleAsync.getAll();
        if (result)
            this.peopleCollection.replace(result);
    }

    @action.bound
    save = async () => {
        let people = this.json;
        let result = await this.peopleAsync.createPeople(people);
        if (result)
            this.peopleCollection.push(people);
    }

    @action.bound
    update = async () => {
        let people = this.json;
        let result = await this.peopleAsync.updatePeople(people.id || -1, people);
        if (result)
            await this.loadAll();
    }

    @computed get json(): IPeople {
        let form$ = this.form.$;
        return {
            name: form$.name.value,
            address: form$.address.value,
            city: form$.city.value,
            state: form$.state.value,
            postcode: form$.postcode.value
        };
    }

    // initializes the form state.
    @action.bound
    initForm() {
        this.form = new FormState({
            name: new FieldState<string>(this.selectedPeople ? this.selectedPeople.name : ''),
            address: new FieldState<string>(this.selectedPeople ? this.selectedPeople.address : ''),
            city: new FieldState<string>(this.selectedPeople ? this.selectedPeople.city : ''),
            state: new FieldState<string>(this.selectedPeople ? this.selectedPeople.state : ''),
            postcode: new FieldState<string>(this.selectedPeople ? this.selectedPeople.postcode : '')
        });


        this.form.enableAutoValidation();
    }

    @action.bound
    resetForm() {

        this.form.$.name.reinitValue('');
        this.form.$.address.reinitValue('');
        this.form.$.city.reinitValue('');
        this.form.$.state.reinitValue('');
        this.form.$.postcode.reinitValue('');

        this.form.enableAutoValidation();
    }
}
```
4. Create the PeopleFile.tsx file in the Features folder. This file will contain the exportable PeopleFile component which is used to add and edit people.
```js
import * as React from 'react';
import {PeopleStore} from './PeopleStore';
import {action} from 'mobx';
import {Dialog, FlatButton} from 'material-ui';
import {observer} from 'mobx-react';

import './PeopleFile.css';

// @observer turns the PeopleMaster component into a reactive component.
// This forces the component to re-render whenever an observable object is updated.
@observer
export class PeopleFile extends React.Component < {
    peopleStore: PeopleStore; // people store is pass down from PeopleMaster
    display: boolean;
    isEditing: boolean;
    onClose: () => void;
}, {}> {

    // componentWillMount lifecycle to initialize the form on the store.
    componentWillMount() {
        this.props.peopleStore.initForm();
    }

    @action.bound
    saveAndClose() {
        if (!this.props.isEditing)
            this.props.peopleStore.save();
        else
            this.props.peopleStore.update();
        this.props.onClose();
    }

    @action.bound
    cancel() {
        this.props.onClose();
    }

    render() {
        const actions = [
            <FlatButton
                label='Cancel'
                onTouchTap={this.cancel}
            />,
            <FlatButton
                label='SAVE & CLOSE'
                primary={true}
                disabled={!this.props.peopleStore.canSubmit}
                type='submit'
                onTouchTap={this.saveAndClose}
            />
        ];

        let form$ = this.props.peopleStore.form.$;

        return (
            <Dialog title='Add new place' actions={actions}
                    modal={false} open={this.props.display} bodyStyle={{ margin: 0, padding: 0, overflow: 'hidden' }}>
                <div>
                    <div className='form-style-2'>
                        <div className='form-style-2-heading'>People Detail</div>
                        <label>
                            <span>Name <span className='required'>*</span></span>
                            <input type='text' className='input-field' name='field1' value={form$.name.value}
                                onChange={(event) => form$.name.onChange(event.currentTarget.value)}/>
                        </label>
                        <label>
                            <span>Address <span className='required'>*</span></span>
                            <input type='text' className='input-field' name='field1' value={form$.address.value}
                                onChange={(event) => form$.address.onChange(event.currentTarget.value)} />
                        </label>
                        <label>
                            <span>City <span className='required'>*</span></span>
                            <input type='text' className='input-field' name='field1' value={form$.city.value}
                                onChange={(event) => form$.city.onChange(event.currentTarget.value)} />
                        </label>
                        <label>
                            <span>State <span className='required'>*</span></span>
                            <input type='text' className='input-field' name='field1' value={form$.state.value}
                                onChange={(event) => form$.state.onChange(event.currentTarget.value)} />
                        </label>
                        <label>
                            <span>Postcode <span className='required'>*</span></span>
                            <input type='text' className='input-field' name='field1' value={form$.postcode.value}
                                onChange={(event) => form$.postcode.onChange(event.currentTarget.value)} />
                        </label>
                    </div>
                </div>

            </Dialog>
        );
    }
}
```
5. Create the PeopleMaster.tsx file in the Features folder. This file contains the exportable PeopleMaster component. It manages the PeopleFile state by updating it's props using observable fields.
```js
import FlatButton from 'material-ui/FlatButton';
import {lazyInject} from '../inversify.config';
import * as React from 'react';
import {PeopleStore} from './PeopleStore';
import {DataGrid, DataColumn, DataCell} from '../Components/Datagrid';
import {IPeople} from '../Models/PeopleModels';
import {action, observable} from 'mobx';
import {PeopleFile} from './PeopleFile';
import {observer} from 'mobx-react';

import './PeopleList.css';

// @observer turns the PeopleMaster component into a reactive component.
// This forces the component to re-render whenever an observable object is updated.
@observer
export class PeopleMaster extends React.Component <{}, {}> {

    // Usus inversify lazy inject to inject the people store.
    @lazyInject(PeopleStore)
    peopleStore: PeopleStore;

    @observable openDialog: boolean = false;
    @observable isEditing: boolean = false;

    // use componentDidMount to perform initial data transaction.
    // it is the recommended place to load data
    async componentDidMount() {
        await this.peopleStore.loadAll();
    }

    @action.bound
    selectRow(selectedRow: IPeople) {
        this.peopleStore.selectedPeople = selectedRow;
        this.peopleStore.initForm();
    }

    @action.bound
    createAddress(people: IPeople) {
        return `${people.address}, ${people.city}, ${people.state} ${people.postcode}`;
    }

    @action.bound
    onClose() {
        this.openDialog = false;
        this.isEditing = false;
        this.peopleStore.resetForm();
    }

    @action.bound
    addPeople() {
        this.isEditing = false;
        this.openDialog = true;
    }

    @action.bound
    editPeople(people: IPeople) {
        this.selectRow(people);
        this.isEditing = true;
        this.openDialog = true;
    }

    render() {
        return (
            <div>
                <div>
                    <h4>People List</h4>
                </div>
                <div>
                    <button onClick={this.addPeople}>Add People</button>
                </div>
                <div>
                    <DataGrid itemsSource={this.peopleStore.peopleCollection}
                       onSelectRow={this.selectRow}>
                        <DataColumn className={'name'} header={() => (<DataCell>Name</DataCell>)}
                                    cell={(row: IPeople) => (
                                        <DataCell>{row.name || ''}</DataCell>
                                    )} />
                        <DataColumn className={'address'} header={() => (<DataCell>Address</DataCell>)}
                                    cell={(row: IPeople) => (
                                        <DataCell>{this.createAddress(row)}</DataCell> )} />
                        <DataColumn className={'address'} header={() => (<DataCell>Action</DataCell>)}
                                    cell={(row: IPeople) => (
                                        <DataCell>
                                            <FlatButton label='Edit' onTouchTap={() => this.editPeople(row)}/>
                                        </DataCell> )} />
                    </DataGrid>
                </div>
                {
                    // the PeopleFile props is update from properties on the PeopleMaster component
                }
                <PeopleFile display={this.openDialog}
                            isEditing={this.isEditing}
                            peopleStore={this.peopleStore}
                            onClose={this.onClose} />

            </div>
        );
    }
}
```
6. Go to the App.tsx file and add a Route for the PeopleMaster component.
```js
<Redirect from='/people' exact to='/people/master' />
<Route path='/people/master' component={PeopleMaster} />
```
7. Save all changes and test in browser.


