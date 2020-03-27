import Table from "./Table";
import { Deck, shuffledStandardDeck, standardDeck } from "./Deck";
import Card from "./Card";

export class State {
    table: Table;
    decks: Deck[];

    constructor(table: Table, decks: Deck[]) {
        this.table = table;
        this.decks = decks;
    }
}

export function initialState() {
    let cards: Card[] = [];
    let table = new Table(cards);
    let decks = [shuffledStandardDeck(), standardDeck()];
    return new State(table, decks);
}
