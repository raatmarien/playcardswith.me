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
let deckRects = [];

function drawDecks(decks) {
    for (let i = 0; i < decks.length; i++) {
        let pad = 10;
        let x = CARD_WIDTH / 2 + pad,
            y = CARD_HEIGHT / 2 + pad + (CARD_HEIGHT + pad) * i;

        let deck = two.makeRectangle(
            x, y, CARD_WIDTH, CARD_HEIGHT);
        deck.fill = '#55dd55';
        two.makeText(decks[i].cards.length, x, y, styles);

        deckRects.push({
            x: x,
            y: y });
    }
}

function drawCards(cards) {
    let sortedCards = cards.sort((a, b) => a.zIndex - b.zIndex);

    for (let i = 0; i < sortedCards.length; i++) {
        let cardname = sortedCards[i].card.name;
        let cardopen = sortedCards[i].card.open;
        let cardinfo = sortedCards[i].location;

        let card = two.makeRectangle(
            cardinfo.x, cardinfo.y, CARD_WIDTH, CARD_HEIGHT);

        if (cardopen) {
            card.fill = '#dddddd';
            two.makeText(
                cardname, cardinfo.x, cardinfo.y, styles);
        } else {
            card.fill = '#dd5555';
        }
    }
}

function redraw() {
    two.clear();
    drawDecks(myState.decks);
    drawCards(myState.table.locatedCards);
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

function getIntersectingDeck(pos) {
    for (let i = 0; i < deckRects.length; i++) {
        if (isInCard(pos, deckRects[i])) {
            return i;
        }
    }
}

function getIntersectingCard(pos) {
    let bestZIndex = -1;
    let cardID = -1;

    for (let i = myState.table.locatedCards.length - 1; i >= 0; i--) {
        let card = myState.table.locatedCards[i];
        if (isInCard(pos, card.location) && card.zIndex > bestZIndex) {
            bestZIndex = card.zIndex;
            cardID = card.card.id;
        }
    }
    return cardID;
}

function getCardFromTable(cardId) {
    for (let i = 0; i < myState.table.locatedCards.length; i++) {
        if (myState.table.locatedCards[i].card.id == cardId) {
            return myState.table.locatedCards[i].location;
        }
    }
    return null;
}

let clickedDeckId = -1;
let clickedCardId = -1;
let startCoords = null;
let grabX = 0;
let grabY = 0;

function mouseDown(event) {
    startCoords = getTwoCoords(event);
    clickedDeckId = getIntersectingDeck(startCoords);
    clickedCardId = getIntersectingCard(startCoords);
    if (clickedCardId < 0 && clickedDeckId >= 0) {
        let deckCards = myState.decks[clickedDeckId].cards;
        clickedCardId = deckCards[deckCards.length - 1].id;
    } else if (clickedCardId >= 0) {
        let card = getCardFromTable(clickedCardId);
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
