import React from 'react';
import {Card} from "cards-library";
import "./CardComponent.css";

type Props = {
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

    public render() {
        let classNamesFaceHolder = "cardFaceHolder ";
        if (this.props.card.open)
            classNamesFaceHolder += "is-flipped ";

        if (this.isRedSuit()) {
            classNamesFaceHolder += "card-red-suit ";
        }

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
                    <div className="cardFace card-closed" style={this.props.stylesCardFace}>
                    </div>
                </div>
            </div>
        );
    }
}
