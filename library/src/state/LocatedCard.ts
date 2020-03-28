import Card from "./Card";
import { Vector } from "../Utils";

export default class LocatedCard {
    card: Card;
    location: Vector;
    /** The Z-Index of this card. A higher number will lie on top. */
    zIndex: number;
    draggingPlayerID: string | null = null;

    constructor(card: Card, location: Vector, zIndex: number) {
        this.card = card;
        this.location = location;
        this.zIndex = zIndex;
    }
}
