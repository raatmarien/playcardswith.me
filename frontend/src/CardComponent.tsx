import React from 'react';
import {Card, Deck} from "cards-library";
import "./CardComponent.css";
import CardOpenFaceComponent from "./CardOpenFaceComponent";

type Props = {
    decks: Deck[],
    card: Card,
    stylesCardFace: any,
    playingCardClasses: string,
};

export default class CardComponent extends React.Component<Props> {
    private getMyDeck() {
        return this.props.decks.filter(
            (d) => d.id === this.props.card.deckId)[0];
    }

    private getBackgroundColor() {
        let myDeck = this.getMyDeck();
        return myDeck.color;
    }

    public render() {
        let classNamesFaceHolder = "cardFaceHolder ";
        if (this.props.card.open)
            classNamesFaceHolder += "is-flipped ";

        let closedStyles = { backgroundColor: this.getBackgroundColor() };
        closedStyles = Object.assign(closedStyles, this.props.stylesCardFace);
        
        return (
            <div className={this.props.playingCardClasses}
                 ref={"card"+this.props.card.id} >
                <div className={classNamesFaceHolder}>
                    <div className="cardFace card-open" style={this.props.stylesCardFace}>
                        <CardOpenFaceComponent cardName={this.props.card.name}></CardOpenFaceComponent>
                    </div>
                    <div className="cardFace card-closed" style={closedStyles}>
                    </div>
                </div>
            </div>
        );
    }
}
