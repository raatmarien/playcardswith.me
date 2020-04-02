import React from 'react';
import {LocatedCard, Player, Deck} from "cards-library";
import "./CardComponent.css";
import Draggable, { DraggableData } from "react-draggable";
import randomColor from "randomcolor";
import CardComponent from "./CardComponent";

type Props = {
    locatedCard: LocatedCard,
    sendMessage: (msg: any) => void,
    currentPlayerId: string | null,
    players: Player[],
    decks: Deck[],
    deckRef: React.RefObject<HTMLDivElement>,
    handRef: React.RefObject<HTMLDivElement>,
};

type State = {
    dragging: boolean,
};


export default class TableCardComponent extends React.Component<Props, State> {
    private startX: number = -1;
    private startY: number = -1;

    constructor(props: Props) {
        super(props);

        this.state = {
            dragging: false,
        };
    }

    private onCardClick() {
        this.props.sendMessage({
            messageType: "card_turn",
            cardId: this.props.locatedCard.card.id,
        });
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

    private getLocObject(e: any) {
        if (e.clientX) {
            return e;
        } else {
            return e.changedTouches[0];
        }
    }

    private draggedOn(ref: any, e: any) {
        if (!ref.current) {
            return false;
        }
        let rect = ref.current.getBoundingClientRect();
        let loc = this.getLocObject(e);
        let mouseX = loc.pageX,
            mouseY = loc.pageY;
        return (mouseX > rect.x && mouseX < (rect.x + rect.width) &&
                mouseY > rect.y && mouseY < (rect.y + rect.height));
    }

    private onDragStop(locatedCard: LocatedCard, data: DraggableData, e: any) {
        this.stopDrag();

        this.props.sendMessage({
            messageType: "card_release"
        });


        // If held above it's deck, put it back in
        if (this.draggedOn(this.props.deckRef, e)) {
            this.props.sendMessage({
                messageType: "return_card_to_deck",
                cardId: locatedCard.card.id,
            });
        } else if (this.draggedOn(this.props.handRef, e)) {
            this.props.sendMessage({
                messageType: "add_card_to_hand",
                cardId: locatedCard.card.id
            });
        }
    }

    private anyDragEvent(dragEvent: ()=>void,
                         locatedCard: LocatedCard, e: any) {
        if (locatedCard.draggingPlayerID !== null && locatedCard.draggingPlayerID !== this.props.currentPlayerId) {
            this.stopDrag();
            return false;
        }

        dragEvent();
    }

    public render() {
        let locatedCard = this.props.locatedCard;

        let styles = {
            zIndex: this.props.locatedCard.zIndex,
        };

        let playingCardClasses = "playing-card ";

        if (locatedCard.draggingPlayerID !== null
            && locatedCard.draggingPlayerID !== this.props.currentPlayerId)
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
            <div style={styles} onClick={() => this.onCardClick()} >
                <Draggable
                    key={locatedCard.card.id}
                    position={
                        this.state.dragging ? undefined
                            : { x: locatedCard.location.x,
                                y: locatedCard.location.y }}
                    onStart={(e, data) =>
                        this.anyDragEvent(this.onDragStart.bind(this, locatedCard, data), locatedCard, e)}
                    onDrag={(e, data) =>
                        this.anyDragEvent(this.onDragMove.bind(this, locatedCard, data), locatedCard, e)}
                    onStop={(e, data) =>
                        this.anyDragEvent(this.onDragStop.bind(this, locatedCard, data, e), locatedCard, e)}>
                    <div>
                        <CardComponent
                            card={locatedCard.card}
                            stylesCardFace={stylesCardFace}
                            playingCardClasses={playingCardClasses}
                            decks={this.props.decks} />
                    </div>
                </Draggable>
            </div>
        );
    }
}
