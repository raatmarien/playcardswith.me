import React from "react";
import {Deck} from "cards-library";
import DeckComponent from "./DeckComponent";

type Props = {
    decks: Deck[],
};

export default class DecksComponent extends React.Component<Props, {}> {

    public render() {
        return (
            <ul>
                {
                    this.props.decks.map((deck) =>
                        <DeckComponent deck={deck}/>)
                }
            </ul>
        );
    }

}
