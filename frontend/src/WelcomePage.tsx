import React from 'react';
import CreateRoomComponent from './CreateRoomComponent';
import JoinRoomComponent from './JoinRoomComponent';
import './WelcomePage.scss';

export default class WelcomePage extends React.Component {

    public render() {
        return (
            <div className="welcome-page">
                <header>
                    <img alt="logo"
                         src="/img/logo-2.svg" />
                </header>

                <main>
                    <CreateRoomComponent />

                    <JoinRoomComponent />

                    <article>
                        <h1>What is this?</h1>

                        <p>With <a href="https://playcardswith.me">PlayCardsWith.Me</a> you can
                            play card games together with <em>your</em> rules. It provides a
                            collaborative virtual table you and your friends can join, where you can
                            play cards. Just like on a normal table! The goal is to provide all the
                            features that you need to play most card games, while letting you decide
                            on the rules yourselves. This works especially well when you voice call
                            with your friends and join a room on this site. However, even when you
                            are all together in the same room, this site provides a solution when
                            you can't find your deck of cards!
                        </p>

                        <h1>How does it work?</h1>

                        <p>You can easily create a new private room for your friends using the 'New
                            Room' button at the top of the page. Your friends can then join the same
                            room using the 5 letter code of the created room.</p>

                        <p>If one of your friends has already created a room, you can join it by
                            typing in the 5 letter code of the room. Alternatively, your friend can
                            share the direct link to the room which allows you to join instantly.</p>

                        <h1>Is it free?</h1>

                        <p>Yes! <a href="https://playcardswith.me">PlayCardsWith.Me</a> is
                            completely free to use and has no advertisements! You don't need to sign
                            up or create an account. Simply create or join a room and start playing
                            any card game you like!</p>
                    </article>
                </main>

                <footer>
                    <a href="https://playcardswith.me">PlayCardsWith.Me</a> is free and open source software!
                    Report bugs or contribute at <a href="https://github.com/raatmarien/playcardswith.me">our GitHub page</a>
                </footer>
            </div>
        );
    }
}
