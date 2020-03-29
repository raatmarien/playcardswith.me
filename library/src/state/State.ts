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

    public updatePlayer(player: Player) {
        let index = this.getPlayerIndex(player.id);
        if (index !== null) {
            this.players[index] = player;
        } else {
            console.log(`Player {$player} was not found and could therefore not be updated`);
        }
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

        console.log("Invalid deckId:", id);
        return null;
    }

    public recallToDeck(deckId: number) {
        let deck = this.getDeck(deckId);

        if (deck !== null) {
            let cards = this.table.removeCardsBelongingToDeck(deckId);

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

    public shuffleDeck(deckId: number) {
        let deck = this.getDeck(deckId);

        if (deck !== null) {
            deck.shuffleDeck();
        }
    }

    public returnCardToDeck(cardId: number) {
        let locatedCard = this.table.getLocatedCard(cardId);

        if (locatedCard !== null) {
            let deck = this.getDeck(locatedCard.card.deckId!);
            if (deck !== null) {
                this.table.removeCard(locatedCard.card.id);
                deck.addToTop(locatedCard.card);
            }
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
