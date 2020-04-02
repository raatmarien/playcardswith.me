import React from "react";
import {Deck} from "cards-library";
import DeckComponent from "./DeckComponent";
import "./DecksComponent.css";
import {Button} from "react-bootstrap";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import {CirclePicker} from "react-color";

type Props = {
    decks: Deck[],
    sendMessage: (msg: any) => void,
    deckRefs: { [id: number] : React.RefObject<HTMLDivElement> },
};

type State = {
    show: boolean,
    includedCards: string[],
    includedSuits: string[],
    amountOfEach: number,
    deckColor: string,
    shuffleDeck: boolean,
};

export default class DecksComponent extends React.Component<Props, State> {
    private readonly allCards = ["2", "3", "4", "5", "6", "7", "8", "9", "10",
                                 "J", "Q", "K", "A"];
    private readonly allSuits = ["♠", "♥", "♦", "♣"];
    private readonly possibleColors = [
        "#b90e0e",
        "#b9690e",
        "#c3b004",
        "#83be04",
        "#2a660a",
        "#0bb177",
        "#0a9e99",
        "#0a6a9e",
        "#081e81",
        "#4c13be",
        "#6d10a2",
        "#a2109b",
        "#a21057",
        "#493232",
        "#323449",
        "#324932",
        "#494732",
        "#470200",
        "#474100",
        "#004711",
        "#0e0047",
        "#470047"]

    constructor(props: Props) {
        super(props);
        this.state = this.defaultNewDeckState();
    }

    private defaultNewDeckState() {
        return {
            show: false,
            includedCards: this.allCards,
            includedSuits: this.allSuits,
            amountOfEach: 1,
            deckColor: this.possibleColors[this.props.decks.length
                % this.possibleColors.length],
            shuffleDeck: true,
        };
    }

    private setShow(showDialog: boolean) {
        let state = this.defaultNewDeckState();
        state.show = true;
        this.setState(state);
    }

    private getNextTotalCards() {
        return (this.state.includedCards.length
            * this.state.includedSuits.length
            * this.state.amountOfEach);
    }

    private getOptionsFromEvent(event: any) {
        return [...event.target.selectedOptions].map((o: any) => o.value);
    }

    private handleIncludedCardsChanged(event: any) {
        this.setState({ includedCards: this.getOptionsFromEvent(event) });
    }

    private handleIncludedSuitsChanged(event: any) {
        this.setState({ includedSuits: this.getOptionsFromEvent(event) });
    }

    private handleAmountOfEachChanged(event: any) {
        this.setState({ amountOfEach: event.target.value });
    }

    private handleShuffleDeckChanged(event: any) {
        this.setState({ shuffleDeck: event.target.checked });
    }

    private createDeck() {
        this.props.sendMessage({
            messageType: "add_deck",
            includedCards: this.state.includedCards,
            includedSuits: this.state.includedSuits,
            amountOfEach: this.state.amountOfEach,
            deckColor: this.state.deckColor,
            shuffleDeck: this.state.shuffleDeck,
        });
        this.setState(this.defaultNewDeckState());
    }
    
    public render() {
        return (
            <ul className="decks">
                {
                    this.props.decks.map((deck, i) =>
                        <div key={deck.id}>
                            <DeckComponent deck={deck}
                                           deckRef={this.props.deckRefs[deck.id]}
                                           sendMessage={this.props.sendMessage}/>
                        </div>)
                }
                <Button size="sm"
                        onClick={() => this.setShow(true)} >
                    Add deck
                </Button>
                <Modal show={this.state.show}
                       onHide={() => this.setShow(false)}
                       centered >
                    <Modal.Header closeButton>
                        <Modal.Title>Create a deck</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form>
                            <Form.Group controlId="includedCards" >
                                <Form.Label>
                                    Included cards
                                </Form.Label>
                                <Form.Control value={this.state.includedCards}
                                              onChange={this.handleIncludedCardsChanged.bind(this)}
                                              as="select" multiple>
                                    {
                                        this.allCards.map((c) => {
                                            return (<option
                                                        value={c}>
                                                {c}
                                            </option>);
                                        })
                                    }
                                </Form.Control>
                            </Form.Group>
                            <Form.Group controlId="includedSuits" >
                                <Form.Label>
                                    Included suits
                                </Form.Label>
                                <Form.Control value={this.state.includedSuits}
                                              onChange={this.handleIncludedSuitsChanged.bind(this)}
                                              as="select" multiple>
                                    {
                                        this.allSuits.map((s, i) => {
                                            return (<option
                                                        value={s}
                                                        className={i > 1 ?
                                                                  "red-option" : ""}
                                                        selected>
                                                {s}
                                            </option>);
                                        })
                                    }
                                </Form.Control>
                            </Form.Group>
                            <Form.Group controlId="amountOfEach" >
                                <Form.Label>
                                    Amount of copies
                                </Form.Label>
                                <Form.Control type="number"
                                              value={this.state.amountOfEach}
                                              onChange={this.handleAmountOfEachChanged.bind(this)} />
                            </Form.Group>
                            <Form.Label>
                                {this.getNextTotalCards()} cards in total.
                            </Form.Label>
                            <Form.Group controlId="deckColor" >
                                <Form.Label>
                                    Deck color
                                </Form.Label>
                                <CirclePicker
                                    colors={this.possibleColors}
                                    color={this.state.deckColor}
                                    width="466px"
                                    onChangeComplete={(c) =>
                                        this.setState({deckColor: c.hex})}/>
                            </Form.Group> 
                            <Form.Check
                                id="shuffleDeck"
                                type="checkbox"
                                label="Shuffle deck"
                                checked={this.state.shuffleDeck}
                                onChange={this.handleShuffleDeckChanged.bind(this)} />
                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => this.setShow(false)}>
                            Cancel
                        </Button>
                        <Button variant="primary" onClick={() => this.createDeck()}>
                            Create deck
                        </Button>
                    </Modal.Footer>
                </Modal>
            </ul>
        );
    }
}
