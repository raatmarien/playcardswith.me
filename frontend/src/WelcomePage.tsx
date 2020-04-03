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
                        <img alt="logo"
                            src="/img/svg-cards.png"
                        />
                    </div>

                    <h1>PLAYCARDSWITH.ME</h1>
                    <span>Play card games online with friends!</span>

                </header>

                <main>
                    <CreateRoomComponent />

                    <JoinRoomComponent />
                </main>

                <footer>
                    <a href="https://playcardswith.me">PlayCardsWith.Me</a> is free and open source software!
                    Report bugs or contribute at <a href="https://github.com/raatmarien/playcardswith.me">our GitHub page</a>
                </footer>
            </div>
        );
    }
}
