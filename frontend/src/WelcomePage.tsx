import React from 'react';
import CreateRoomComponent from './CreateRoomComponent';
import JoinRoomComponent from './JoinRoomComponent';
import './WelcomePage.css';

export default class WelcomePage extends React.Component {

    public render() {
        return (
            <div className="welcome-background">
                <div className="welcome-container">
                	<div className="inner-container">
	                   <JoinRoomComponent   />
	                   <div className="welcome-divider">or</div>
	                   <CreateRoomComponent />
                    </div>
                </div>
            </div>
        );
    }
}
