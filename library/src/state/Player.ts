import { nextUID, Vector } from "../Utils";
import Card from "./Card";
import Table from "./Table";

export default class Player {
    hand: Card[];
    id: string;
    name: string;
    pointer: Vector;

    constructor(clientId:string, hand: Card[], 
                pointer: Vector, name: string) {
        this.hand = hand;
        this.id = clientId;
        this.name = name;
        this.pointer = pointer;
    }
    
    addCardToHand(card: Card) {
        this.hand.push(card);
        return card;
    }

    removeCardFromHand(card: Card) {
        const index : number = this.hand.indexOf(card);
        if (index > -1) {
            this.hand.splice(index, 1);
        }
        else {
            console.log(`Card ${card.id} is not present in hand
                and can therefore not be removed`);
        }
    }

    findCardInHand(cardId: number) {
        return this.hand.find(c => c.id == cardId);
    }

    /** Get which card this player is dragging on the given table */
    getDraggingCard(table: Table) {
        return table.locatedCards.find(lc => lc.draggingPlayerID == this.id);
    }
}
