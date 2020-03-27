import { Room, Client } from "colyseus";
import { State, initialState, Card, Deck } from "cards-library";

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
        console.log("Someone joined")
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