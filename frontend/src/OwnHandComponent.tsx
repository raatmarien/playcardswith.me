import React from 'react';
import "./OwnHandComponent.css";
import {Card, Vector, Deck} from "cards-library";
import HandCardComponent from "./HandCardComponent";
import CardDragReleaseHandler from "./CardDragReleaseHandler";

type Props = {
    handRef: any,
    cards: Card[],
    decks: Deck[],
    sendMessage: (msg: any) => void,
    cardDragReleaseHandler: CardDragReleaseHandler,
};

type State = {
    dragCards: DragCard[],
    draggedCardInHand: DragCard | null,
    draggedCardOutOfHand: Card | null,
};


export default class OwnHandComponent extends React.Component<Props, State> {
    public static CARD_OWN_HAND_SIZE = 50;

    constructor(props: Props) {
        super(props);
        this.state = {
            dragCards: OwnHandComponent.handWithNoDrags(props.cards),
            draggedCardInHand: null,
            draggedCardOutOfHand: null,
        };
    }

    static handWithNoDrags(cards: Card[]) : DragCard[] {
        let dragCards = [];
        for (let i = 0; i < cards.length; i++) {
            dragCards.push(new DragCard(
                cards[i], OwnHandComponent.locationFor(i)));
        }
        return dragCards;
    }

    static getDerivedStateFromProps(props: Props, state: State) : State {
        if (state.draggedCardInHand) {
            return {
                dragCards: OwnHandComponent.draggedCardInHand(
                    props, state.draggedCardInHand.card,
                    state.draggedCardInHand.location),
                draggedCardInHand: state.draggedCardInHand,
                draggedCardOutOfHand: null,
            };
        } else if (state.draggedCardOutOfHand) {
            return {
                dragCards: OwnHandComponent.draggedCardOutOfHand(
                    props, state.draggedCardOutOfHand),
                draggedCardInHand: null,
                draggedCardOutOfHand: state.draggedCardOutOfHand
            };
        } else {
            return {
                dragCards:
                          OwnHandComponent.handWithNoDrags(props.cards),
                draggedCardInHand: null,
                draggedCardOutOfHand: null,
            };
        }
    }

    private static draggedCardOutOfHand(props: Props, draggedCard: Card) {
        let dragCards = [];
        let j = 0;
        for (let i = 0; i < props.cards.length; i++) {
            let card = props.cards[i];
            if (card.id === draggedCard.id) {
                dragCards.push(new DragCard(card, new Vector(0, 0)));
            } else {
                dragCards.push(new DragCard(
                    card, OwnHandComponent.locationFor(j)));
                j++;
            }
        }
        return dragCards;
    }

    public cardDraggedOutOfHand(draggedCard: Card) {
        this.setState({
            dragCards: OwnHandComponent.draggedCardOutOfHand(
                this.props, draggedCard),
            draggedCardInHand: null,
            draggedCardOutOfHand: draggedCard,
        });
    }
    
    private static draggedCardInHand(
        props: Props, draggedCard: Card, location: Vector) {
        let index = Math.round(location.x / OwnHandComponent.CARD_OWN_HAND_SIZE);
        index = Math.max(index, 0);
        let dragCards = [];
        let j = 0;
        for (let i = 0; i < props.cards.length; i++) {
            let card = props.cards[i];
            if (j === index) {
                j++;
            }
            if (card.id === draggedCard.id) {
                dragCards.push(new DragCard(card, new Vector(0, 0)));
            } else {
                dragCards.push(new DragCard(
                    card, OwnHandComponent.locationFor(j)));
                j++;
            }
        }
        return dragCards;
    }

    public cardDraggedInHand(draggedCard: Card, location: Vector) {
        this.setState({
            dragCards: OwnHandComponent.draggedCardInHand(
                this.props, draggedCard, location),
            draggedCardInHand: new DragCard(
                draggedCard, location),
            draggedCardOutOfHand: null,
        });
    }

    public cardReleasedInHand(card: Card, location: Vector) {
        this.props.sendMessage({
            messageType: "move_card_in_hand",
            cardId: card.id,
            index: Math.round(location.x / OwnHandComponent.CARD_OWN_HAND_SIZE),
        });
        this.setState({
            dragCards: OwnHandComponent.handWithNoDrags(
                this.props.cards),
            draggedCardInHand: null,
            draggedCardOutOfHand: null});
    }

    public cardReleasedOutOfHand(card: Card) {
        this.setState({
            dragCards: OwnHandComponent.handWithNoDrags(
                this.props.cards),
            draggedCardInHand: null,
            draggedCardOutOfHand: null});
    }

    private static locationFor(index: number) {
        return new Vector(index * OwnHandComponent.CARD_OWN_HAND_SIZE, 0);
    }

    public render() {
        return (
            <div className="hand ownHand" ref={this.props.handRef}>
                <p>Your hand:</p>
                {this.state.dragCards.map((dragCard, index) => {
                     return (<HandCardComponent
                                 key={"handcard-"+dragCard.card.id}
                                 card={dragCard.card}
                                 decks={this.props.decks}
                                 sendMessage={this.props.sendMessage}
                                 location={dragCard.location}
                                 handRef={this.props.handRef}
                                 ownHand={this}
                                 cardDragReleaseHandler={this.props.cardDragReleaseHandler}/>);
                 })}
            </div>
        );
    }
}

export class DragCard {
    public card: Card;
    public location: Vector;

    constructor(card: Card, location: Vector) {
        this.card = card;
        this.location = location;
    }
}
