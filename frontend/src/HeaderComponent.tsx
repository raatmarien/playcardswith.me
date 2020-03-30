import React from 'react';
import Navbar from 'react-bootstrap/Navbar';
import Form from 'react-bootstrap/Form';
import {Player} from "cards-library";

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

    public render() {
        this.onNameChange();
        return (
            <Navbar bg="light">
                <Navbar.Brand href="/">PlayCardsWith.Me</Navbar.Brand>
                <Navbar.Collapse>
                    <Form inline>
                        <Form.Control
                            ref={this.playerNameRef}
                            type="text"
                            placeholder={this.defaultPlayerName()}
                            onChange={this.onNameChange.bind(this)} />
                    </Form>
                </Navbar.Collapse>
            </Navbar>
        );
    }
}
