import React from 'react';
import "./CardOpenFaceComponent.css";

type Props = {
    cardName: string,
};

export default class CardOpenFaceComponent extends React.Component<Props> {
    private isRedSuit() {
        let cardName = this.props.cardName;

        let res = cardName.startsWith("♥") ||
                  cardName.startsWith("♦");
        return res;
    }

    private isSimpleCard() {
        let cardName = this.props.cardName;

        return cardName.startsWith("♥") ||
            cardName.startsWith("♦") ||
            cardName.startsWith("♣") ||
            cardName.startsWith("♠");
    }
    
    public render() {
        var cardClassNames = "card-open-content ";

        if (this.isSimpleCard()) {
            // For cards with names of two characters, draw
            // these characters below each other.
            
            if (this.isRedSuit()) {
                cardClassNames += "card-red-suit ";
            }

            return (
                <p className={cardClassNames}>
                    {this.props.cardName.slice(0, 1)}
                    <br></br>
                    {this.props.cardName.slice(1)}
                </p>
            );
        } else {
            // For cards with more than two characters, simply
            // draw the name
 
            cardClassNames += "card-open-content-special";

            return (
                <div className="fullCardFace">
                    <p className={cardClassNames}>
                        {this.props.cardName}
                    </p>
                </div>
            );
        }
    }
}