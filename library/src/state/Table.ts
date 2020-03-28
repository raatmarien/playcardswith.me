import LocatedCard from "./LocatedCard";

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
}
