import Card from "./Card";
import { shuffle } from "../Utils";

export class Deck {
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

export function shuffledStandardDeck() : Deck {
    return new Deck(shuffledStandardCards());
}

function shuffledStandardCards() : Card[] {
    let cards = standardCards();
    return shuffle(cards);
}

export function standardDeck() : Deck {
    return new Deck(standardCards());
}

function standardCards() : Card[] {
    let cards = []
    for (let c = 0; c < 4; c++) {
        let suit = ["♠", "♥", "♦", "♣"][c];
        for (let i = 0; i < 13; i++) {
            let face = "";
            if (i < 9) {
                face += (i+2);
            } else {
                face += ["J", "Q", "K", "A"][i-9];
            }
            cards.push(new Card(0, 0, suit + face, false));
        }
    }
    return cards;
}
