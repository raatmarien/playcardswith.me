import React from "react";
import {Deck, Card} from "cards-library";
import "./DeckComponent.css";
import {DraggableCore, DraggableData} from 'react-draggable';

type Props = {
    deck: Deck,
    sendMessage: (msg: any) => void,
    onClick: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void,
}

type State = {
    draggingCard: Card | null;
}

export default class DeckComponent extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.setState({draggingCard: null});
    }

    private recallToThisDeck() {
        this.props.sendMessage({
            messageType: "recall_to_deck",
            deckId: this.props.deck.id,
        });
    }

    private onDragStart(data: DraggableData) {
        console.log("drag start");
        this.props.sendMessage({
            messageType: "pick_from_deck",
            deckId: this.props.deck.id,
            cardX: data.x,
            cardY: data.y,
        });
        this.setState({
            draggingCard:
                         this.props.deck.cards[
                             this.props.deck.cards.length-1]});
    }

    private onDragMove(data: DraggableData) {
        this.props.sendMessage({
            messageType: "card_drag",
            cardX: data.x,
            cardY: data.y,
            cardId: this.state.draggingCard!.id,
        });
    }

    private onDragStop(data: DraggableData) {

    }

    public render() {
        return (
            <DraggableCore
                onStart={(e, data) => this.onDragStart(data)}
                onDrag={(e, data) => this.onDragMove(data)}
                onStop={(e, data) => this.onDragStop(data)}>
                <div className="deck">
                    <button onClick={this.recallToThisDeck.bind(this)}>&#8942;</button>
                    <div className="inner-deck" onClick={this.props.onClick}>
                        <div>
                            {this.props.deck.cards.length} cards
                        </div>
                    </div>
                </div>
            </DraggableCore>
        );
    }
}
