import "./TableComponent.css";
import React from 'react';
import './App.css';
import * as Colyseus from "colyseus.js";
import {State, initialState} from "cards-library";
import TableComponent from "./TableComponent";
import RoomHelper from "./RoomHelper";
import PointersComponent from "./PointersComponent";
import 'bootstrap/dist/css/bootstrap.min.css';

type Props = {};

type AppState = {
    gameState: State,
    currentPlayerId: string;
};


export default class App extends React.Component<Props, AppState> {
    public room: Colyseus.Room<unknown> | null = null;

    constructor(props: Props) {
        super(props);
        this.state = {
            gameState: initialState(),
            currentPlayerId: "",
        };
    }

    public componentDidMount() {
        //For better debugging, find servers on other computers too
        let url = new URL(window.location.href);
        let client = new Colyseus.Client("ws://" + url.hostname + ":2567");
        RoomHelper.connect(client).then((r:Colyseus.Room) => this.onRoomJoin(r));
    }

    private onRoomJoin(room: Colyseus.Room) {
        console.log("joined");
        this.room = room;

        this.setState({
            currentPlayerId: this.room.sessionId,
        });

        room.onStateChange.once(this.updateRoomState.bind(this));

        // new room state
        room.onStateChange(this.updateRoomState.bind(this));

        // listen to patches coming from the server
        room.onMessage(this.handleIncomingMessage.bind(this));
    }

    private handleIncomingMessage(message: any) {
        switch(message.messageType) {
            case "request_username_update": {
                console.log(message);
                console.log(this);
                this.usernamePopUp();
                break;
            }
            default : {
                console.error("Message type not supported", message)
                break;
            }
        }
    }

    private updateRoomState(state: any) {
        this.setState({
            gameState: state
        });
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
    private usernamePopUp(){
        let username = prompt("Please enter your username", "Player " + (this.state.gameState.players.length+1));
        let msg = {messageType: "update_player_name", 
                   username: username,
                   playerId: this.state.currentPlayerId}
        this.sendMessage(msg);
    }

    public render() {
        return (
            <div className="App" onMouseMove={this.onMouseMove.bind(this)}>
                <PointersComponent players={this.state.gameState.players}
                                   currentPlayerId={this.state.currentPlayerId}/>
                <TableComponent decks={this.state.gameState.decks}
                                table={this.state.gameState.table}
                                sendMessage={this.sendMessage.bind(this)}
                                currentPlayerId={this.state.currentPlayerId}
                                players={this.state.gameState.players}
                />
            </div>
        );
    }
}
