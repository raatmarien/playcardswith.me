import React from 'react';
import {LocatedCard} from "cards-library";
import "./CardComponent.css";

type Props = {
    locatedCard: LocatedCard,
    onClick: () => void,
};

export default class pCardComponent extends React.Component<Props, {}> {
    public render() {
        let className = "card ";
        if (this.props.locatedCard.card.open) {
            className += "card-open";
        } else {
            className += "card-closed";
        }

        let loc = this.props.locatedCard.location;
        let styles = {
            left: loc.x,
            top: loc.y,
        }

        return (
            <div className={className} style={styles}
                 onClick={this.props.onClick}>
                {this.props.locatedCard.card.open
                ? this.props.locatedCard.card.name
                : ""}
            </div>
        );
    }
}
