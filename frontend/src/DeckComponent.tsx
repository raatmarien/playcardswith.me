import React from "react";
import {Deck} from "cards-library";
import "./DeckComponent.css";

type Props = {
    deck: Deck,
}

export default class DeckComponent extends React.Component<Props, {}> {
    public render() {
        return (
            <div className="deck">
                {this.props.deck.cards.length}
            </div>
        );
    }
}
