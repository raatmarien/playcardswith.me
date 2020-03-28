import React from 'react';
import CreateRoomComponent from './CreateRoomComponent';
import JoinRoomComponent from './JoinRoomComponent';
import './WelcomePage.css';

export default class WelcomePage extends React.Component {

    public render() {
        return (
            <div className="container">
            	<div className="inner-container">
	                <JoinRoomComponent   />
	                <div className="divider">or</div>
	                <CreateRoomComponent />
                </div>
            </div>
        );
    }
}
