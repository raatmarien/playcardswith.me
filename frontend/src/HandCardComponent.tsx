import React from 'react';
import {Card, Vector} from "cards-library";
import "./CardComponent.css";
import Draggable, { DraggableData } from "react-draggable";
import CardComponent from "./CardComponent";

type Props = {
    card: Card,
    sendMessage: (msg: any) => void,
    location: Vector,
    handRef: React.RefObject<HTMLDivElement>,
};

type State = {
    dragging: boolean,
};


export default class TableCardComponent extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            dragging: false,
        };
    }

    private isRedSuit() {
        let cardName = this.props.card.name;

        let res = cardName.startsWith("♥") ||
                  cardName.startsWith("♦");
        return res;
    }

    private onDragStart(card: Card, data: DraggableData) {
        this.setState({
            dragging: true,
        });
    }

    private onDragMove(card: Card, data: DraggableData) {
    }

    private draggedOn(ref: any, e: any) {
        if (!ref.current) {
            return false;
        }
        let rect = ref.current.getBoundingClientRect();
        let mouseX = e.pageX, mouseY = e.pageY;
        return (mouseX > rect.x && mouseX < (rect.x + rect.width) &&
                mouseY > rect.y && mouseY < (rect.y + rect.height));
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

    private onDragStop(card: Card, data: DraggableData, e: any) {
        this.stopDrag();
        
        if (!this.draggedOn(this.props.handRef, e)) {
            this.props.sendMessage({
                messageType: "remove_card_from_hand",
                cardId: this.props.card.id,
                cardX: e.pageX,
                cardY: e.pageY,
            });
        }
    }

    private anyDragEvent(dragEvent: ()=>void,
                         card: Card) {
        dragEvent();
    }

    public render() {
        let card = this.props.card;
        card.open = true;

        let styles = {
            zIndex: -1,
        };

        let playingCardClasses = "playing-card ";

        let stylesCardFace = {};
        return (
            <div style={styles}>
                <Draggable
                    key={card.id}
                    position={
                        this.state.dragging ? undefined
                            : { x: this.props.location.x,
                                y: this.props.location.y }}
                    onStart={(e, data) =>
                        this.anyDragEvent(this.onDragStart.bind(this, card, data), card)}
                    onDrag={(e, data) =>
                        this.anyDragEvent(this.onDragMove.bind(this, card, data), card)}
                    onStop={(e, data) =>
                        this.anyDragEvent(this.onDragStop.bind(this, card, data, e), card)}>
                    <div>
                        <CardComponent
                            card={card}
                            stylesCardFace={stylesCardFace}
                            playingCardClasses={playingCardClasses} />
                    </div>
                </Draggable>
            </div>
        );
    }
}
