import LocatedCard from "./LocatedCard";
import Card from "./Card";

export default class Table {
    locatedCards: LocatedCard[];

    constructor(locatedCards: LocatedCard[]) {
        this.locatedCards = locatedCards;
    }

    getLocatedCard(cardId: number) {
        for (let i = 0; i < this.locatedCards.length; i++) {
            if (this.locatedCards[i].card.id == cardId) {
                return this.locatedCards[i];
            }
        }
        return null;
    }

    /** Get the highest z-index of all cards on the table */
    getHighestZIndex() {
        var highestZIndex = -1;
        for (let card of this.locatedCards) {
            if (card.zIndex > highestZIndex)
                highestZIndex = card.zIndex;
        }
        return highestZIndex;
    }

    bringCardToFront(locatedCard:LocatedCard) {
        let highestZIndex = this.getHighestZIndex();
        if (locatedCard.zIndex != highestZIndex)
            locatedCard.zIndex = highestZIndex + 1;
    }
}
