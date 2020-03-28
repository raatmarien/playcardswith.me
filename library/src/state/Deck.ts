import Card from "./Card";
import { shuffle, nextUID } from "../Utils";

export class Deck {
    id: number;
    cards: Card[];

    constructor(cards: Card[]) {
        this.id = nextUID();
        this.cards = cards;

        this.annotateCardsWithThisDeck();
    }

    private annotateCardsWithThisDeck() {
        this.cards.forEach((card) => card.deckId = this.id);
    }

    public peakTop() {
        return this.cards[this.cards.length - 1];
    }

    takeTopCard() : Card | undefined {
        return this.cards.pop();
    }

    addToTop(card: Card) {
        card.open = false;
        card.deckId = this.id;
        this.cards.push(card);
    }

    addAll(cards: Card[]) {
        for (let card of cards) {
            this.addToTop(card);
        }
    }

    shuffleDeck() {
        this.cards = shuffle(this.cards);
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
            cards.push(new Card(suit + face, false));
        }
    }
    return cards;
}
