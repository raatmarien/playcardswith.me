import React from 'react';
import "./OwnHandComponent.css";
import {Card, Vector, Deck} from "cards-library";
import HandCardComponent from "./HandCardComponent";
import CardDragReleaseHandler from "./CardDragReleaseHandler";

type Props = {
    handRef: any,
    cards: Card[],
    decks: Deck[],
    sendMessage: (msg: any) => void,
    cardDragReleaseHandler: CardDragReleaseHandler,
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
                                 handRef={this.props.handRef}
                                 cardDragReleaseHandler={this.props.cardDragReleaseHandler}/>);
                 })}
            </div>
        );
    }
}
