import { Room, Client } from "colyseus";

class Card {
    x: number = 0;
    y: number = 0;
    name: string = "";
    open: boolean = true;

    constructor(x: number, y: number,
                name: string, open: boolean) {
        this.x = x;
        this.y = y;
        this.name = name;
        this.open = open;
    }
}

export class MyRoom extends Room {

    onCreate (options: any) {
        let cards = [
            new Card(0, 0, "3H", true),
            new Card(300, 50, "5H", true),
            new Card(500, 0, "9H", false)];

        this.setState(cards);
    }

    onJoin (client: Client, options: any) {
        console.log("Someone joined")
    }

    onMessage (client: Client, message: any) {
        console.log("Message:", message);
        if (message.messageType == "card_move") {
            let card = this.state[message.cardId];
            card.x = message.cardX;
            card.y = message.cardY;
        } else if (message.messageType == "card_turn") {
            let card = this.state[message.cardId];
            card.open = !card.open;
        }
    }

    onLeave (client: Client, consented: boolean) {
    }

    onDispose() {
    }

}
