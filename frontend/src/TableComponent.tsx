import React from 'react';
import './TableComponent.css';
import {Deck, Table, Player} from "cards-library";
import TableCardComponent from "./TableCardComponent";
import DecksComponent from "./DecksComponent";
import OwnHandComponent from "./OwnHandComponent";
import OtherPlayersHandsComponent from "./OtherPlayersHandsComponent";
import CardDragReleaseHandler from "./CardDragReleaseHandler";

type Props = {
    decks: Deck[],
    table: Table,
    sendMessage: (msg: any) => void,
    currentPlayerId: string | null,
    players: Player[],
};

export default class TableComponent extends React.Component<Props> {
    private currentPlayer() {
        for (let i = 0; i < this.props.players.length; i++) {
            if (this.props.players[i].id === this.props.currentPlayerId) {
                return this.props.players[i];
            }
        }
    }

    private currentPlayerHand() {
        let player = this.currentPlayer();
        if (!player) {
            return []
        } else {
            return player.hand;
        }
    }

    public render() {
        let deckRefs : { [id: number] : React.RefObject<HTMLDivElement> } = {};

        for (let i = 0; i < this.props.decks.length; i++) {
            deckRefs[this.props.decks[i].id] = React.createRef();
        }

        let handRef : React.RefObject<HTMLDivElement> = React.createRef();

        let cardDragReleaseHandler = new CardDragReleaseHandler(
            this.props.sendMessage, deckRefs, handRef);

        return (
            <div className="table">
                <DecksComponent
                    decks={this.props.decks}
                    deckRefs={deckRefs}
                    sendMessage={this.props.sendMessage}
                    cardDragReleaseHandler={cardDragReleaseHandler} />

                {this.props.table.locatedCards.map((locatedCard) => {
                     return <TableCardComponent locatedCard={locatedCard}
                                                sendMessage={this.props.sendMessage}
                                                key={locatedCard.card.id}
                                                currentPlayerId={this.props.currentPlayerId}
                                                players={this.props.players}
                                                cardDragReleaseHandler={cardDragReleaseHandler}
                                                decks={this.props.decks}
                            />
                     ;})}
                <OtherPlayersHandsComponent
                    players={this.props.players}
                    currentPlayerId={this.props.currentPlayerId}
                    decks={this.props.decks} />
            <OwnHandComponent handRef={handRef}
                              cards={this.currentPlayerHand()}
                              sendMessage={this.props.sendMessage}
                              cardDragReleaseHandler={cardDragReleaseHandler}
                              decks={this.props.decks} />
            </div>
        );
    }
}
