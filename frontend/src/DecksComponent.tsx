import React from "react";
import {Deck} from "cards-library";
import DeckComponent from "./DeckComponent";
import "./DecksComponent.css";

type Props = {
    decks: Deck[],
};

export default class DecksComponent extends React.Component<Props, {}> {

    public render() {
        return (
            <ul className="decks">
                {
                    this.props.decks.map((deck, i) =>
                        <DeckComponent key={i} deck={deck}/>)
                }
            </ul>
        );
    }

}
