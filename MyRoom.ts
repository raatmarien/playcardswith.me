import { Room, Client } from "colyseus";

export class MyRoom extends Room {

    onCreate (options: any) {
        this.setState({ cardX: 0, cardY: 0 });
    }

    onJoin (client: Client, options: any) {
        console.log("Someone joined")
    }

    onMessage (client: Client, message: any) {
        console.log("Message:", message);
        if (message.cardX) {
            this.state = message;
        }
    }

    onLeave (client: Client, consented: boolean) {
    }

    onDispose() {
    }

}
