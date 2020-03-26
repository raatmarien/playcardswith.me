import { Room, Client } from "colyseus";

class State {
    table: Table;
    decks: Deck[];

    constructor(table: Table, decks: Deck[]) {
        this.table = table;
        this.decks = decks;
    }
}

class Table {
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

class Deck {
    cards: Card[];

    constructor(cards: Card[]) {
        this.cards = cards;
    }

    takeTopCard() {
        return this.cards.pop();
    }

    addToTop(card: Card) {
        card.open = false;
        this.cards.push(card);
    }
}

let nextId = 0;

class Card {
    id: number;
    x: number;
    y: number;
    name: string;
    open: boolean;

    constructor(x: number, y: number,
                name: string, open: boolean) {
        this.id = nextId++;
        this.x = x;
        this.y = y;
        this.name = name;
        this.open = open;
    }
}

export class MyRoom extends Room {
    state: State;

    constructor () {
        super();
        this.state = this.initialState();
    }

    initialState () {
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

    onCreate (options: any) {
        this.setState(this.state);
    }

    onJoin (client: Client, options: any) {
        console.log("Someone joined")
    }

    onMessage (client: Client, message: any) {
        console.log("Message:", message);
        if (message.messageType == "card_move") {
            let card = this.state.table.getCard(message.cardId);
            if (!card) {
                console.log("Invalid card id:", message.cardId);
                return;
            }
            card.x = message.cardX;
            card.y = message.cardY;
        } else if (message.messageType == "card_turn") {
            let card = this.state.table.getCard(message.cardId);
            if (!card) {
                console.log("Invalid card id:", message.cardId);
                return;
            }
            card.open = !card.open;
        }
    }

    onLeave (client: Client, consented: boolean) {
    }

    onDispose() {
    }

}
