import React from "react";
import {Deck, Card} from "cards-library";
import "./DeckComponent.css";
import {DropdownButton, Dropdown} from "react-bootstrap";
import {DraggableCore, DraggableData} from 'react-draggable';

type Props = {
    deck: Deck,
    sendMessage: (msg: any) => void,
}

type State = {
    draggingCard: Card | null,
}

export default class DeckComponent extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            draggingCard: null,
        };
    }

    private recallToThisDeck() {
        this.props.sendMessage({
            messageType: "recall_to_deck",
            deckId: this.props.deck.id,
        });
    }

    private shuffleThisDeck() {
        this.props.sendMessage({
            messageType: "shuffle_deck",
            deckId: this.props.deck.id,
        });
    }

    private onDragStart(data: DraggableData) {
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
            <div className="deck">
                <DropdownButton title="&#8942;" id="deck-menu-button"
                                bsPrefix="custom-menu-btn">
                    <Dropdown.Item onClick={this.recallToThisDeck.bind(this)}>
                        Recall
                    </Dropdown.Item>
                    <Dropdown.Item onClick={this.shuffleThisDeck.bind(this)}>
                        Shuffle
                    </Dropdown.Item>
                </DropdownButton>

                <DraggableCore
                    onStart={(e, data) => this.onDragStart(data)}
                    onDrag={(e, data) => this.onDragMove(data)}
                    onStop={(e, data) => this.onDragStop(data)}>
                    <div className="inner-deck">
                        <div>
                            {this.props.deck.cards.length} cards
                        </div>
                    </div>
                </DraggableCore>
            </div>
        );
    }
}
