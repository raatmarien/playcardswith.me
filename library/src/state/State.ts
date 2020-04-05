import Table from "./Table";
import { Deck, shuffledStandardDeck, standardDeck, newDeck } from "./Deck";
import LocatedCard from "./LocatedCard";
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

    public removePlayer(id: string) {
        let index = this.getPlayerIndex(id);
        if (index !== null) {
            let player = this.players[index];
            //Find whether this player has claimed any card. If so, unclaim it
            let claimedCard = player.getDraggingCard(this.table);
            if (claimedCard !== undefined) {
                claimedCard.draggingPlayerID = null;
            }

            // Return the cards from the player's hand back into their
            // decks
            // When we have a sink we should put it in the sink
            // instead
            for (let i = 0; i < player.hand.length; i++) {
                let card = player.hand[i];
                if (card.deckId !== null) {
                    let deck = this.getDeck(card.deckId);
                    if (deck) {
                        deck.addToRandom(card);
                    }
                }
            }

            this.players.splice(index, 1);
        }
    }


    public addShuffledStandardDeck() {
        this.decks.push(shuffledStandardDeck());
    }

    public addDeck(message: any) {
        this.decks.push(newDeck(message));
    }

    private getPlayerIndex(id: string): number | null {
        for (let i = 0; i < this.players.length; i++) {
            if (this.players[i].id === id) {
                return i;
            }
        }

        return null;
    }

    public getPlayer(id: string): Player | null {
        let index = this.getPlayerIndex(id);
        if (index !== null) {
            return this.players[index];
        } else {
            return null;
        }
    }

    public getDeck(id: number): Deck | null {
        for (let deck of this.decks) {
            if (deck.id === id) {
                return deck;
            }
        }

        console.log("Invalid deckId:", id);
        return null;
    }

    public recallToDeck(deckId: number) {
        let deck = this.getDeck(deckId);

        if (deck !== null) {
            let cards = this.table.removeCardsBelongingToDeck(deckId);
            for (let i = 0; i < this.players.length; i++) {
                cards = cards.concat(
                    this.players[i].removeCardsBelongingToDeck(deckId));
            }

            deck.addAll(cards);
        }
    }

    public removeDeck(deckId: number) {
        let deck = this.getDeck(deckId);

        if (deck !== null) {
            this.recallToDeck(deckId);

            let deckIndex = 0;

            for (let i = 0; i < this.decks.length; i++) {
                if (this.decks[i].id === deckId) {
                    deckIndex = i;
                }
            }

            this.decks.splice(deckIndex, 1);
        }
    }

    public dealCards(deckId: number, amount: number,
                     shuffleDeck: boolean) {
        let deck = this.getDeck(deckId);

        if (deck !== null) {
            if (shuffleDeck) {
                deck.shuffleDeck();
            }

            let totalCardsToDeal = amount * this.players.length;

            if (totalCardsToDeal > deck.cards.length) {
                console.log("Attempting to deal more cards than there "
                    + "are from deck: ", deckId);
                return;
            }

            for (let i = 0; i < totalCardsToDeal; i++) {
                let card = deck.takeTopCard();
                let player = this.players[i % this.players.length];
                player.addCardToHand(card!);
            }
        }
    }

    public shuffleDeck(deckId: number) {
        let deck = this.getDeck(deckId);

        if (deck !== null) {
            deck.shuffleDeck();
        }
    }

    // Find card anywhere
    private findCard(cardId: number) {
        let locatedCard = this.table.getLocatedCard(cardId);
        if (locatedCard !== null) {
            return locatedCard.card;
        }
        for (let i = 0; i < this.decks.length; i++) {
            let deck = this.decks[i];
            for (let j = 0; j < deck.cards.length; j++) {
                if (cardId === deck.cards[j].id) {
                    return deck.cards[j];
                }
            }
        }
        for (let i = 0; i < this.players.length; i++) {
            let player = this.players[i];
            for (let j = 0; j < player.hand.length; j++) {
                if (cardId === player.hand[j].id) {
                    return player.hand[j];
                }
            }
        }
        return null;
    }

    private removeCardFromHands(cardId: number) {
        for (let i = 0; i < this.players.length; i++) {
            this.players[i].hand = this.players[i].hand.filter(
                (c) => c.id !== cardId);
        }
    }

    public returnCardToDeck(cardId: number) {
        let card = this.findCard(cardId);
        if (card) {
            let deck = this.getDeck(card.deckId!);
            if (deck !== null) {
                this.table.removeCard(card.id);
                this.removeCardFromHands(card.id);
                deck.addToTop(card);
            }
        }
    }

    public moveCardInHand(cardId: number, playerId: string,
                          newIndex: number) {
        let player = this.getPlayer(playerId);
        if (player) {
            player.moveCardInHand(cardId, newIndex);
        } else {
            console.log("Player not found:", playerId);
        }
    }
}

export function initialState() {
    let locatedCards: LocatedCard[] = [];
    let players: Player[] = [];
    let table = new Table(locatedCards);
    let decks: Deck[] = [shuffledStandardDeck()];
    return new State(table, decks, players);
}
