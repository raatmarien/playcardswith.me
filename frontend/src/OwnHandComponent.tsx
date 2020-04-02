import React from 'react';
import "./OwnHandComponent.css";
import {Card, Vector, Deck} from "cards-library";
import HandCardComponent from "./HandCardComponent";

type Props = {
    handRef: any,
    cards: Card[],
    decks: Deck[],
    sendMessage: (msg: any) => void,
};

export default class OwnHandComponent extends React.Component<Props> {
    private locationFor(index: number) {
        return new Vector(index * 100, 0);
    }

    public render() {
        return (
            <div className="ownHand" ref={this.props.handRef}>
                <p>Your hand:</p>
                {this.props.cards.map((card, index) => {
                    return (<HandCardComponent
                                key={"handcard-"+card.id}
                                card={card}
                                decks={this.props.decks}
                                sendMessage={this.props.sendMessage}
                                location={this.locationFor(index)}
                                handRef={this.props.handRef} />);
                 })}
            </div>
        );
    }
}
