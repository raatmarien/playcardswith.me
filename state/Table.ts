import Card from "./Card";

export default class Table {
    cards: Card[];

    constructor(cards: Card[]) {
        this.cards = cards;
    }

    getCard(cardId: number) {
        for (let i = 0; i < this.cards.length; i++) {
            if (this.cards[i].id == cardId) {
                return this.cards[i];
            }
        }
        return null;
    }
}
