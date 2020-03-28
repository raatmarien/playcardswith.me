import React from 'react';
import './TableComponent.css';
import {Deck, Table, Player} from "cards-library";
import CardComponent from "./CardComponent";
import DecksComponent from "./DecksComponent";

type Props = {
    decks: Deck[],
    table: Table,
    sendMessage: (msg: any) => void,
    currentPlayerId: string | null,
    players: Player[],
};

export default class TableComponent extends React.Component<Props> {

    public render() {
        return (
            <div className="table">
                <DecksComponent
                    decks={this.props.decks}
                    sendMessage={this.props.sendMessage} />

                {this.props.table.locatedCards.map((locatedCard) => {
                    return <CardComponent locatedCard={locatedCard}
                                          sendMessage={this.props.sendMessage}
                                          key={locatedCard.card.id}
                                          currentPlayerId={this.props.currentPlayerId}
                                          players={this.props.players}/>
                    ;})}

            </div>
        );
    }
}
