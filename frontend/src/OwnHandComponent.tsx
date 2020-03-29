import React from 'react';
import "./OwnHandComponent.css";
import {Card, Vector} from "cards-library";
import HandCardComponent from "./HandCardComponent";

type Props = {
    handRef: any;
    cards: Card[];
    sendMessage: (msg: any) => void,
};

export default class OwnHandComponent extends React.Component<Props> {
    private locationFor(index: number) {
        return new Vector(index * 100, 0);
    }

    public render() {
        return (
            <div className="ownHand" ref={this.props.handRef}>
                <p>Your hand:</p>
                {this.props.cards.map((card, index) => {
                     return (<HandCardComponent
                                 card={card}
                                 sendMessage={this.props.sendMessage}
                                 location={this.locationFor(index)}
                                 handRef={this.props.handRef} />);
                 })}
            </div>
        );
    }
}
