import React from "react";
import {Deck} from "cards-library";
import DeckComponent from "./DeckComponent";
import "./DecksComponent.css";

type Props = {
    decks: Deck[],
    sendMessage: (msg: any) => void,
};

export default class DecksComponent extends React.Component<Props, {}> {
    private onDeckClick(id: number, event: any) {
        this.props.sendMessage({
            messageType: "pick_from_deck",
            deckId: id,
            cardX: event.pageX,
            cardY: event.pageY,
        })
    }

    public render() {
        return (
            <ul className="decks">
                {
                    this.props.decks.map((deck, i) =>
                        <div onClick={(event) =>
                            this.onDeckClick(i, event)}>
                            <DeckComponent key={i} deck={deck} />
                        </div>)
                }
            </ul>
        );
    }
}
