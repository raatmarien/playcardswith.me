import { Room, Client } from "colyseus";
import { State, initialState } from "./state/State";
import Card from "./state/Card";
import { Deck } from "./state/Deck";
import Player from "./state/Player";

export class MyRoom extends Room {
    state: State;

    constructor () {
        super();
        this.state = initialState();
    }

    onCreate (options: any) {
        this.setState(this.state);
    }

    onJoin (client: Client, options: any) {
        console.log(`${client.id} joined`);

        let hand: Card[] = [];
        let pointer : [number, number] = [0,0];
        let player = new Player(client.id, hand, pointer, client.id);

        this.state.addPlayer(player);
    }

    onMessage (client: Client, message: any) {
        console.log("Message:", message);
        if (message.messageType == "card_move") {
            let card
                = this.state.table.getCard(message.cardId);
            if (!card) {
                for (let i = 0;
                     i < this.state.decks.length && !card; i++) {
                    let deck = this.state.decks[i];
                    if (deck.peakTop().id == message.cardId) {
                        card = deck.takeTopCard()!;
                        this.state.table.cards.push(card!);
                    }
                }
            }
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
