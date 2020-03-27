import { nextUID } from "../Utils";
import Card from "./Card";

export default class Player {
    hand: Card[];
    id: string;
    name: string;
    pointer: [number, number];

    constructor(clientId:string, hand: Card[], 
                pointer: [number, number], name: string) {
        this.hand = hand;
        this.id = clientId;
        this.name = name;
        this.pointer = pointer;
    }
}