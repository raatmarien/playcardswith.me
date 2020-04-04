import React from 'react';
import Navbar from 'react-bootstrap/Navbar';
import Form from 'react-bootstrap/Form';
import {FormControl, Row, Col} from 'react-bootstrap';
import {Player} from "cards-library";
import "./HeaderComponent.css"

type Props = {
    sendMessage: (msg: any) => void,
    players: Player[],
    currentPlayerId: string,
};

export default class HeaderComponent extends React.Component<Props> {
    playerNameRef: any;

    constructor(props: Props) {
        super(props);
        this.playerNameRef = React.createRef();
    }

    public onNameChange() {
        this.props.sendMessage({
            messageType: "update_player_name",
            username: this.getGivenPlayerName(),
            playerId: this.props.currentPlayerId,
        });
    }

    private getGivenPlayerName() {
        let input = this.playerNameRef.current;
        return input && input.value ?
               input.value : this.defaultPlayerName();
    }

    private getPlayerNum() : number {
        for (let i = 0; i < this.props.players.length; i++) {
            if (this.props.players[i].id === this.props.currentPlayerId) {
                return i+1;
            }
        }
        return -1;
    }

    private defaultPlayerName() : string {
        return "Player " + this.getPlayerNum();
    }

    private onSubmitForNameInput(e:any) {
        //Avoid refreshing the page
        e.preventDefault();

        //Deselect the text input (esp. important on mobile)
        e.target[0].blur();
    }

    public render() {
        this.onNameChange();
        return (
            <Navbar bg="light" expand="lg">
                <Navbar.Brand href="/">
                    <img
                        src="/img/logo-2-favicon.svg"
                        width="30"
                        height="30"
                        className="d-inline-block align-top"
                        alt="PlayCardsWith.Me logo"
                    />{' '}
                    PlayCardsWith.Me
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav"
                                 className="justify-content-end">
                    <Row>
                        <Col>
                            <Form inline onSubmit={this.onSubmitForNameInput}>
                                <Form.Group>
                                    <Form.Label>Your name: </Form.Label>
                                    <FormControl
                                        className="ml-2"
                                        id="nameInput"
                                        ref={this.playerNameRef}
                                        type="text"
                                        placeholder={this.defaultPlayerName()}
                                        onChange={this.onNameChange.bind(this)} />
                                </Form.Group>
                            </Form>
                        </Col>
                        <Col>
                            <Form inline>
                                <Form.Group>
                                    <Form.Label>Room share link: </Form.Label>
                                    <FormControl type="text"
                                                 id="linkInput"
                                                 className="ml-2"
                                                 value={window.location.href}
                                                 disabled={true} />
                                </Form.Group>
                            </Form>
                        </Col>
                    </Row>
                </Navbar.Collapse>
            </Navbar>
        );
    }
}
