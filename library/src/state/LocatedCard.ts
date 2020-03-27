import Card from "./Card";
import { Vector } from "../Utils";

export default class LocatedCard {
    card: Card;
    location: Vector;

    constructor(card: Card, location: Vector) {
        this.card = card;
        this.location = location;
    }
}
