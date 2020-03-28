import { nextUID } from "../Utils";

export default class Card {
    id: number;
    deckId: number | null = null;
    name: string;
    open: boolean;

    constructor(name: string, open: boolean) {
        this.id = nextUID();
        this.name = name;
        this.open = open;
    }
}
