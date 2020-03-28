import React from "react";
import {Deck} from "cards-library";
import "./DeckComponent.css";
import {DropdownButton, Dropdown} from "react-bootstrap";


type Props = {
    deck: Deck,
    sendMessage: (msg: any) => void,
    onClick: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void,
}

export default class DeckComponent extends React.Component<Props, {}> {
    constructor(props: Props) {
        super(props);

        this.state = {
            showMenu: false,
        };
    }

    private recallToThisDeck() {
        this.props.sendMessage({
            messageType: "recall_to_deck",
            deckId: this.props.deck.id,
        });
    }

    public render() {
        return (
            <div className="deck">
                <DropdownButton title="&#8942;" id="deck-menu-button"
                                bsPrefix="custom-menu-btn"
                >
                    <Dropdown.Item onClick={this.recallToThisDeck.bind(this)}>
                        Recall
                    </Dropdown.Item>
                    <Dropdown.Item>Shuffle</Dropdown.Item>
                </DropdownButton>
                <div className="inner-deck" onClick={this.props.onClick}>
                    <div>
                        {this.props.deck.cards.length} cards
                    </div>
                </div>
            </div>
        );
    }
}
