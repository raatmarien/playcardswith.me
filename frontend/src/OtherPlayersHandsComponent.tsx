import React from 'react';
import Card from 'react-bootstrap/Card';
import {Row, Col} from 'react-bootstrap';
import {Player, Deck, Card as LCard} from 'cards-library';
import "./OtherPlayersHandsComponent.css";
import randomColor from "randomcolor";

type Props = {
    players: Player[],
    decks: Deck[],
    currentPlayerId: string | null,
};

export default class OtherPlayersHandsComponent extends React.Component<Props> {
    private getColorFor(c: LCard) {
        let deck = this.findCardDeck(c);
        if (deck) {
            return deck.color;
        } else {
            return "#000000";
        }
    }

    private findCardDeck(card: LCard) : Deck | null {
        for (let i = 0; i < this.props.decks.length; i++) {
            if (this.props.decks[i].id === card.deckId) {
                return this.props.decks[i];
            }
        }
        return null;
    }

    public render() {
        return (<div className="other-players-hands">
    {this.props.players.filter((p) => p.id !== this.props.currentPlayerId).map((player) => {
    return (<Card style={{ width: "18rem" }}
                  className="mr-2 mt-2">
    <Card.Body>
        <Card.Title
        style={{color: randomColor({
              seed: player.id
              })}}>
            {player.name}
        </Card.Title>
    </Card.Body>
    <div style={{ height: "55px" }}>
        <Row className="cards-row">
            {player.hand.slice(0, 6).map((c) => {
                 return <Col className="small-card" md="auto"
                        style={{backgroundColor: this.getColorFor(c)}}/>;
            })}
            {(player.hand.length > 6 ?
            (<Col md="auto">+{player.hand.length - 6}</Col>)
            : (<div></div>))
            }   
        </Row>
    </div>
    </Card>)
     })}
        </div>);
    }
}
