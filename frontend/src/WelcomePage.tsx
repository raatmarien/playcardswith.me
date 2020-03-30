import React from 'react';
import CreateRoomComponent from './CreateRoomComponent';
import JoinRoomComponent from './JoinRoomComponent';
import './WelcomePage.scss';

export default class WelcomePage extends React.Component {

    public render() {
        return (
            <div className="welcome-page">
                <header>
                    <div className="header-background">
                        <img 
                            src="/img/svg-cards.png"
                        />
                    </div>

                        <h1>PLAYCARDSWITH.ME</h1>
                        <span>Play card games online with friends!</span>

                </header>

                <main>
                    <div className="row">
                        <div className="col-sm-4">
	                    <CreateRoomComponent />
                        </div>
                        <div className="col-sm-1 or-message">
                            <span>OR</span>
                        </div>
                        <div className="col-sm-7">
	                    <JoinRoomComponent   />
                        </div>
                    </div>
                </main>

                <footer>
                    <a href="https://playcardswith.me">PlayCardsWith.Me</a> is free and open source software!
                    Report bugs or contribute at <a href="https://github.com/raatmarien/playcardswith.me">our GitHub page</a>
                </footer>
                    </div>
        );
    }
}
