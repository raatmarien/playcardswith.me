import React from 'react';
import {Card} from 'cards-library';
import OwnHandComponent from './OwnHandComponent';

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
    private tableRef: Ref;

    constructor(sendMessage: Sender, deckRefs: DeckRefs,
                ownHandRef: Ref, tableRef: Ref) {
        this.sendMessage = sendMessage;
        this.deckRefs = deckRefs;
        this.ownHandRef = ownHandRef;
        this.tableRef = tableRef;
    }

    private getCardDeck(card: Card) {
        return this.deckRefs[card.deckId!];
    }

    private draggedOn(ref: any, x: number, y: number) {
        if (!ref.current) {
            return false;
        }
        let rect = ref.current.getBoundingClientRect();
        return (x >= rect.x && x <= (rect.x + rect.width) &&
                y >= rect.y && y <= (rect.y + rect.height));
    }

    public draggedInHand(x: number, y: number) {
        return this.draggedOn(this.ownHandRef, x, y);
    }

    public release(card: Card, currentLocation: CardLocation,
                   x: number, y: number,
                   newCardX: number, newCardY: number) : boolean {
        if (this.draggedOn(this.ownHandRef, x, y)) {
            if (currentLocation !== CardLocation.Hand) {
                this.sendMessage({
                    messageType: "add_card_to_hand",
                    cardId: card.id,
                    index: Math.floor(x / OwnHandComponent.CARD_OWN_HAND_SIZE),
                });
                return true;
            }
        } else if (this.draggedOn(this.getCardDeck(card), x, y)) {
            if (currentLocation !== CardLocation.Deck) {
                this.sendMessage({
                    messageType: "return_card_to_deck",
                    cardId: card.id,
                });
                return true;
            }
        } else {
            if (currentLocation === CardLocation.Hand) {
                this.sendMessage({
                    messageType: "remove_card_from_hand",
                    cardId: card.id,
                    cardX: newCardX,
                    cardY: newCardY - this.tableRef.current!.getBoundingClientRect().top,
                });
                return true;
            } else if (currentLocation === CardLocation.Deck) {
                return true;
            }
        }
        return false;
    }
}
