import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";
import App from './App';
import WelcomePage from "./WelcomePage";
import * as serviceWorker from './serviceWorker';

ReactDOM.render(
  <React.StrictMode>
  	<Router>
  		<Switch>
	    	<Route path="/g/">
	    		<App />
	    	</Route>
	    	<Route path="/">
	    		<WelcomePage/>
	    	</Route>
    	</Switch>
    </Router>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
