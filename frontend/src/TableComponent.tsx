import React from 'react';
import Draggable, { DraggableData } from "react-draggable";
import './App.css';
import {Deck, Table} from "cards-library";
import CardComponent from "./CardComponent";
import DecksComponent from "./DecksComponent";

type Props = {
    decks: Deck[],
    table: Table,
    sendMessage: (msg: any) => void,
};

export default class TableComponent extends React.Component<Props, {}> {
    startX: number = -1;
    startY: number = -1;

    private onCardClick(id: number) {
        this.props.sendMessage({
            messageType: "card_turn",
            cardId: id,
        });
    }

    private countAsClick(data: DraggableData) {
        let difX = this.startX - data.x;
        let difY = this.startY - data.y;
        let distSq = difX * difX + difY * difY;
        return distSq < 100;
    }

    private onDragStart(id: number, data: DraggableData) {
        this.startX = data.x;
        this.startY = data.y;
        this.props.sendMessage({
            messageType: "card_drag",
            cardId: id,
            cardX: data.x,
            cardY: data.y
        });
    }

    private onDragMove(id: number, data: DraggableData) {
        this.props.sendMessage({
            messageType: "card_drag",
            cardId: id,
            cardX: data.x,
            cardY: data.y
        });
    }

    private onDragStop(id: number, data: DraggableData) {
        if (this.countAsClick(data)) {
            this.onCardClick(id);
        }
    }

    public render() {
        return (
            <div className="table">
                <DecksComponent decks={this.props.decks}></DecksComponent>
                {this.props.table.locatedCards.map((locatedCard) => {
                    return <Draggable
                               defaultPosition={{
                                   x: locatedCard.location.x,
                                   y: locatedCard.location.y}}
                               onStart={(e, data) =>
        this.onDragStart(locatedCard.card.id, data)}
                               onDrag={(e, data) =>
        this.onDragMove(locatedCard.card.id, data)}
                               onStop={(e, data) =>
        this.onDragStop(locatedCard.card.id, data)}>
    <div style={{width: 0 }}><CardComponent
        locatedCard={locatedCard}
         /></div>
                    </Draggable>;})}
            </div>)
    }
}
