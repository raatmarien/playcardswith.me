import React from 'react';
import './App.css';
import * as Colyseus from "colyseus.js";
import {State, initialState} from "cards-library";
import TableComponent from "./TableComponent";
import DecksComponent from "./DecksComponent";

type Props = {};


export default class App extends React.Component<Props, State> {
    public room: Colyseus.Room<unknown> | null = null;

    constructor(props: Props) {
        super(props);
        this.state = initialState();
    }

    public componentDidMount() {
        let client = new Colyseus.Client("ws://localhost:2567");
        client.joinOrCreate("room").then(room => {
            console.log("joined");
            this.room = room;

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

    private sendMessage(msg: any) {
        if (this.room) {
            this.room.send(msg);
        }
    }

    public render() {
        return (
            <div className="App">
                <DecksComponent decks={this.state.decks} />
                <TableComponent table={this.state.table}
                                sendMessage={this.sendMessage.bind(this)}
                />
            </div>
        );
    }
}
