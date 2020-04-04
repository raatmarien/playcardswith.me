import React from "react";
import {Card as BCard, Button, Container, ButtonToolbar,
        Col, Row, OverlayTrigger, Tooltip} from "react-bootstrap";
import {Deck, Card} from "cards-library";
import "./DeckComponent.css";
import {DropdownButton, Dropdown} from "react-bootstrap";
import {DraggableCore, DraggableData} from 'react-draggable';

type Props = {
    deck: Deck,
    sendMessage: (msg: any) => void,
    deckRef: any,
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

    private removeThisDeck() {
        this.props.sendMessage({
            messageType: "remove_deck",
            deckId: this.props.deck.id,
        });
    }

    private onDragStart(data: DraggableData) {
        if (this.props.deck.cards.length > 0) {
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
    }

    private onDragMove(data: DraggableData) {
        if (this.state.draggingCard) {
            this.props.sendMessage({
                messageType: "card_drag",
                cardX: data.x,
                cardY: data.y,
                cardId: this.state.draggingCard.id,
            });
        }
    }

    private onDragStop(data: DraggableData) {
        this.props.sendMessage({
            messageType: "card_release"
        });

        this.setState({
            draggingCard: null,
        });
    }

    public render() {
        return (
            <div className="mt-3 mb-3">
                <BCard style={{width: "20rem"}}>
                    <BCard.Header>
                        Deck with {this.props.deck.cards.length}
                        {this.props.deck.cards.length === 1 ? " card" : " cards"}
                    </BCard.Header>
                    <Container>
                        <Row>
                            <Col className="deck-col">
                                <div style={{backgroundColor: this.props.deck.color }}
                                     className="deck" ref={this.props.deckRef}>
                                    <DraggableCore
                                        onStart={(e, data) => this.onDragStart(data)}
                                        onDrag={(e, data) => this.onDragMove(data)}
                                        onStop={(e, data) => this.onDragStop(data)}>
                                        <div className="inner-deck">
                                        </div>
                                    </DraggableCore>
                                </div>
                            </Col>
                            <div className="deck-buttons" >
                                <Col>
                                    <Row>
                                        <ButtonToolbar className="deck-button-toolbar">
                                            <OverlayTrigger
                                                placement="top"
                                                overlay={
                                                    <Tooltip id={"tt-deal-"+this.props.deck.id}>
                                                                Move cards from this deck into
                                                                each player's hand.
                                                    </Tooltip>
                                                        }>
                <Button variant="secondary" className="deck-button">Deal</Button>
                                            </OverlayTrigger>
                                            <OverlayTrigger
                                                placement="top"
                                                overlay={
                                                    <Tooltip id={"tt-recall-"+this.props.deck.id}>
                                                                Move all the cards on the table and in player's
                                                                hands which are on this deck, back into the deck.
                                                    </Tooltip>
                                                        }>
                <Button variant="secondary" className="deck-button">Recall</Button>
                                            </OverlayTrigger>
                                        </ButtonToolbar>
                                    </Row>
                                    <Row>
                                        <ButtonToolbar className="deck-button-toolbar">
                                            <OverlayTrigger
                                                placement="bottom"
                                                overlay={
                                                    <Tooltip id={"tt-shuffle-"+this.props.deck.id}>
                                                                Shuffle the cards that are currently in this deck.
                                                    </Tooltip>
                                                        }>
                <Button variant="secondary" className="deck-button">Shuffle</Button>
                                            </OverlayTrigger>
                                            <OverlayTrigger
                                                placement="bottom"
                                                overlay={
                                                    <Tooltip id={"tt-deal-"+this.props.deck.id}>
                                                                Delete this
                                                                deck and all the cards that came from it.
                                                    </Tooltip>
                                                        }>
                <Button variant="secondary" className="deck-button">Remove</Button>
                                            </OverlayTrigger>
                                        </ButtonToolbar>
                                    </Row>
                                </Col>
                            </div>
                        </Row>
                    </Container>
                </BCard>
            </div>
        );
    }
}
