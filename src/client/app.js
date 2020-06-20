import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from 'react-router-dom'
import Landing from './pages/landing'
import Join from './pages/join'
import Host from './pages/host'
import ReactDOM from "react-dom";

const App = () => {
  return <Router>
    <h1>Hello, World</h1>
    <Switch>
      <Route path='/host'>
        <Host />
      </Route>
      <Route path='/join'>
        <Join />
      </Route>
      <Route path='/'>
        <Landing />
      </Route>
    </Switch>
  </Router>
}

ReactDOM.render(<App />, document.querySelector('#app'));
