import * as Colyseus from "colyseus.js";

export default class RoomHelper {
    private static changeRoomIDInUrl(roomID:string) {
        window.history.replaceState({}, "", "/room/" + roomID)
    }

    public static createPrivateRoom(client:Colyseus.Client) {
        return client.create("room").then(room => {
            this.changeRoomIDInUrl(room.id);
            return room;
        });
    }

    public static rejoinOrJoinPrivateRoom(client:Colyseus.Client, roomID:string) {
        if (sessionStorage.getItem("lastRoom") === roomID) {
            console.log("rejoining");
            return client.reconnect(
                roomID,
                sessionStorage.getItem("lastSessionId") ?? "")
                .then((room) => {
                    this.changeRoomIDInUrl(room.id);
                    return room;
                }).catch(err => {
                    return this.joinPrivateRoom(client, roomID);
                });
        } else {
            return this.joinPrivateRoom(client, roomID);
        }
    }

    public static joinPrivateRoom(client:Colyseus.Client, roomID:string) {

        return client.joinById(roomID).then(room => {
            this.changeRoomIDInUrl(room.id);

            sessionStorage.setItem("lastRoom", room.id);
            sessionStorage.setItem("lastSessionId", room.sessionId);
            return room;
        }).catch(reason => {
            alert("That room does not exist! Creating a new one.");
            return this.createPrivateRoom(client);
        });
    }

    public static connect(client:Colyseus.Client, roomId: string | undefined) {
        if (roomId === undefined) {
            // No room id, so for now lets just create a new room
            roomId = "new";
        }

        if (roomId === "new") {
            return this.createPrivateRoom(client);
        } else {
            roomId = roomId.toUpperCase()
            return this.rejoinOrJoinPrivateRoom(client, roomId);
        }
    }
}
