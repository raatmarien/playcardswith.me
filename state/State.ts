import Table from "./Table";
import Deck from "./Deck";
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
    let cards = [
        new Card(150, 200, "3H", true),
        new Card(450, 200, "5H", true),
        new Card(750, 200, "9H", false)];
    let table = new Table(cards);
    let decks = [new Deck([
        new Card(0, 0, "1C", false),
        new Card(0, 0, "2C", false),
        new Card(0, 0, "3C", false)])];
    return new State(table, decks);
}
