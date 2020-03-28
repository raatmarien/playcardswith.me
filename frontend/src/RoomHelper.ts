import * as Colyseus from "colyseus.js";

export default class RoomHelper {
    private static getRoomIDFromURL() {
        let url = new URL(window.location.href);
        return url.searchParams.get("r");
    }

    private static changeRoomIDInUrl(roomID:string) {
        window.history.replaceState({}, "", "?r=" + roomID)
    }

    public static connect(client:Colyseus.Client) {
        var roomID = this.getRoomIDFromURL();
        if (roomID == null) {
            return client.create("room").then(room => {
                this.changeRoomIDInUrl(room.id);
                return room;
            });
        }

        return client.joinById(roomID);
    }
}