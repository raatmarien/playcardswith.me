import React from 'react';
import './TableComponent.css';
import {Deck, Table} from "cards-library";
import CardComponent from "./CardComponent";
import DecksComponent from "./DecksComponent";

type Props = {
    decks: Deck[],
    table: Table,
    sendMessage: (msg: any) => void,
};

export default class TableComponent extends React.Component<Props> {
    public render() {
        let deckRefs : { [id: number] : any } = {};

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
                    return <CardComponent locatedCard={locatedCard}
                                          sendMessage={this.props.sendMessage}
                                          key={locatedCard.card.id}
                                          deckRef={deckRefs[locatedCard.card.deckId!]}
                    />
                    ;})}

            </div>
        );
    }
}
