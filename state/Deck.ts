import Card from "./Card";

export default class Deck {
    cards: Card[];

    constructor(cards: Card[]) {
        this.cards = cards;
    }

    peakTop() {
        return this.cards[this.cards.length - 1];
    }

    takeTopCard() {
        return this.cards.pop();
    }

    addToTop(card: Card) {
        card.open = false;
        this.cards.push(card);
    }
}
