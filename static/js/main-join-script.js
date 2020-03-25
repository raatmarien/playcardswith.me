var myRoom = null;

var client = new Colyseus.Client("ws://localhost:2567");
client.joinOrCreate("room").then(room => {
    myRoom = room;
    console.log("joined");
    room.onStateChange.once(function(state) {
        console.log("initial room state:", state);
    });

    // new room state
    room.onStateChange(function(state) {
        // this signal is triggered on each patch
        console.log("New state:", state);
    });

    // listen to patches coming from the server
    room.onMessage(function(message) {
        console.log("New message", message);
    });
});


function send_message() {
    myRoom.send("Spammerdiespam!")
}

var elem = document.getElementById('draw-place');
var params = { width: 1000, height: 700 };
var two = new Two(params).appendTo(elem);

var card = two.makeRectangle(500, 200, 130, 300);
card.fill = "#eeeeee";
card.stroke = "red";

two.update();
