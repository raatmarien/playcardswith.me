let myRoom = null;

let CARD_WIDTH = 80;
let CARD_HEIGHT = 130;

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

let myState = null;

function drawDecks(decks) {
    for (let i = 0; i < decks.length; i++) {
        let pad = 10;
        let x = CARD_WIDTH / 2 + pad,
            y = CARD_HEIGHT / 2 + pad + (CARD_HEIGHT + pad) * i;

        let deck = two.makeRectangle(
            x, y, CARD_WIDTH, CARD_HEIGHT);
        deck.fill = '#55dd55';
        two.makeText(decks[i].cards.length, x, y, styles);
    }
}

function drawCards(cards) {
    for (let i = 0; i < cards.length; i++) {
        let cardinfo = cards[i];
        let card = two.makeRectangle(
            cardinfo.x, cardinfo.y, CARD_WIDTH, CARD_HEIGHT);

        if (cardinfo.open) {
            card.fill = '#dddddd';
            two.makeText(
                cardinfo.name, cardinfo.x, cardinfo.y, styles);
        } else {
            card.fill = '#dd5555';
        }
    }
}

function redraw() {
    two.clear();
    drawDecks(myState.decks);
    drawCards(myState.table.cards);
    two.update()
}

function updateState(state) {
    myState = state;
    redraw();
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
    for (let i = myState.table.cards.length - 1; i >= 0; i--) {
        let card = myState.table.cards[i];
        if (isInCard(pos, card)) {
            return card.id;
        }
    }
    return -1;
}

let clickedCardId = -1;
let startCoords = null;
let grabX = 0;
let grabY = 0;

function mouseDown(event) {
    startCoords = getTwoCoords(event);
    clickedCardId = getIntersectingCard(startCoords);
    if (clickedCardId >= 0) {
        card = myState[clickedCardId];
        grabX = startCoords.x - card.x;
        grabY = startCoords.y - card.y;
    }
}

function movedEnough(pos) {
    let difx = pos.x - startCoords.x,
        dify = pos.y - startCoords.y,
        sqDist = difx * difx + dify * dify;
    return sqDist > 100;
}

function mouseMove(event) {
    let coords = getTwoCoords(event);
    if (clickedCardId >= 0 && movedEnough(coords)) {
        myRoom.send({
            messageType: "card_move",
            cardId: clickedCardId,
            cardX: coords.x - grabX,
            cardY: coords.y - grabY
        });
    }
}

function mouseUp(event) {
    let coords = getTwoCoords(event);
    if (clickedCardId >= 0 && !movedEnough(coords)) {
        myRoom.send({
            messageType: "card_turn",
            cardId: clickedCardId
        });
    }
    
    clickedCardId = -1;
}

elem.addEventListener("mousedown", mouseDown);
elem.addEventListener("mousemove", mouseMove);
elem.addEventListener("mouseup", mouseUp);
