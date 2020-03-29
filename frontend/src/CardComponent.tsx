import React from 'react';
import {LocatedCard, Player} from "cards-library";
import "./CardComponent.css";
import Draggable, { DraggableData } from "react-draggable";
import randomColor from "randomcolor";

type Props = {
    locatedCard: LocatedCard,
    sendMessage: (msg: any) => void,
    currentPlayerId: string | null,
    players: Player[],
    deckRef: React.RefObject<HTMLDivElement>,
};

type State = {
    dragging: boolean,
};


export default class CardComponent extends React.Component<Props, State> {
    private startX: number = -1;
    private startY: number = -1;

    constructor(props: Props) {
        super(props);

        this.state = {
            dragging: false,
        };
    }


    private isRedSuit() {
        let cardName = this.props.locatedCard.card.name;

        let res = cardName.startsWith("♥") ||
                  cardName.startsWith("♦");
        return res;
    }

    private onCardClick(id: number) {
        this.props.sendMessage({
            messageType: "card_turn",
            cardId: id,
        });
    }

    private countAsClick(data: DraggableData) {
        let difX = this.startX - data.x;
        let difY = this.startY - data.y;
        let distSq = difX * difX + difY * difY;
        return distSq < 100;
    }

    private onDragStart(locatedCard: LocatedCard, data: DraggableData) {
        this.setState({
            dragging: true,
        });

        this.startX = data.x;
        this.startY = data.y;
        this.props.sendMessage({
            messageType: "card_drag",
            cardId: locatedCard.card.id,
            cardX: data.x,
            cardY: data.y,
        });
    }

    private onDragMove(locatedCard: LocatedCard, data: DraggableData) {
        this.props.sendMessage({
            messageType: "card_drag",
            cardId: locatedCard.card.id,
            cardX: data.x,
            cardY: data.y,
        });
    }

    /** Reset the drag state and do any potential other things
     * that should be done when stopping drag
     * (note: the player may not really have been dragging at all)
     */
    private stopDrag() {
        this.setState({
            dragging: false,
        });
    }

    private onDragStop(locatedCard: LocatedCard, data: DraggableData, e: any) {
        this.stopDrag();

        this.props.sendMessage({
            messageType: "card_release"
        });

        if (this.countAsClick(data)) {
            this.onCardClick(locatedCard.card.id);
        } else {
            // If held above it's deck, put it back in
            if (this.props.deckRef.current) {
                let rect = this.props.deckRef.current.getBoundingClientRect();
                let mouseX = e.pageX, mouseY = e.pageY;
                if (mouseX > rect.x && mouseX < (rect.x + rect.width) &&
                    mouseY > rect.y && mouseY < (rect.y + rect.height)) {
                    this.props.sendMessage({
                        messageType: "return_card_to_deck",
                        cardId: locatedCard.card.id,
                    });
                }
            }
        }
    }

    private anyDragEvent(dragEvent: ()=>void,
            locatedCard: LocatedCard) {
        if (locatedCard.draggingPlayerID !== null && locatedCard.draggingPlayerID !== this.props.currentPlayerId) {
            this.stopDrag();
            return false;
        }

        dragEvent();
    }

    public render() {
        let classNamesFaceHolder = "cardFaceHolder ";
        if (this.props.locatedCard.card.open)
            classNamesFaceHolder += "is-flipped ";

        if (this.isRedSuit()) {
            classNamesFaceHolder += "card-red-suit ";
        }

        let locatedCard = this.props.locatedCard;

        let styles = {
            zIndex: this.props.locatedCard.zIndex,
        };

        let playingCardClasses = "playing-card ";

        if (locatedCard.draggingPlayerID !== null && locatedCard.draggingPlayerID !== this.props.currentPlayerId)
            playingCardClasses += "dragged-by-other";

        let stylesCardFace = {};
        let draggingID = this.props.locatedCard.draggingPlayerID;
        if (draggingID !== null) {
            let cardPlayer = this.props.players.find(p => p.id === draggingID);
            if (cardPlayer !== undefined) {
                let cardPlayerColor = randomColor({
                    seed: cardPlayer.id
                });
                stylesCardFace = {
                    boxShadow: "2px 2px 3px 0px #00000022, 0px 0px 10px 2px " + cardPlayerColor
                };
            }
        }

        return (
            <div style={styles}>
            <Draggable
                key={locatedCard.card.id}
                position={
                this.state.dragging ? undefined
                : { x: locatedCard.location.x,
                    y: locatedCard.location.y}}
                onStart={(e, data) =>
                    this.anyDragEvent(this.onDragStart.bind(this, locatedCard, data), locatedCard)}
                onDrag={(e, data) =>
                    this.anyDragEvent(this.onDragMove.bind(this, locatedCard, data), locatedCard)}
                onStop={(e, data) =>
                    this.anyDragEvent(this.onDragStop.bind(this, locatedCard, data, e), locatedCard)}>

                <div className={playingCardClasses} ref={"card"+locatedCard.card.id} style={styles}>
                    <div className={classNamesFaceHolder}>
                        <div className="cardFace card-open" style={stylesCardFace}>
                            <p className="card-open-content">
                                {this.props.locatedCard.card.name.slice(0, 1)}
                                <br></br>
                                {this.props.locatedCard.card.name.slice(1)}
                            </p>
                        </div>
                        <div className="cardFace card-closed" style={stylesCardFace}>
                        </div>
                    </div>
                </div>

            </Draggable>
            </div>
        );
    }
}
