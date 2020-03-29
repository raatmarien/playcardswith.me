import React from 'react';
import {LocatedCard} from "cards-library";
import "./CardComponent.css";
import Draggable, { DraggableData } from "react-draggable";

type Props = {
    locatedCard: LocatedCard,
    sendMessage: (msg: any) => void,
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

    private onDragStop(locatedCard: LocatedCard, data: DraggableData,
                       e: any) {
        this.setState({
            dragging: false,
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
                    this.onDragStart(locatedCard, data)}
                onDrag={(e, data) =>
                    this.onDragMove(locatedCard, data)}
                onStop={(e, data) =>
                    this.onDragStop(locatedCard, data, e)}>

                <div className="playing-card" ref={"card"+locatedCard.card.id} style={styles}>
                    <div className={classNamesFaceHolder}>
                        <div className="cardFace card-open">
                            <p className="card-open-content">
                                {this.props.locatedCard.card.name.slice(0, 1)}
                                <br></br>
                                {this.props.locatedCard.card.name.slice(1)}
                            </p>
                        </div>
                        <div className="cardFace card-closed">
                        </div>
                    </div>
                </div>

            </Draggable>
            </div>
        );
    }
}
