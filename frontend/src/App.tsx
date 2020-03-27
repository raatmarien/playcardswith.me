import React from 'react';
import './App.css';
import * as Colyseus from "colyseus.js";
import {State, initialState} from "cards-library";

type Props = {};


export default class App extends React.Component<Props, State> {
    public client: any;

    constructor(props: Props) {
        super(props);
        this.state = initialState();

    }

    public componentDidMount() {
        let client = new Colyseus.Client("ws://localhost:3000");
        client.joinOrCreate("room").then(room => {
            console.log("joined");
            room.onStateChange.once(this.updateRoomState.bind(this));

            // new room state
            room.onStateChange(this.updateRoomState.bind(this));

            // listen to patches coming from the server
            room.onMessage(function(message) {
                console.log("New message", message);
            });

        });
    }

    private updateRoomState(state: any) {
        console.log("room state:", state);
        this.setState(state!);
    }


    public render() {
        return (
            <div className="App">
                Number of decks = {this.state.decks.length}
            </div>
        );
    }
}
