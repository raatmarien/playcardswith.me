import Table from "./Table";
import { Deck, shuffledStandardDeck, standardDeck } from "./Deck";
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
            //Find whether this player has claimed any card. If so, unclaim it
            let claimedCard = this.players[index].getDraggingCard(this.table);
            if (claimedCard !== undefined) {
                claimedCard.draggingPlayerID = null;
            }

            this.players.splice(index, 1);
        }
    }


    public addShuffledStandardDeck() {
        this.decks.push(shuffledStandardDeck());
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

        return null;
    }

    public recallToDeck(deckId: number) {
        let deck = this.getDeck(deckId);

        if (deck !== null) {
            let cards = this.table.removeCardsBelongingToDeck(deckId);

            deck.addAll(cards);
        } else {
            console.log("Invalid deckId:", deckId);
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
        } else {
            console.log("Invalid deckId:", deckId);
        }
    }

    public shuffleDeck(deckId: number) {
        let deck = this.getDeck(deckId);

        if (deck !== null) {
            deck.shuffleDeck();
        } else {
            console.log("Invalid deckId:", deckId);
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
