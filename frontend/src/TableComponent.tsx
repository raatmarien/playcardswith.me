import React from 'react';
import './TableComponent.css';
import {Deck, Table, Player} from "cards-library";
import TableCardComponent from "./TableCardComponent";
import DecksComponent from "./DecksComponent";
/* import OwnHandComponent from "./OwnHandComponent";*/

type Props = {
    decks: Deck[],
    table: Table,
    sendMessage: (msg: any) => void,
    currentPlayerId: string | null,
    players: Player[],
};

export default class TableComponent extends React.Component<Props> {
    public render() {
        let deckRefs : { [id: number] : React.RefObject<HTMLDivElement> } = {};

        for (let i = 0; i < this.props.decks.length; i++) {
            deckRefs[this.props.decks[i].id] = React.createRef();
        }

        return (
            <div className="table">
                <DecksComponent
                    decks={this.props.decks}
                    deckRefs={deckRefs}
                    sendMessage={this.props.sendMessage} />

                {this.props.table.locatedCards.map((locatedCard) => {
                     return <TableCardComponent locatedCard={locatedCard}
                                                sendMessage={this.props.sendMessage}
                                                key={locatedCard.card.id}
                                                currentPlayerId={this.props.currentPlayerId}
                                                players={this.props.players}
                                                deckRef={deckRefs[locatedCard.card.deckId!]}
                            />
                     ;})}

            </div>
        );
    }
}
