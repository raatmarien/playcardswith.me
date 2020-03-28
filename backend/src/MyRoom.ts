import { Room, Client } from "colyseus";
import { State, initialState, LocatedCard, Card, Deck, Player, Vector } from "cards-library";

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
        let pointer : Vector = new Vector(0, 0);
        let player = new Player(client.id, hand, pointer, client.id);

        this.state.addPlayer(player);
    }
b
    onMessage (client: Client, message: any) {
        console.log("Message:", message);
        if (message.messageType == "card_drag") {
            let locatedCard
                = this.state.table.getLocatedCard(message.cardId);
            console.log(locatedCard);
            if (!locatedCard) {
                for (let i = 0;
                     i < this.state.decks.length; i++) {
                    let deck = this.state.decks[i];
                    if (deck.peakTop().id == message.cardId) {
                        let card = deck.takeTopCard()!;
                        this.state.table.locatedCards.push(
                            new LocatedCard(card, new Vector(
                                message.cardX, message.cardY)));
                        return;
                    }
                }

                console.log("Invalid card id:", message.cardId);
                return;
            }
            locatedCard.location.x = message.cardX;
            locatedCard.location.y = message.cardY;
        } else if (message.messageType == "card_turn") {
            let locatedCard = this.state.table.getLocatedCard(message.cardId);
            if (!locatedCard) {
                console.log("Invalid card id:", message.cardId);
                return;
            }
            let card = locatedCard.card;
            card.open = !card.open;
        }
    }

    onLeave (client: Client, consented: boolean) {
    }

    onDispose() {
    }

}
