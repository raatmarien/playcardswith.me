import Card from "./Card";
import { shuffle, nextUID } from "../Utils";

export class Deck {
    id: number;
    cards: Card[];
    color: string;

    constructor(cards: Card[], color: string = '#b90e0e') {
        this.id = nextUID();
        this.cards = cards;
        this.color = color;

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

export function newDeck(message: any) : Deck {
    let cards = [];
    for (let i = 0; i < message.amountOfEach; i++) {
        for (let c = 0; c < message.includedCards.length; c++) {
            for (let s = 0; s < message.includedSuits.length; s++) {
                cards.push(new Card(
                    message.includedSuits[s] +
                        message.includedCards[c],
                    false));
            }
        }

        for (let s = 0; s < message.includedSpecialCards.length; s++) {
            cards.push(new Card(
                message.includedSpecialCards[s],
                false));
        }
    }
    if (message.shuffleDeck) {
        cards = shuffle(cards);
    }
    return new Deck(cards, message.deckColor);
}
