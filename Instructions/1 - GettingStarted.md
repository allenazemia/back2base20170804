# Workshop 1: Web App with React and Typscript

## Tech Stack
- React
- Typecript
- Mobx
- Inversify
- ASP.NET Core
- npm v4.5 and node v7.9
- Visual Studio Code

## Setup our react project with create-react-app
We will use the create-react-app starter pack since it sets some useful tools and canonical defaults for React projects. Yarn will be used as the command-line utility to scaffold out our react project.

```sh
yarn global add create-react-app
which create-react-app
create-react-app my-react-app --scripts-version=react-scripts-ts
```

You can refer to the README.md file for more information the react and the create-react-app starter pack.

### Installing Client Side Libraries

```sh
yarn add react-router mobx mobx-react inversify
```

### Speeding up the workshop
1. git clone https://github.com/allenazemia/back2base20170804.git
2. Copy and paste the contents from the src/workshop1-app directory to your root project directory


### Setup React Router

Import the core react router components that will initialize routing in the application.

```ts
import { Router, Route } from 'react-router-dom';
import createBrowserHistory from 'history/createBrowserHistory';
```

Render react Router as the root component that will manage routing navigation across the application. 

Create the default app browser history that React router will use.

```ts
let appHistory = createBrowserHistory();
```

Update the ReactDOM.render method call to create a react Router as the route component and pass the appHistory instance to the history props on the Router.

```js
ReactDOM.render(
  <Router history={appHistory}>
      <Route component={App} />
  </Router>,
  document.getElementById('root') as HTMLElement
);

registerServiceWorker();
```

Edit the App.tsx file to make the App component accept routing properties.

```js
class App extends React.Component<RouteComponentProps<any>, any> {
  render() {
    return (
      <div className={styles.appContainer}>
          <div className={styles.appHeader}>
              <Route component={AppNavBar} />
          </div>
          <div className={styles.appBody}>
              <Switch>
                  // TODO: Insert Route
              </Switch>
          </div>
      </div>
    );
  }
}

export default App;
```

# Welcome to React (Basic Component)

We are going to create two component.
- Home component - exportable
- Welcome component - not exportable

1. In the features folder create the file Welcome.tsx
2. Create the Welcome component with a name property.

```js
export class Welcome extends React.Component<{
    name: string;
}, {} > {
    render() {
        return (
            <h1> Welcome to the react workshop,.</h1>
        );
    }
}
```
3.  Edit the <h1> tag to output the name from props
```html
<h1> Welcome to the react workshop, {this.props.name}.</h1>
```
4.  Create the exportable Home component 
```js
export class Home extends React.Component<{}, {}> {
    render() {
        return (
            <div>
            </div>
        );
    }
}```
5. Insert the Welcome component in inside the div
```js
<div>
    <Welcome name='John' />
</div>
```
6. Import the Home component in the App component
``` import { Home } from './Features/Welcome'; ```
7. Add the route in the Switch component
```js
<Redirect from='/' exact to='/welcome' />
<Route path='/welcome' component={Home} />
```
8. Save and test you changes in the browser

