import React from 'react';
import './App.css';
import * as Colyseus from "colyseus.js";
import {State, initialState} from "cards-library";
import CardComponent from "./CardComponent";

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

    private onCardClick(id: number) {
        if (this.room) {
            this.room.send({
                messageType: "card_turn",
                cardId: id,
            });
        }
    }


    public render() {
        return (
            <div className="App">
                <span>Number of cards: {this.state.table.locatedCards.length}</span>
                <ul>
                {this.state.table.locatedCards.map((locatedCard) => {
                    return <CardComponent
                               locatedCard={locatedCard}
                               onClick={() => this.onCardClick(locatedCard.card.id)}
                    />
                })}
                </ul>
            </div>
        );
    }
}
