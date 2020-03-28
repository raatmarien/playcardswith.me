import "./TableComponent.css";
import React from 'react';
import './App.css';
import * as Colyseus from "colyseus.js";
import {State, initialState} from "cards-library";
import TableComponent from "./TableComponent";
import RoomHelper from "./RoomHelper";
import PointersComponent from "./PointersComponent";

type Props = {};


export default class App extends React.Component<Props, State> {
    public room: Colyseus.Room<unknown> | null = null;

    constructor(props: Props) {
        super(props);
        this.state = initialState();
    }

    public componentDidMount() {
        let client = new Colyseus.Client("ws://localhost:2567");
        RoomHelper.connect(client).then((r:Colyseus.Room) => this.onRoomJoin(r));
    }

    private onRoomJoin(room: Colyseus.Room) {
        console.log("joined");
        this.room = room;

        room.onStateChange.once(this.updateRoomState.bind(this));

        // new room state
        room.onStateChange(this.updateRoomState.bind(this));

        // listen to patches coming from the server
        room.onMessage(function(message) {
            console.log("New message", message);
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

    private onMouseMove(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
        if (this.room) {
            this.sendMessage({
                messageType: "pointer_move",
                playerId: this.room.sessionId,
                pointerX: e.clientX,
                pointerY: e.clientY,
            });
        }
    }

    public render() {
        return (
            <div className="App" onMouseMove={this.onMouseMove.bind(this)}>
                <PointersComponent players={this.state.players} />
                <TableComponent decks={this.state.decks}
                                table={this.state.table}
                                sendMessage={this.sendMessage.bind(this)}
                />
            </div>
        );
    }
}
