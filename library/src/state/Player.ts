import { nextUID, Vector } from "../Utils";
import Card from "./Card";

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
            console.log(`Card ${card.id} is not present in deck 
                and can therefore not be removed`);
        }
    }
}
