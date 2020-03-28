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

    onMessage (client: Client, message: any) {
        console.log("Message:", message);
        if (message.messageType === "card_drag") {
            let locatedCard
                = this.state.table.getLocatedCard(message.cardId);
            if (!locatedCard) {
                console.log("Invalid card id:", message.cardId);
                return;
            }
            locatedCard.location.x = message.cardX;
            locatedCard.location.y = message.cardY;

            this.state.table.bringCardToFront(locatedCard);
        } else if (message.messageType === "card_turn") {
            let locatedCard = this.state.table.getLocatedCard(message.cardId);
            if (!locatedCard) {
                console.log("Invalid card id:", message.cardId);
                return;
            }
            let card = locatedCard.card;
            card.open = !card.open;

            this.state.table.bringCardToFront(locatedCard);
        } else if (message.messageType === "pointer_move") {
            let player = this.state.getPlayer(message.playerId);

            if (player !== null) {
                player.pointer.x = message.pointerX;
                player.pointer.y = message.pointerY;
            }
        } else if (message.messageType === "pick_from_deck") {
            let deck = this.state.getDeck(message.deckId);
            if (deck === null) {
                console.log("Invalid deck id:", message.deckId);
                return;
            }
            let card = deck.takeTopCard();

            if (card !== undefined) {
                this.state.table.addNewCard(
                    card, new Vector(message.cardX, message.cardY));
            }
        } else if (message.messageType === "recall_to_deck") {
            this.state.recallToDeck(message.deckId);
        } else if (message.messageType === "shuffle_deck") {
            this.state.shuffleDeck(message.deckId);
        } else if (message.messageType === "add_deck") {
            this.state.addShuffledStandardDeck();
        }
    }

    onLeave (client: Client, consented: boolean) {
        console.log(client.id + "left");
        this.state.removePlayer(client.id);
    }

    onDispose() {
    }

}
