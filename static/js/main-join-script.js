let myRoom = null;

let CARD_WIDTH = 130;
let CARD_HEIGHT = 300;

// Set up drawing
let elem = document.getElementById('draw-place');
let params = { width: 1000, height: 700 };
let two = new Two(params).appendTo(elem);

let styles = {
    family: 'proxima-nova, sans-serif',
    size: 50,
    leading: 50,
    weight: 900
};


two.update();

let myState = null;

function updateState(state) {
    myState = state;
    two.clear();
    for (let i = 0; i < state.length; i++) {
        cardinfo = state[i];
        card = two.makeRectangle(
            cardinfo.x, cardinfo.y, CARD_WIDTH, CARD_HEIGHT);
        cardtext = two.makeText(
            cardinfo.name, cardinfo.x, cardinfo.y, styles);
    }
    two.update();
}

let client = new Colyseus.Client("ws://localhost:2567");
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
function getTwoCoords(event) {
    let x = event.pageX - elem.offsetLeft,
        y = event.pageY - elem.offsetTop;
    return { x: x, y: y };
}

function isInCard(pos, card) {
    let hw = CARD_WIDTH / 2,
        hh = CARD_HEIGHT / 2,
        minX = card.x - hw,
        minY = card.y - hh,
        maxX = card.x + hw,
        maxY = card.y + hh;

    return pos.x > minX && pos.x < maxX
        && pos.y > minY && pos.y < maxY;
}

function getIntersectingCard(pos) {
    for (let i = myState.length - 1; i >= 0; i--) {
        if (isInCard(pos, myState[i])) {
            return i;
        }
    }
    return -1;
}

let clickedCardId = -1;
let grabX = 0;
let grabY = 0;

function mouseDown(event) {
    let coords = getTwoCoords(event);
    clickedCardId = getIntersectingCard(coords);
    if (clickedCardId >= 0) {
        card = myState[clickedCardId];
        grabX = coords.x - card.x;
        grabY = coords.y - card.y;
    }
}

function mouseMove(event) {
    let coords = getTwoCoords(event);
    if (clickedCardId >= 0) {
        myRoom.send({
            messageType: "card_update",
            cardId: clickedCardId,
            cardX: coords.x - grabX,
            cardY: coords.y - grabY
        });
    }
}

function mouseUp(event) {
    clickedCardId = -1;
}

elem.addEventListener("mousedown", mouseDown);
elem.addEventListener("mousemove", mouseMove);
elem.addEventListener("mouseup", mouseUp);
