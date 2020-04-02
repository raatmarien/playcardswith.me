import React from 'react';
import {Card, Deck} from "cards-library";
import "./CardComponent.css";

type Props = {
    decks: Deck[],
    card: Card,
    stylesCardFace: any,
    playingCardClasses: string,
};

export default class CardComponent extends React.Component<Props> {
    private isRedSuit() {
        let cardName = this.props.card.name;

        let res = cardName.startsWith("♥") ||
                  cardName.startsWith("♦");
        return res;
    }

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

        if (this.isRedSuit()) {
            classNamesFaceHolder += "card-red-suit ";
        }

        let closedStyles = { backgroundColor: this.getBackgroundColor() };
        closedStyles = Object.assign(closedStyles, this.props.stylesCardFace);
        
        return (
            <div className={this.props.playingCardClasses}
                 ref={"card"+this.props.card.id} >
                <div className={classNamesFaceHolder}>
                    <div className="cardFace card-open" style={this.props.stylesCardFace}>
                        <p className="card-open-content">
                            {this.props.card.name.slice(0, 1)}
                            <br></br>
                            {this.props.card.name.slice(1)}
                        </p>
                    </div>
                    <div className="cardFace card-closed" style={closedStyles}>
                    </div>
                </div>
            </div>
        );
    }
}
