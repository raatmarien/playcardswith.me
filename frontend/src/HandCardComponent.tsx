import React from 'react';
import {Card, Vector, Deck, getLocObject} from "cards-library";
import "./CardComponent.css";
import Draggable, { DraggableData } from "react-draggable";
import CardComponent from "./CardComponent";
import CardDragReleaseHandler, {CardLocation} from "./CardDragReleaseHandler";
import OwnHandComponent from "./OwnHandComponent";

type Props = {
    card: Card,
    decks: Deck[],
    sendMessage: (msg: any) => void,
    location: Vector,
    handRef: React.RefObject<HTMLDivElement>,
    cardDragReleaseHandler: CardDragReleaseHandler,
    ownHand: OwnHandComponent,
};

type State = {
    dragging: boolean,
    draggedOutOfHand: boolean,
};


export default class TableCardComponent extends React.Component<Props, State> {
    private cardRef:React.RefObject<HTMLDivElement>;

    constructor(props: Props) {
        super(props);

        this.state = {
            dragging: false,
            draggedOutOfHand: false,
        };

        this.cardRef = React.createRef();
    }

    private onDragStart(card: Card, data: DraggableData) {
        this.setState({
            dragging: true,
        });
    }

    private onDragMove(card: Card, data: DraggableData, e: any) {
        let loc = getLocObject(e);

        if (this.props.cardDragReleaseHandler.draggedInHand(
            loc.pageX, loc.pageY)) {
            this.props.ownHand.cardDraggedInHand(
                card, new Vector(data.x, data.y));
        } else {
            this.props.ownHand.cardDraggedOutOfHand(card);
        }
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

    getOffset(evt:any) {
        var el = evt.target,
            x = 0,
            y = 0;
        
        while (el && !isNaN(el.offsetLeft) && !isNaN(el.offsetTop)) {
            x += el.offsetLeft - el.scrollLeft;
            y += el.offsetTop - el.scrollTop;
            el = el.offsetParent;
        }
        
        let loc = getLocObject(evt);
        x = loc.clientX - x;
        y = loc.clientY - y;
        
        return { x: x, y: y };
    }

    private onDragStop(card: Card, data: DraggableData, e: any) {
        if (!this.cardRef.current) {
            return false;
        }

        var rect = this.cardRef.current.getBoundingClientRect();

        let loc = getLocObject(e);
        let newX = loc.pageX - loc.clientX + rect.left,
            newY = loc.pageY - loc.clientY + rect.top;

        this.stopDrag();
        if (this.props.cardDragReleaseHandler.release(
            card, CardLocation.Hand, loc.pageX, loc.pageY,
            newX, newY)) {
            this.setState({
                draggedOutOfHand: true,
            });
            this.props.ownHand.cardReleasedOutOfHand(card);
        } else {
            this.props.ownHand.cardReleasedInHand(
                card, new Vector(data.x, data.y));
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
                        this.state.dragging || this.state.draggedOutOfHand ? undefined
                            : { x: this.props.location.x,
                                y: this.props.location.y }}
                    onStart={(e, data) =>
                        this.anyDragEvent(this.onDragStart.bind(this, card, data), card)}
                    onDrag={(e, data) =>
                        this.anyDragEvent(this.onDragMove.bind(this,
                                                               card, data, e), card)}
                    onStop={(e, data) =>
                        this.anyDragEvent(this.onDragStop.bind(this, card, data, e), card)}>
                    <div ref={this.cardRef}>
                        <CardComponent
                            card={card}
                            stylesCardFace={stylesCardFace}
                            decks={this.props.decks}
                            playingCardClasses={playingCardClasses} />
                    </div>
                </Draggable>
            </div>
        );
    }
}
