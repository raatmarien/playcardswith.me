import "./TableComponent.css";
import React from 'react';
import './App.css';
import * as Colyseus from "colyseus.js";
import {State, initialState} from "cards-library";
import TableComponent from "./TableComponent";
import HeaderComponent from "./HeaderComponent";
import RoomHelper from "./RoomHelper";
import PointersComponent from "./PointersComponent";
import 'bootstrap/dist/css/bootstrap.min.css';

type Props = {
    roomId: string | undefined,
};

type AppState = {
    gameState: State,
    currentPlayerId: string,
    headerComponentRef: React.RefObject<HeaderComponent>,
};


export default class App extends React.Component<Props, AppState> {
    public room: Colyseus.Room<unknown> | null = null;

    constructor(props: Props) {
        super(props);
        this.state = {
            gameState: initialState(),
            currentPlayerId: "",
            headerComponentRef: React.createRef(),
        };
    }

    public componentDidMount() {
        //For better debugging, find servers on other computers too
        let url = new URL(window.location.href);
        let client = new Colyseus.Client("ws://" + url.hostname + ":2567");
        RoomHelper.connect(client, this.props.roomId)
                  .then((r:Colyseus.Room) => this.onRoomJoin(r));
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
                let headerComponent =
                    this.state.headerComponentRef.current;
                if (headerComponent !== null) {
                    headerComponent.onNameChange();
                }
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
            let target = (e.target as HTMLElement | null);
            // necessary? how to perform proper checks for cast?
            if(target === null){
                return;
            }
            // return variable for the loop
            type state = "continue" | "succeed" | "halt";

            let checkNode = (node: HTMLElement | null) => {
                let stops = ["root", "hand"];
                let halt = (node: HTMLElement)=>{
                    let classes = node.className.split(" ");
                    let union = new Set([...classes, ...stops]);
                    // see if there is overlap, if so halt
                    if(union.size !== (classes.length + stops.length))
                        return true;
                    return false;
                }

                if(node === null || node.className === undefined)
                    return "halt";
                if(halt(node))
                    return "halt";
                // request parent node has been found
                if(node.className.includes("table"))
                    return "succeed";
                return "continue";
            }

            let state: state;
            while((state=checkNode(target)) === "continue"){
                target = target.parentNode as HTMLElement;
            }

            if(state === "succeed")
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
                <HeaderComponent
                    ref={this.state.headerComponentRef}
                    sendMessage={this.sendMessage.bind(this)}
                    players={this.state.gameState.players}
                    currentPlayerId={this.state.currentPlayerId} />
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
