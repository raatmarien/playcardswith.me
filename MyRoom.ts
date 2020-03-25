import { Room, Client } from "colyseus";

export class MyRoom extends Room {

    onCreate (options: any) {
    }

    onJoin (client: Client, options: any) {
        console.log("Someone joined")
    }

    onMessage (client: Client, message: any) {
        console.log("New message:", message)
    }

    onLeave (client: Client, consented: boolean) {
    }

    onDispose() {
    }

}
