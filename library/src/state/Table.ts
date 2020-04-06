import LocatedCard from "./LocatedCard";
import Card from "./Card";
import { Vector } from "../Utils";

export default class Table {
    locatedCards: LocatedCard[];

    constructor(locatedCards: LocatedCard[]) {
        this.locatedCards = locatedCards;
    }

    getLocatedCard(cardId: number) {
        for (let i = 0; i < this.locatedCards.length; i++) {
            if (this.locatedCards[i].card.id == cardId) {
                return this.locatedCards[i];
            }
        }

        return null;
    }

    /** Get the highest z-index of all cards on the table */
    getHighestZIndex() {
        var highestZIndex = -1;
        for (let card of this.locatedCards) {
            if (card.zIndex > highestZIndex)
                highestZIndex = card.zIndex;
        }
        return highestZIndex;
    }

    bringCardToFront(locatedCard:LocatedCard) {
        let highestZIndex = this.getHighestZIndex();
        if (locatedCard.zIndex != highestZIndex)
            locatedCard.zIndex = highestZIndex + 1;
    }

    public addNewCard(card: Card, location: Vector): LocatedCard {
        let newLocatedCard = new LocatedCard(card, location,
            this.getHighestZIndex() + 1);
        this.locatedCards.push(newLocatedCard);
        return newLocatedCard;
    }

    public removeCard(cardId: number) {
        this.locatedCards = this.locatedCards.filter(
            (l) => l.card.id !== cardId);
    }

    public removeCardsBelongingToDeck(deckId: number): Card[] {
        let cards = [];
        let cardIndices = [];

        for (let i = 0; i < this.locatedCards.length; i++) {
            if (this.locatedCards[i].card.deckId === deckId) {
                cards.push(this.locatedCards[i].card);
                cardIndices.push(i);
            }
        }

        this.locatedCards =
            this.removeSortedIndices(this.locatedCards, cardIndices);

        return cards;
    }

    /**
     * Remove all `indices` from list, and return the new list.
     *
     ***********************************************
     ***** ONLY WORKS IF: `indices` is sorted. *****
     ***********************************************
     *
     */
    private removeSortedIndices<T>(list: T[], indices: number[]): T[] {
        if (indices.length === 0) {
            return list;
        }

        let newList = [];
        let j = 0;

        for (let i = 0; i < list.length; i++) {
            if (indices.length <= j || i !== indices[j]) {
                newList.push(list[i]);
            } else {
                j++;
            }
        }

        return newList;
    }
}
