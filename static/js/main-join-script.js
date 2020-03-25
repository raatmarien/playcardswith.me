var myRoom = null;

// Set up drawing
var elem = document.getElementById('draw-place');
var params = { width: 1000, height: 700 };
var two = new Two(params).appendTo(elem);

card = two.makeRectangle(500, 200, 130, 300);
card.fill = "#eeeeee";
card.stroke = "red";

two.update();

function updateState(state) {
    card.translation.x = state.cardX;
    card.translation.y = state.cardY;
    two.update();
}

var client = new Colyseus.Client("ws://localhost:2567");
client.joinOrCreate("room").then(room => {
    myRoom = room;
    console.log("joined");
    room.onStateChange.once(function(state) {
        console.log("initial room state:", state);
        updateState(state);
    });

    // new room state
    room.onStateChange(function(state) {
        // this signal is triggered on each patch
        console.log("New state:", state);
        updateState(state);
    });

    // listen to patches coming from the server
    room.onMessage(function(message) {
        console.log("New message", message);
    });
});


function send_message() {
    myRoom.send("Spammerdiespam!")
}

// Set up mouse listening
function clickListener(event) {
    console.log("Click!")
    var x = event.pageX - elem.offsetLeft,
        y = event.pageY - elem.offsetTop;
    myRoom.send({ cardX: x, cardY: y });
}

elem.addEventListener("click", clickListener);
