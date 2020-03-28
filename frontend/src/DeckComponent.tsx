import React from "react";
import {Deck} from "cards-library";
import "./DeckComponent.css";

type Props = {
    deck: Deck,
    sendMessage: (msg: any) => void,
    onClick: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void,
}

export default class DeckComponent extends React.Component<Props, {}> {
    private recallToThisDeck() {
        this.props.sendMessage({
            messageType: "recall_to_deck",
            deckId: this.props.deck.id,
        });
    }

    public render() {
        return (
            <div className="deck">
                <button onClick={this.recallToThisDeck.bind(this)}>&#8942;</button>
            <div className="inner-deck" onClick={this.props.onClick}>
                <div>
                    {this.props.deck.cards.length} cards
                </div>
            </div>
            </div>
        );
    }
}
