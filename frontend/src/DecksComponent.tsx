import React from "react";
import {Deck} from "cards-library";
import DeckComponent from "./DeckComponent";
import "./DecksComponent.css";
import {Button} from "react-bootstrap";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import Alert from "react-bootstrap/Alert";
import {CirclePicker} from "react-color";
import Select from "react-select";

type Props = {
    decks: Deck[],
    sendMessage: (msg: any) => void,
    deckRefs: { [id: number] : React.RefObject<HTMLDivElement> },
};

type State = {
    show: boolean,
    includedCards: any[],
    includedSuits: any[],
    amountOfEach: number,
    deckColor: string,
    shuffleDeck: boolean,
};

export default class DecksComponent extends React.Component<Props, State> {
    private readonly allCardOptions = [
        { value: "2", label: "2" },
        { value: "3", label: "3" },
        { value: "4", label: "4" },
        { value: "5", label: "5" },
        { value: "6", label: "6" },
        { value: "7", label: "7" },
        { value: "8", label: "8" },
        { value: "9", label: "9" },
        { value: "10", label: "10" },
        { value: "J", label: "Jack" },
        { value: "Q", label: "Queen" },
        { value: "K", label: "King" },
        { value: "A", label: "Ace" }]
    private readonly allSuitOptions = [
        { value: "♠", label: "♠ Clubs" },
        { value: "♣", label: "♣ Clovers" },
        { value: "♥", label: "♥ Hearts" },
        { value: "♦", label: "♦ Diamonds" }]
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
            includedCards: this.allCardOptions,
            includedSuits: this.allSuitOptions,
            amountOfEach: 1,
            deckColor: this.possibleColors[this.props.decks.length
                % this.possibleColors.length],
            shuffleDeck: true,
        };
    }

    private setShow(showDialog: boolean) {
        if (showDialog) {
            let state = this.defaultNewDeckState();
            state.show = true;
            this.setState(state);
        } else {
            this.setState({ show: false })
        }
    }

    private getNextTotalCards() {
        return (this.state.includedCards.length
            * this.state.includedSuits.length
            * this.state.amountOfEach);
    }

    private getOptionsFromEvent(event: any) {
        return [...event.target.selectedOptions].map((o: any) => o.value);
    }

    private handleIncludedCardsChanged(selectedOptions: any) {
        this.setState({ includedCards: selectedOptions });
    }

    private handleIncludedSuitsChanged(selectedOptions: any) {
        this.setState({ includedSuits: selectedOptions });
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
            includedCards: this.state.includedCards.map((o) => o.value),
            includedSuits: this.state.includedSuits.map((o) => o.value),
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
                                <Select
                                    id="includedCards"
                                    value={this.state.includedCards}
                                    options={this.allCardOptions}
                                    onChange={this.handleIncludedCardsChanged.bind(this)}
                                    isMulti={true} />
                            </Form.Group>
                            <Form.Group controlId="includedSuits" >
                                <Form.Label>
                                    Included suits
                                </Form.Label>
                                <Select
                                    id="includedSuits"
                                    value={this.state.includedSuits}
                                    options={this.allSuitOptions}
                                    onChange={this.handleIncludedSuitsChanged.bind(this)}
                                    isMulti={true} />
                            </Form.Group>
                            <Form.Group controlId="amountOfEach" >
                                <Form.Label>
                                    Amount of copies
                                </Form.Label>
                                <Form.Text className="text-muted">
                                    
                                </Form.Text>
                                <Form.Control type="number"
                                              value={this.state.amountOfEach}
                                              onChange={this.handleAmountOfEachChanged.bind(this)} />
                                <Form.Text className="text-muted">
                                    The amount of copies of each
                                    specific card, like the A♥. It's
                                    like adding multiple decks of cards
                                    into one big stack.
                                </Form.Text>
                            </Form.Group>
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
                            <Alert variant="info" className="mt-3 mb-0">
                                {this.getNextTotalCards()} cards in total.
                            </Alert>
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
