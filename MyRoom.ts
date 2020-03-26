import { Room, Client } from "colyseus";

class Card {
    x: number = 0;
    y: number = 0;
    name: string = "";

    constructor(x: number, y: number, name: string) {
        this.x = x;
        this.y = y;
        this.name = name;
    }
}

export class MyRoom extends Room {

    onCreate (options: any) {
        let cards = [
            new Card(0, 0, "3H"),
            new Card(300, 50, "5H"),
            new Card(500, 0, "9H")];

        this.setState(cards);
    }

    onJoin (client: Client, options: any) {
        console.log("Someone joined")
    }

    onMessage (client: Client, message: any) {
        console.log("Message:", message);
        if (message.messageType = "card_update") {
            let card = this.state[message.cardId];
            card.x = message.cardX;
            card.y = message.cardY;
        }
    }

    onLeave (client: Client, consented: boolean) {
    }

    onDispose() {
    }

}
