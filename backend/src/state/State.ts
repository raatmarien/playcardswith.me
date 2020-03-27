import Table from "./Table";
import { Deck, shuffledStandardDeck, standardDeck } from "./Deck";
import Card from "./Card";
import Player from "./Player";

export class State {
    table: Table;
    decks: Deck[];
    players: Player[];

    constructor(table: Table, decks: Deck[], players: Player[]) {
        this.table = table;
        this.decks = decks;
        this.players = players;
    }

    addPlayer(player: Player) {
        this.players.push(player);
    }
}

export function initialState() {
    let cards: Card[] = [];
    let players: Player[] = [];
    let table = new Table(cards);
    let decks = [shuffledStandardDeck(), standardDeck()];
    return new State(table, decks, players);
}
