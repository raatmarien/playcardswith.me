import * as Colyseus from "colyseus.js";

export default class RoomHelper {
    private static getRoomIDFromURL() {
        let url = new URL(window.location.href);
        return url.searchParams.get("r");
    }

    private static changeRoomIDInUrl(roomID:string) {
        window.history.replaceState({}, "", "?r=" + roomID)
    }

    public static createPrivateRoom(client:Colyseus.Client) {
        return client.create("room").then(room => {
            this.changeRoomIDInUrl(room.id);
            return room;
        });
    }

    public static joinPrivateRoom(client:Colyseus.Client, roomID:string) {
        return client.joinById(roomID).then(room => {
            this.changeRoomIDInUrl(room.id);
            return room;
        }).catch(reason => {
            alert("That room does not exist! Creating a new one.");
            return this.createPrivateRoom(client);
        });
    }

    public static connect(client:Colyseus.Client) {
        var roomID = this.getRoomIDFromURL();
        if (roomID === null) {
            //For now, join the global join for easier testing
            return client.joinOrCreate("room").then(room => {
                this.changeRoomIDInUrl(room.id);
                return room;
            });
        }

        if (roomID === "new") {
            return this.createPrivateRoom(client);
        }

        return this.joinPrivateRoom(client, roomID);
    }
}