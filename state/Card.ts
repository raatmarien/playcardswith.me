let nextId = 0;

export default class Card {
    id: number;
    x: number;
    y: number;
    name: string;
    open: boolean;

    constructor(x: number, y: number,
                name: string, open: boolean) {
        this.id = nextId++;
        this.x = x;
        this.y = y;
        this.name = name;
        this.open = open;
    }
}
