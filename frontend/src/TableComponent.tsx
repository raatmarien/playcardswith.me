import React from 'react';
import './App.css';
import {Table} from "cards-library";
import CardComponent from "./CardComponent";

type Props = {
    table: Table,
    sendMessage: (msg: any) => void,
};

export default class TableComponent extends React.Component<Props, {}> {
    private onCardClick(id: number) {
        this.props.sendMessage({
            messageType: "card_turn",
            cardId: id,
        });
    }

    private onCardDrag(id: number, x: number, y: number) {
        this.props.sendMessage({
            messageType: "card_drag",
            cardX: x,
            cardY: y,
            cardId: id,
        });
    }

    private onCardDragRelease(id: number) {
        // TODO release card here, see #29
    }

    public render() {
        return (
            <div className="table">
                {this.props.table.locatedCards.map((locatedCard) => {
                    return <CardComponent
                               locatedCard={locatedCard}
                               onClick={() =>
                                   this.onCardClick(locatedCard.card.id)}
                               onDrag={(x, y) =>
                                   this.onCardDrag(
                                       locatedCard.card.id, x, y)}
                               onDragRelease={() => this.onCardDragRelease(
                                   locatedCard.card.id)}
                    />
                })}
            </div>
        );
    }
}
