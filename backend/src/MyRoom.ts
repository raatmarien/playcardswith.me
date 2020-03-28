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
        if (message.messageType == "card_drag") {
            let locatedCard
                = this.state.table.getLocatedCard(message.cardId);
            if (!locatedCard) {
                console.log("Invalid card id:", message.cardId);
                return;
            }
            
            if (locatedCard.draggingPlayerID !== null &&
                locatedCard.draggingPlayerID !== client.sessionId) {
                //maybe send a message to the client?
                return;
            }
            let player = this.state.getPlayer(client.sessionId);
            if (player == null) {
                console.log("That player does not exist:" + client.sessionId);
                return;
            }
            let playerDraggingCard = player.getDraggingCard(this.state.table);
            if (locatedCard.draggingPlayerID === null && playerDraggingCard !== undefined) {
                //The player tries to drag two cards at once,
                //this is not allowed
                return;
            }
            
            locatedCard.location.x = message.cardX;
            locatedCard.location.y = message.cardY;
            locatedCard.draggingPlayerID = client.sessionId;

            this.state.table.bringCardToFront(locatedCard);
        } else if (message.messageType == "card_release") {
            let player = this.state.getPlayer(client.sessionId);
            if (player == null) {
                console.log("That player does not exist:" + player);
                return;
            }
            let draggingCard = player.getDraggingCard(this.state.table);
            if (draggingCard == null) {
                console.log("Player requested to release without dragging:", client.sessionId);
                return;
            }
            draggingCard.draggingPlayerID = null;
        } else if (message.messageType == "card_turn") {
            let locatedCard = this.state.table.getLocatedCard(message.cardId);
            if (!locatedCard) {
                console.log("Invalid card id:", message.cardId);
                return;
            }
            if (locatedCard.draggingPlayerID !== null &&
                locatedCard.draggingPlayerID !== client.sessionId) {
                //maybe send a message to the client?
                return;
            }
            let card = locatedCard.card;
            card.open = !card.open;

            this.state.table.bringCardToFront(locatedCard);
        } else if (message.messageType == "pointer_move") {
            let player = this.state.getPlayer(message.playerId);

            if (player !== null) {
                player.pointer.x = message.pointerX;
                player.pointer.y = message.pointerY;
            }
        } else if (message.messageType == "pick_from_deck") {
            let deck = this.state.getDeck(message.deckId);
            if (deck === null) {
                console.log("Invalid deck id:", message.deckId);
                return;
            }
            let card = deck.takeTopCard()!;
            this.state.table.addNewCard(
                card, new Vector(message.cardX, message.cardY));
        }
    }

    onLeave (client: Client, consented: boolean) {
        console.log(client.id + " left");
        this.state.removePlayer(client.id);
    }

    onDispose() {
    }

}
