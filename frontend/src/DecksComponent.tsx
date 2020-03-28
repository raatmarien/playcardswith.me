import React from "react";
import {Deck} from "cards-library";
import DeckComponent from "./DeckComponent";
import "./DecksComponent.css";
import {Button} from "react-bootstrap";

type Props = {
    decks: Deck[],
    sendMessage: (msg: any) => void,
};

export default class DecksComponent extends React.Component<Props, {}> {
    public render() {
        return (
            <ul className="decks">
                {
                    this.props.decks.map((deck, i) =>
                        <div key={deck.id}>
                            <DeckComponent deck={deck}
                                           sendMessage={this.props.sendMessage}/>
                        </div>)
                }
                <Button size="sm"
                        onClick={() => this.props.sendMessage({
                            messageType: "add_deck"
                        })}
                >
                    Add deck
                </Button>
            </ul>
        );
    }
}
