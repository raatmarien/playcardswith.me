import React from 'react';
import {Card} from 'cards-library';

type Ref = React.RefObject<HTMLDivElement>;
type DeckRefs = { [deckId: number] : Ref };
type Sender = (msg: any) => void;

export enum CardLocation {
    Deck,
    Table,
    Hand,
};

export default class CardDragReleaseHandler {
    private sendMessage: Sender;
    private deckRefs: DeckRefs;
    private ownHandRef: Ref;

    constructor(sendMessage: Sender, deckRefs: DeckRefs,
                ownHandRef: Ref) {
        this.sendMessage = sendMessage;
        this.deckRefs = deckRefs;
        this.ownHandRef = ownHandRef;
    }

    private getCardDeck(card: Card) {
        return this.deckRefs[card.deckId!];
    }

    private draggedOn(ref: any, x: number, y: number) {
        if (!ref.current) {
            return false;
        }
        let rect = ref.current.getBoundingClientRect();
        return (x > rect.x && x < (rect.x + rect.width) &&
                y > rect.y && y < (rect.y + rect.height));
    }

    public release(card: Card, currentLocation: CardLocation,
                    x: number, y: number) {
        if (this.draggedOn(this.ownHandRef, x, y)) {
            if (currentLocation !== CardLocation.Hand) {
                this.sendMessage({
                    messageType: "add_card_to_hand",
                    cardId: card.id,
                });
            }
        } else if (this.draggedOn(this.getCardDeck(card), x, y)) {
            if (currentLocation !== CardLocation.Deck) {
                this.sendMessage({
                    messageType: "return_card_to_deck",
                    cardId: card.id,
                });
            }
        } else {
            if (currentLocation === CardLocation.Hand) {

            } else if (currentLocation === CardLocation.Deck) {

            }
        }
    }
}
