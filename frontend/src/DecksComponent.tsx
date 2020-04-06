import React from "react";
import {Deck, Player} from "cards-library";
import DeckComponent from "./DeckComponent";
import "./DecksComponent.css";
import AddDeckModal from "./AddDeckModal";
import CardDragReleaseHandler from "./CardDragReleaseHandler";

type Props = {
    decks: Deck[],
    sendMessage: (msg: any) => void,
    deckRefs: { [id: number] : React.RefObject<HTMLDivElement> },
    cardDragReleaseHandler: CardDragReleaseHandler,
    players: Player[],
};

type State = {
};

export default class DecksComponent extends React.Component<Props, State> {
    public render() {
        return (
            <ul className="decks">
                {
                    this.props.decks.map((deck, i) =>
                        <div key={deck.id}>
                            <DeckComponent deck={deck}
                                           deckRef={this.props.deckRefs[deck.id]}
                                           sendMessage={this.props.sendMessage}
                                           players={this.props.players}
                                           cardDragReleaseHandler={this.props.cardDragReleaseHandler}/>
                        </div>)
                }

                <AddDeckModal sendMessage={this.props.sendMessage}
                              decksLength={this.props.decks.length}
                />
            </ul>
        );
    }
}
