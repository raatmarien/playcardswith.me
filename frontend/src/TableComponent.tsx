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


    public render() {
        return (
            <div className="table">
                {this.props.table.locatedCards.map((locatedCard) => {
                    return <CardComponent
                               locatedCard={locatedCard}
                               onClick={() => this.onCardClick(locatedCard.card.id)}
                    />
                })}
            </div>
        );
    }
}
