import React from 'react';
import {LocatedCard} from "cards-library";
import "./CardComponent.css";

type Props = {
    locatedCard: LocatedCard,
};

export default class CardComponent extends React.Component<Props, {}> {
    public render() {
        let className = "card ";
        if (this.props.locatedCard.card.open) {
            className += "card-open";
        } else {
            className += "card-closed";
        }

        return (
            <div className={className}>
                {this.props.locatedCard.card.open
                ? this.props.locatedCard.card.name
                : ""}
            </div>
        );
    }
}
