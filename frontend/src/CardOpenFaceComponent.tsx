import React from 'react';
import "./CardOpenFaceComponent.css";

type Props = {
    cardName: string,
};

export default class CardOpenFaceComponent extends React.Component<Props> {
    private isRedSuit() {
        let cardName = this.props.cardName;

        let res = cardName.startsWith("♥") ||
                  cardName.startsWith("♦") ||
                  cardName == "🂿";
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

        if (this.isRedSuit()) {
            cardClassNames += "card-red-suit ";
        }

        if (this.isSimpleCard()) {
            // For cards with names of two characters, draw
            // these characters below each other.
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
 
            cardClassNames += "card-open-content-special ";

            //Render a single character bigger
            //Deal with emojis and other unicode correctly...
            var unicodeChars = Array.from(this.props.cardName);
            unicodeChars = unicodeChars.filter(c => c !== "\uFE0E");
            if (unicodeChars.length === 1)
                cardClassNames += "card-open-content-special-single ";

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