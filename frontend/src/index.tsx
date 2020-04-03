import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";
import App from './App';
import WelcomePage from "./WelcomePage";
import * as serviceWorker from './serviceWorker';

ReactDOM.render(
    <React.StrictMode>
        <Router>
  	    <Switch>
	        <Route exact path="/">
	    	    <WelcomePage/>
	        </Route>

	        <Route path="/room/:id" component={AppWrapper} />
    	    </Switch>
        </Router>
    </React.StrictMode>,
    document.getElementById('root')
);

function AppWrapper(props: any) {
    return <App roomId={props.match.params.id} />;
}


// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
