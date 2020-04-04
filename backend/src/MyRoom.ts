import { Room, Client } from "colyseus";
import { State, initialState, LocatedCard, Card, Deck, Player, Vector } from "cards-library";

let numberOfRooms = 0;
let numberOfPeople = 0;

function generateRandomRoomIdentifier(): string {
    let numberOfLetters = 5;
    let spaceOfLetter = 26;
    let options = Math.pow(26, 5);

    let integer = Math.floor(Math.random() * (options - 1));
    let identifier = "";

    for (let i = 0; i < numberOfLetters; i++) {
        let currentLetter = integer % spaceOfLetter;
        integer = Math.floor(integer / spaceOfLetter);

        identifier += String.fromCharCode("A".charCodeAt(0) + currentLetter)
    }

    return identifier;
}


export class MyRoom extends Room {
    state: State;

    constructor () {
        super();
        this.state = initialState();
    }

    onCreate (options: any) {
        this.setState(this.state);
        this.setPrivate(); // All rooms are private for now!

        this.roomId = generateRandomRoomIdentifier();

        numberOfRooms++;
        console.log("Number of rooms: " + numberOfRooms);
    }

    onJoin (client: Client, options: any) {
        numberOfPeople++;
        console.log("Number of people: " + numberOfPeople);


        let hand: Card[] = [];
        let pointer : Vector = new Vector(0, 0);
        let player = new Player(client.id, hand, pointer, client.id);
        this.state.addPlayer(player);

        this.send(client, {messageType: "request_username_update"});
    }

    onMessage (client: Client, message: any) {
        if (message.messageType === "card_drag") {
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

            player.startDraggingCard(this.state.table, locatedCard);

            locatedCard.location.x = message.cardX;
            locatedCard.location.y = message.cardY;
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
        } else if (message.messageType === "card_turn") {
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
                //Let the player drag this card
                let player = this.state.getPlayer(client.sessionId);
                if (player === null) {
                    console.log("That player does not exist:" + client.sessionId);
                    return;
                }

                let locatedCard = this.state.table.addNewCard(
                    card, new Vector(message.cardX, message.cardY));

                player.startDraggingCard(this.state.table, locatedCard);
            }
        } else if (message.messageType === "recall_to_deck") {
            this.state.recallToDeck(message.deckId);
        } else if (message.messageType === "shuffle_deck") {
            this.state.shuffleDeck(message.deckId);
        } else if (message.messageType === "deal_cards") {
            this.state.dealCards(message.deckId,
                                 message.amountPerPlayer,
                                 message.reShuffleDeck);
        } else if (message.messageType === "add_deck") {
            if ((message.amountOfEach * (message.includedCards.length
                * message.includedSuits.length + message.includedSpecialCards.length)) > 10000) {
                console.log("User attempted to create too large deck:",
                            message);
            } else {
                this.state.addDeck(message);
            }
        } else if (message.messageType === "remove_deck") {
            this.state.removeDeck(message.deckId);
        } else if (message.messageType === "return_card_to_deck") {
            this.state.returnCardToDeck(message.cardId);
        } else if (message.messageType === "update_player_name") {
            let player = this.state.getPlayer(message.playerId);
            if (player !== null) {
                player.name = message.username;
            }
        } else if (message.messageType === "add_card_to_hand") {
            let locatedCard = this.state.table.getLocatedCard(message.cardId);
            if (!locatedCard) {
                console.log("Invalid card id:", message.cardId);
                return;
            }
            
            //You cannot add cards to your hand that another player is dragging
            if (locatedCard.draggingPlayerID !== null &&
                locatedCard.draggingPlayerID !== client.sessionId) {
                //maybe send a message to the client?
                return;
            }

            //Find the player
            let player = this.state.getPlayer(client.sessionId);
            if (player == null) {
                console.log("That player does not exist:" + client.sessionId);
                return;
            }

            this.state.table.removeCard(message.cardId);

            player.addCardToHand(locatedCard.card, message.index);
        } else if (message.messageType === "remove_card_from_hand") {
            //Find the player
            let player = this.state.getPlayer(client.sessionId);
            if (player == null) {
                console.log("That player does not exist:" + client.sessionId);
                return;
            }

            let card = player.findCardInHand(message.cardId);

            if (card === undefined) {
                console.log("That card does not exist: " + message.cardId);
                return;   
            }
            
            player.removeCardFromHand(card);

            this.state.table.addNewCard(
                card, new Vector(message.cardX, message.cardY));
        } else if (message.messageType === "move_card_in_hand") {
            this.state.moveCardInHand(message.cardId,
                client.sessionId, message.index);
        } else {
            console.log("Invalid message:", message);
        }
    }

    onLeave (client: Client, consented: boolean) {
        numberOfPeople--;
        console.log("Number of people: " + numberOfPeople);


        this.state.removePlayer(client.id);
    }

    onDispose() {
        numberOfRooms--;
        console.log("Number of rooms: " + numberOfRooms);
    }

}
